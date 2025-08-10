/**
 * Key used in localStorage to store tasks
 * @constant {string}
 */
const TASKS_STORAGE_KEY = 'kanban_tasks';

/**
 * Loads tasks from localStorage or returns default tasks if none found.
 * @returns {Array<{id:number, title:string, description:string, status:string}>}
 */
function loadTasks() {
  const stored = localStorage.getItem(TASKS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Error parsing stored tasks:', e);
    }
  }
  // Default sample tasks if none in storage
  return [
    { id: 1, title: "Launch Epic Career 🚀", description: "", status: "todo" },
    { id: 2, title: "Conquer React 🧬", description: "", status: "todo" },
    { id: 3, title: "Understand Databases ⚙️", description: "", status: "todo" },
    { id: 4, title: "Crush Frameworks 🖼️", description: "", status: "todo" },
    { id: 5, title: "Master JavaScript 💛", description: "", status: "doing" },
    { id: 6, title: "Never Give Up 🏆", description: "", status: "doing" },
    { id: 7, title: "Explore ES6 Features 🚀", description: "", status: "done" },
    { id: 8, title: "Have fun 🥳", description: "", status: "done" },
  ];
}

/**
 * Saves tasks array to localStorage
 * @param {Array} tasks
 */
function saveTasks(tasks) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Renders tasks into their respective columns based on status.
 * Also attaches click listeners to each task to open modal with details.
 * @param {Array} tasks
 */
function renderTasks(tasks) {
  const todoContainer = document.querySelector('.tasks-container[data-status="todo"]');
  const doingContainer = document.querySelector('.tasks-container[data-status="doing"]');
  const doneContainer = document.querySelector('.tasks-container[data-status="done"]');

  todoContainer.innerHTML = '';
  doingContainer.innerHTML = '';
  doneContainer.innerHTML = '';

  tasks.forEach(task => {
    const div = document.createElement('div');
    div.classList.add('task-div');
    div.textContent = task.title;
    div.dataset.taskId = task.id;

    // When task is clicked, open modal with details
    div.addEventListener('click', () => openTaskModal(task, tasks));

    if (task.status === 'todo') todoContainer.appendChild(div);
    else if (task.status === 'doing') doingContainer.appendChild(div);
    else if (task.status === 'done') doneContainer.appendChild(div);
  });

  // Update counts in header
  document.getElementById('todoText').textContent = `TODO (${tasks.filter(t => t.status === 'todo').length})`;
  document.getElementById('doingText').textContent = `DOING (${tasks.filter(t => t.status === 'doing').length})`;
  document.getElementById('doneText').textContent = `DONE (${tasks.filter(t => t.status === 'done').length})`;
}

/**
 * Opens the modal for adding a new task or viewing/editing an existing one.
 * @param {Object|null} task - The task to view/edit, or null for new.
 * @param {Array} tasks - The full task list (used for saving edits).
 */
function openTaskModal(task, tasks) {
  const modal = document.getElementById('modal');
  const titleInput = document.getElementById('taskTitleInput');
  const descInput = document.getElementById('taskDescriptionInput');
  const statusSelect = document.getElementById('taskStatusInput');
  const saveBtn = document.getElementById('saveTaskBtn');
  const modalHeading = document.querySelector('#modal-content h1');

  modal.style.display = 'flex';

  if (task) {
    // Viewing/editing existing task
    modalHeading.textContent = 'Edit Task';
    titleInput.value = task.title;
    descInput.value = task.description || '';
    statusSelect.value = task.status;
    saveBtn.textContent = 'Save Changes';

    // Remove previous event listener to avoid duplicates
    saveBtn.replaceWith(saveBtn.cloneNode(true));
    const newSaveBtn = document.getElementById('saveTaskBtn');

    newSaveBtn.addEventListener('click', () => {
      const newTitle = titleInput.value.trim();
      const newDesc = descInput.value.trim();
      const newStatus = statusSelect.value;

      if (!newTitle) {
        alert('Please enter a task title.');
        return;
      }

      // Update task in tasks array
      const idx = tasks.findIndex(t => t.id === task.id);
      if (idx !== -1) {
        tasks[idx].title = newTitle;
        tasks[idx].description = newDesc;
        tasks[idx].status = newStatus;
      }

      saveTasks(tasks);
      renderTasks(tasks);
      modal.style.display = 'none';
    });

  } else {
    // Adding new task
    modalHeading.textContent = 'Add New Task';
    titleInput.value = '';
    descInput.value = '';
    statusSelect.value = 'todo';
    saveBtn.textContent = 'Create Task';

    saveBtn.replaceWith(saveBtn.cloneNode(true));
    const newSaveBtn = document.getElementById('saveTaskBtn');

    newSaveBtn.addEventListener('click', () => {
      const title = titleInput.value.trim();
      const description = descInput.value.trim();
      const status = statusSelect.value;

      if (!title) {
        alert('Please enter a task title.');
        return;
      }

      // Create new task with unique id
      const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      const newTask = { id: newId, title, description, status };

      tasks.push(newTask);
      saveTasks(tasks);
      renderTasks(tasks);
      modal.style.display = 'none';
    });
  }
}

/**
 * Sets up modal close button and outside-click close.
 */
function setupModalClose() {
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('close-modal');

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

/**
 * Main app initialization function.
 */
function init() {
  let tasks = loadTasks();

  renderTasks(tasks);
  setupModalClose();

  const addTaskBtn = document.getElementById('addTaskBtn');
  addTaskBtn.addEventListener('click', () => openTaskModal(null, tasks));
}

// Start app after DOM loaded
window.addEventListener('DOMContentLoaded', init);
