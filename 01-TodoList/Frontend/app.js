/**
 * TodoList Frontend Application
 *
 * What: 프론트엔드 UI 및 API 통신
 * Why: 모든 백엔드(Vanilla, Express, NestJS, Fastify)와 호환되는 클라이언트
 * How: Vanilla JavaScript + Fetch API
 */

// ===========================================
// State (상태 관리)
// ===========================================

const state = {
  serverUrl: 'http://localhost:3000',
  todos: [],
  filter: 'all', // 'all' | 'active' | 'completed'
  isConnected: false,
};

// ===========================================
// DOM Elements (DOM 요소)
// ===========================================

const elements = {
  serverUrl: document.getElementById('serverUrl'),
  connectBtn: document.getElementById('connectBtn'),
  connectionStatus: document.getElementById('connectionStatus'),
  todoForm: document.getElementById('todoForm'),
  todoTitle: document.getElementById('todoTitle'),
  todoDescription: document.getElementById('todoDescription'),
  todoList: document.getElementById('todoList'),
  todoCount: document.getElementById('todoCount'),
  filterBtns: document.querySelectorAll('.filter-btn'),
  errorMessage: document.getElementById('errorMessage'),
  editModal: document.getElementById('editModal'),
  editForm: document.getElementById('editForm'),
  editId: document.getElementById('editId'),
  editTitle: document.getElementById('editTitle'),
  editDescription: document.getElementById('editDescription'),
  cancelEdit: document.getElementById('cancelEdit'),
};

// ===========================================
// API Functions (API 호출)
// ===========================================

const api = {
  /**
   * API 요청 헬퍼
   */
  async request(endpoint, options = {}) {
    const url = `${state.serverUrl}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError') {
        throw new Error('Cannot connect to server. Is the server running?');
      }
      throw error;
    }
  },

  /**
   * 서버 연결 테스트
   */
  async testConnection() {
    return await this.request('/todos');
  },

  /**
   * 모든 Todo 조회
   */
  async getAllTodos() {
    const result = await this.request('/todos');
    return result.data;
  },

  /**
   * Todo 생성
   */
  async createTodo(data) {
    const result = await this.request('/todos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data;
  },

  /**
   * Todo 수정
   */
  async updateTodo(id, data) {
    const result = await this.request(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return result.data;
  },

  /**
   * Todo 토글
   */
  async toggleTodo(id) {
    const result = await this.request(`/todos/${id}/toggle`, {
      method: 'PATCH',
    });
    return result.data;
  },

  /**
   * Todo 삭제
   */
  async deleteTodo(id) {
    const result = await this.request(`/todos/${id}`, {
      method: 'DELETE',
    });
    return result.data;
  },
};

// ===========================================
// Render Functions (렌더링)
// ===========================================

/**
 * Todo 목록 렌더링
 */
function renderTodos() {
  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    elements.todoList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <p>${getEmptyMessage()}</p>
      </div>
    `;
  } else {
    elements.todoList.innerHTML = filteredTodos
      .map((todo) => createTodoHTML(todo))
      .join('');
  }

  // Todo 개수 업데이트
  const activeCount = state.todos.filter((t) => !t.completed).length;
  elements.todoCount.textContent = activeCount;
}

/**
 * 필터링된 Todo 반환
 */
function getFilteredTodos() {
  switch (state.filter) {
    case 'active':
      return state.todos.filter((todo) => !todo.completed);
    case 'completed':
      return state.todos.filter((todo) => todo.completed);
    default:
      return state.todos;
  }
}

/**
 * 빈 상태 메시지
 */
function getEmptyMessage() {
  switch (state.filter) {
    case 'active':
      return 'No active todos. Great job!';
    case 'completed':
      return 'No completed todos yet.';
    default:
      return 'No todos yet. Add one above!';
  }
}

/**
 * Todo HTML 생성
 */
