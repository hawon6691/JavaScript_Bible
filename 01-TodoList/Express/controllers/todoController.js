/**
 * Todo Controller
 *
 * What: HTTP 요청 처리 및 응답 생성
 * Why: HTTP 계층과 비즈니스 로직 분리
 * How: 요청 검증 → Service 호출 → 응답 반환
 */

const todoService = require('../services/todoService');
const validator = require('../utils/validator');
const response = require('../utils/response');
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../utils/constants');

/**
 * POST /todos - Todo 생성
 */
async function createTodo(req, res, next) {
  try {
    // 입력값 검증
    const validationError = validator.validateCreateTodo(req.body);
    if (validationError) {
      return response.badRequest(res, validationError);
    }

    // 서비스 호출
    const todo = await todoService.createTodo(req.body);

    // 응답 전송
    return response.created(res, todo, SUCCESS_MESSAGES.TODO_CREATED);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /todos - 모든 Todo 조회
 */
async function getAllTodos(req, res, next) {
  try {
    const { todos, count } = await todoService.getAllTodos();

    const message = count > 0
      ? SUCCESS_MESSAGES.TODOS_RETRIEVED
      : SUCCESS_MESSAGES.NO_TODOS_FOUND;

    return response.ok(res, todos, message, { count });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /todos/:id - 특정 Todo 조회
 */
async function getTodoById(req, res, next) {
  try {
    const { id } = req.params;
    const todo = await todoService.getTodoById(id);

    if (!todo) {
      return response.notFound(res, ERROR_MESSAGES.TODO_NOT_FOUND(id));
    }

    return response.ok(res, todo, SUCCESS_MESSAGES.TODO_RETRIEVED);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /todos/:id - Todo 전체 수정
 */
async function updateTodo(req, res, next) {
  try {
    const { id } = req.params;

    // 입력값 검증
    const validationError = validator.validateUpdateTodo(req.body);
    if (validationError) {
      return response.badRequest(res, validationError);
    }

    // 서비스 호출
    const todo = await todoService.updateTodo(id, req.body);

    if (!todo) {
      return response.notFound(res, ERROR_MESSAGES.TODO_NOT_FOUND(id));
    }

    return response.ok(res, todo, SUCCESS_MESSAGES.TODO_UPDATED);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /todos/:id - Todo 부분 수정
 */
async function patchTodo(req, res, next) {
  try {
    const { id } = req.params;

    // 입력값 검증
    const validationError = validator.validatePatchTodo(req.body);
    if (validationError) {
      return response.badRequest(res, validationError);
    }

    // 서비스 호출
    const todo = await todoService.patchTodo(id, req.body);

    if (!todo) {
      return response.notFound(res, ERROR_MESSAGES.TODO_NOT_FOUND(id));
    }

    return response.ok(res, todo, SUCCESS_MESSAGES.TODO_UPDATED);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /todos/:id/toggle - Todo 완료 상태 토글
 */
async function toggleTodo(req, res, next) {
  try {
    const { id } = req.params;
    const todo = await todoService.toggleTodo(id);

    if (!todo) {
      return response.notFound(res, ERROR_MESSAGES.TODO_NOT_FOUND(id));
    }

    return response.ok(res, todo, SUCCESS_MESSAGES.TODO_TOGGLED);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /todos/:id - Todo 삭제
 */
async function deleteTodo(req, res, next) {
  try {
    const { id } = req.params;
    const todo = await todoService.deleteTodo(id);

    if (!todo) {
      return response.notFound(res, ERROR_MESSAGES.TODO_NOT_FOUND(id));
    }

    return response.ok(res, todo, SUCCESS_MESSAGES.TODO_DELETED);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  patchTodo,
  toggleTodo,
  deleteTodo,
};
