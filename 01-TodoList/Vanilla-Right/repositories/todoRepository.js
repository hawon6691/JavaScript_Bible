/**
 * Todo Repository (Memory + File Backup)
 *
 * What: Todo 데이터 접근 계층
 * Why: 데이터 저장소를 추상화하여 비즈니스 로직과 분리
 * How: 메모리 배열에 CRUD 연산 구현, 파일로 백업 지원
 */

const fs = require('fs').promises;
const path = require('path');

// 데이터 파일 경로
const DATA_FILE = path.join(__dirname, '../data/todos.json');

// 메모리 저장소
let todos = [];

/**
 * 파일에서 데이터 로드 (서버 시작 시)
 *
 * @returns {Promise<void>}
 */
async function load() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    todos = JSON.parse(data);
    console.log(`  Loaded ${todos.length} todos from file`);
  } catch (error) {
    // 파일이 없으면 빈 배열로 시작
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
 * 데이터를 파일로 백업
 *
 * @returns {Promise<void>}
 */
async function backup() {
  try {
    // data 디렉토리가 없으면 생성
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });

    await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf8');
    console.log(`  Backed up ${todos.length} todos to file`);
  } catch (error) {
    console.error('  Error backing up data:', error.message);
    throw error;
  }
}

/**
 * 새로운 Todo 저장
 *
 * @param {Object} todo - 저장할 Todo 객체
 * @returns {Promise<Object>} 저장된 Todo 객체
 */
async function save(todo) {
  todos.push(todo);
  return todo;
}

/**
 * 모든 Todo 조회
 * 생성 시간 기준 최신순 정렬
 *
 * @returns {Promise<Array>} Todo 배열
 */
async function findAll() {
  return [...todos].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
}

/**
 * ID로 특정 Todo 조회
 *
 * @param {string} id - Todo ID
 * @returns {Promise<Object|null>} Todo 객체 또는 null
 */
async function findById(id) {
  return todos.find(todo => todo.id === id) || null;
}

/**
 * Todo 업데이트
 *
 * @param {string} id - Todo ID
 * @param {Object} updatedTodo - 업데이트된 Todo 객체
 * @returns {Promise<Object|null>} 업데이트된 Todo 또는 null
 */
async function update(id, updatedTodo) {
  const index = todos.findIndex(todo => todo.id === id);

  if (index === -1) {
    return null;
  }

  todos[index] = updatedTodo;
  return todos[index];
}

/**
 * Todo 삭제
 *
 * @param {string} id - Todo ID
 * @returns {Promise<Object|null>} 삭제된 Todo 또는 null
 */
async function remove(id) {
  const index = todos.findIndex(todo => todo.id === id);

  if (index === -1) {
    return null;
  }

  const [removed] = todos.splice(index, 1);
  return removed;
}

/**
 * 전체 Todo 개수 조회
 *
 * @returns {Promise<number>} Todo 개수
 */
async function count() {
  return todos.length;
}

/**
 * 모든 Todo 삭제 (테스트용)
 *
 * @returns {Promise<void>}
 */
async function clear() {
  todos = [];
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
  clear
};
