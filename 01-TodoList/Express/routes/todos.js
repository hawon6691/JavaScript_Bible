/**
 * Todo Routes
 *
 * What: Todo API 엔드포인트 정의
 * Why: URL과 Controller 매핑을 명확하게 분리
 * How: Express Router를 사용한 선언적 라우팅
 */

const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

/**
 * @route   POST /todos
 * @desc    Create a new todo
 * @access  Public
 */
router.post('/', todoController.createTodo);

/**
 * @route   GET /todos
 * @desc    Get all todos
 * @access  Public
 */
router.get('/', todoController.getAllTodos);

/**
 * @route   GET /todos/:id
 * @desc    Get a specific todo by ID
 * @access  Public
 */
router.get('/:id', todoController.getTodoById);

/**
 * @route   PUT /todos/:id
 * @desc    Update a todo (full replacement)
 * @access  Public
 */
router.put('/:id', todoController.updateTodo);

/**
 * @route   PATCH /todos/:id
 * @desc    Update a todo (partial)
 * @access  Public
 */
router.patch('/:id', todoController.patchTodo);

/**
 * @route   PATCH /todos/:id/toggle
 * @desc    Toggle todo completion status
 * @access  Public
 */
router.patch('/:id/toggle', todoController.toggleTodo);

/**
 * @route   DELETE /todos/:id
 * @desc    Delete a todo
 * @access  Public
 */
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
