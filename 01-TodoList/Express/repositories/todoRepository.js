/**
 * Todo Repository
 *
 * What: Todo 데이터의 저장, 조회, 수정, 삭제
 * Why: 데이터 접근 로직을 분리하여 저장소 변경 용이
 * How: 메모리 저장 + 파일 백업 방식
 */

const fs = require('fs').promises;
const path = require('path');
const config = require('../config/config');

// 메모리 저장소
let todos = [];

// 파일 경로
const dataFilePath = path.join(__dirname, '..', config.data.filePath);

/**
 * 파일에서 데이터 로드
 */
async function load() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    todos = JSON.parse(data);
    console.log(`  Loaded ${todos.length} todos from file`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      todos = [];
      console.log('  No existing data file, starting fresh');
    } else {
      console.error('  Error loading data:', error.message);
      todos = [];
    }
  }
}

/**
 * 파일로 데이터 백업
 */
async function backup() {
  try {
    const dirPath = path.dirname(dataFilePath);
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(todos, null, 2), 'utf8');
    console.log(`  Backed up ${todos.length} todos to file`);
  } catch (error) {
    console.error('  Error backing up data:', error.message);
    throw error;
  }
}

/**
 * 새 Todo 저장
 *
 * @param {Object} todo - 저장할 Todo 객체
 * @returns {Object} 저장된 Todo
 */
async function save(todo) {
  todos.push(todo);
  return todo;
}

/**
 * 모든 Todo 조회 (최신순 정렬)
 *
 * @returns {Array} Todo 배열
 */
async function findAll() {
  return [...todos].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

/**
 * ID로 Todo 조회
 *
 * @param {string} id - Todo ID
 * @returns {Object|null} Todo 또는 null
 */
async function findById(id) {
  return todos.find((todo) => todo.id === id) || null;
}

/**
 * Todo 업데이트
 *
 * @param {string} id - Todo ID
 * @param {Object} updatedTodo - 업데이트된 Todo 객체
 * @returns {Object|null} 업데이트된 Todo 또는 null
 */
async function update(id, updatedTodo) {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return null;
  }

  todos[index] = updatedTodo;
  return updatedTodo;
}

/**
 * Todo 삭제
 *
 * @param {string} id - Todo ID
 * @returns {Object|null} 삭제된 Todo 또는 null
 */
async function remove(id) {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return null;
  }

  const [removed] = todos.splice(index, 1);
  return removed;
}

/**
 * 전체 개수 조회
 *
 * @returns {number} Todo 개수
 */
async function count() {
  return todos.length;
}

module.exports = {
  load,
  backup,
  save,
  findAll,
  findById,
  update,
  remove,
  count,
};