function createTodoHTML(todo) {
  const createdDate = new Date(todo.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
    <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
      <div class="todo-checkbox" onclick="handleToggle('${todo.id}')"></div>
      <div class="todo-content">
        <div class="todo-title">${escapeHTML(todo.title)}</div>
        ${todo.description ? `<div class="todo-description">${escapeHTML(todo.description)}</div>` : ''}
        <div class="todo-meta">Created: ${createdDate}</div>
      </div>
      <div class="todo-actions">
        <button class="action-btn edit" onclick="handleEdit('${todo.id}')" title="Edit">
          ✏️
        </button>
        <button class="action-btn delete" onclick="handleDelete('${todo.id}')" title="Delete">
          🗑️
        </button>
      </div>
    </div>
  `;
}

/**
 * HTML 이스케이프 (XSS 방지)
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * 연결 상태 업데이트
 */
function updateConnectionStatus(connected) {
  state.isConnected = connected;
  elements.connectionStatus.textContent = connected ? 'Connected' : 'Disconnected';
  elements.connectionStatus.className = connected
    ? 'status status-connected'
    : 'status status-disconnected';
}

/**
 * 에러 메시지 표시
 */
function showError(message) {
  elements.errorMessage.textContent = message;
  elements.errorMessage.classList.remove('hidden');

  setTimeout(() => {
    elements.errorMessage.classList.add('hidden');
  }, 5000);
}

/**
 * 로딩 표시
 */
function showLoading() {
  elements.todoList.innerHTML = '<div class="loading">Loading...</div>';
}

// ===========================================
// Event Handlers (이벤트 핸들러)
// ===========================================

/**
 * 서버 연결
 */
async function handleConnect() {
  state.serverUrl = elements.serverUrl.value.trim().replace(/\/$/, '');

  try {
    showLoading();
    await api.testConnection();
    updateConnectionStatus(true);
    await loadTodos();
  } catch (error) {
    updateConnectionStatus(false);
    showError(error.message);
    elements.todoList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔌</div>
        <p>Cannot connect to server</p>
      </div>
    `;
  }
}

/**
 * Todo 목록 로드
 */
async function loadTodos() {
  try {
    state.todos = await api.getAllTodos();
    renderTodos();
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Todo 생성
 */
async function handleCreate(e) {
  e.preventDefault();

  const title = elements.todoTitle.value.trim();
  const description = elements.todoDescription.value.trim();

  if (!title) {
    showError('Title is required');
    return;
  }

  try {
    const newTodo = await api.createTodo({ title, description });
    state.todos.unshift(newTodo);
    renderTodos();

    // 폼 초기화
    elements.todoTitle.value = '';
    elements.todoDescription.value = '';
    elements.todoTitle.focus();
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Todo 토글
 */
async function handleToggle(id) {
  try {
    const updatedTodo = await api.toggleTodo(id);
    const index = state.todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      state.todos[index] = updatedTodo;
      renderTodos();
    }
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Todo 편집 모달 열기
 */
function handleEdit(id) {
  const todo = state.todos.find((t) => t.id === id);
  if (!todo) return;

  elements.editId.value = todo.id;
  elements.editTitle.value = todo.title;
  elements.editDescription.value = todo.description || '';
  elements.editModal.classList.remove('hidden');
  elements.editTitle.focus();
}

/**
 * Todo 편집 저장
 */
async function handleSaveEdit(e) {
  e.preventDefault();

  const id = elements.editId.value;
  const title = elements.editTitle.value.trim();
  const description = elements.editDescription.value.trim();

  if (!title) {
    showError('Title is required');
    return;
  }

  try {
    const updatedTodo = await api.updateTodo(id, { title, description });
    const index = state.todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      state.todos[index] = updatedTodo;
      renderTodos();
    }
    closeEditModal();
  } catch (error) {
    showError(error.message);
  }
}

/**
 * 편집 모달 닫기
 */
function closeEditModal() {
  elements.editModal.classList.add('hidden');
}

/**
 * Todo 삭제
 */
async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this todo?')) {
    return;
  }

  try {
    await api.deleteTodo(id);
    state.todos = state.todos.filter((t) => t.id !== id);
    renderTodos();
  } catch (error) {
    showError(error.message);
  }
}

/**
 * 필터 변경
 */
function handleFilter(filter) {
  state.filter = filter;

  // 버튼 활성화 상태 업데이트
  elements.filterBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });

  renderTodos();
}

// ===========================================
// Event Listeners (이벤트 리스너)
// ===========================================

// 서버 연결
elements.connectBtn.addEventListener('click', handleConnect);
elements.serverUrl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleConnect();
  }
});

// Todo 생성
elements.todoForm.addEventListener('submit', handleCreate);

// 필터
elements.filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => handleFilter(btn.dataset.filter));
});

// 편집 모달
elements.editForm.addEventListener('submit', handleSaveEdit);
elements.cancelEdit.addEventListener('click', closeEditModal);
elements.editModal.addEventListener('click', (e) => {
  if (e.target === elements.editModal) {
    closeEditModal();
  }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !elements.editModal.classList.contains('hidden')) {
    closeEditModal();
  }
});

// ===========================================
// Initialize (초기화)
// ===========================================

// 페이지 로드 시 자동 연결 시도
window.addEventListener('load', () => {
  handleConnect();
});

// 전역 함수로 노출 (onclick 핸들러용)
window.handleToggle = handleToggle;
window.handleEdit = handleEdit;
window.handleDelete = handleDelete;
