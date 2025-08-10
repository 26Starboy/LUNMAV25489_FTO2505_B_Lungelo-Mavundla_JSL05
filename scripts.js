// Key used to store tasks in localStorage
const TASKS_STORAGE_KEY = 'kanban_tasks';

/**
 * Loads tasks from localStorage.
 * If none found, sets and returns default tasks.
 * Default tasks saved once on first load only.
 * @returns {Array} tasks array
 */
function loadTasks() {
  const stored = localStorage.getItem(TASKS_STORAGE_KEY); // Try to get saved tasks
  if (stored) {
    try {
      return JSON.parse(stored); // Parse stored tasks JSON and return
    } catch (e) {
      console.warn('Error parsing stored tasks:', e); // Warn if JSON invalid
    }
  }
  // No tasks stored yet: define default tasks array
  const defaultTasks = [
    { id: 1, title: "Launch Epic Career 🚀", description: "", status: "todo" },
    { id: 2, title: "Conquer React 🧬", description: "", status: "todo" },
    { id: 3, title: "Understand Databases ⚙️", description: "", status: "todo" },
    { id: 4, title: "Crush Frameworks 🖼️", description: "", status: "todo" },
    { id: 5, title: "Master JavaScript 💛", description: "", status: "doing" },
    { id: 6, title: "Never Give Up 🏆", description: "", status: "doing" },
    { id: 7, title: "Explore ES6 Features 🚀", description: "", status: "done" },
    { id: 8, title: "Have fun 🥳", description: "", status: "done" },
  ];
  // Save default tasks once to localStorage
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(defaultTasks));
  return defaultTasks; // Return default tasks array
}

/**
 * Stub function to save tasks.
 * 
 * IMPORTANT: We do NOT save tasks after adding or editing,
 * so this function does nothing to prevent persistence of new tasks.
 * This means only default tasks remain after refresh.
 * 
 * @param {Array} tasks - The current tasks array
 */
function saveTasks(tasks) {
  // Intentionally empty to prevent saving after first load
  // So new tasks or edits are NOT persisted on page reload
}

/**
 * Render tasks into their columns based on status.
 * No delete button rendered, as requested.
 * Clicking a task opens modal for editing.
 * 
 * @param {Array} tasks - The current tasks array
 */
function renderTasks(tasks) {
  // Get the containers for the three statuses
  const todoContainer = document.querySelector('.tasks-container[data-status="todo"]');
  const doingContainer = document.querySelector('.tasks-container[data-status="doing"]');
  const doneContainer = document.querySelector('.tasks-container[data-status="done"]');

  // Clear previous tasks so we don't duplicate on re-render
  todoContainer.innerHTML = '';
  doingContainer.innerHTML = '';
  doneContainer.innerHTML = '';

  // Loop over each task and create a div for it
  tasks.forEach(task => {
    const div = document.createElement('div');
    div.classList.add('task-div');
    div.textContent = task.title;  // Show task title inside div
    div.dataset.taskId = task.id;   // Store task id in dataset for reference

    // Clicking the task div opens the modal to edit/view the task
    div.addEventListener('click', () => openTaskModal(task, tasks));

    // Append task to correct container based on its status
    if (task.status === 'todo') todoContainer.appendChild(div);
    else if (task.status === 'doing') doingContainer.appendChild(div);
    else if (task.status === 'done') doneContainer.appendChild(div);
  });

  // Update the column headers to show count of tasks in each status
  document.getElementById('todoText').textContent = `TODO (${tasks.filter(t => t.status === 'todo').length})`;
  document.getElementById('doingText').textContent = `DOING (${tasks.filter(t => t.status === 'doing').length})`;
  document.getElementById('doneText').textContent = `DONE (${tasks.filter(t => t.status === 'done').length})`;
}

/**
 * Opens the modal window for adding a new task or editing an existing one.
 * 
 * @param {Object|null} task - The task to edit, or null to add a new task
 * @param {Array} tasks - The array of all tasks in memory
 */
function openTaskModal(task, tasks) {
  // Get modal and its input fields/buttons
  const modal = document.getElementById('modal');
  const titleInput = document.getElementById('taskTitleInput');
  const descInput = document.getElementById('taskDescriptionInput');
  const statusSelect = document.getElementById('taskStatusInput');
  const saveBtn = document.getElementById('saveTaskBtn');
  const modalHeading = document.querySelector('#modal-content h1');

  modal.style.display = 'flex'; // Show the modal

  if (task) {
    // Editing existing task: fill modal inputs with task data
    modalHeading.textContent = 'Edit Task';
    titleInput.value = task.title;
    descInput.value = task.description || '';
    statusSelect.value = task.status;
    saveBtn.textContent = 'Save Changes';

    // Remove any old click listeners to prevent duplicates
    saveBtn.replaceWith(saveBtn.cloneNode(true));
    const newSaveBtn = document.getElementById('saveTaskBtn');

    // Add click event listener to save changes to task (only in memory)
    newSaveBtn.addEventListener('click', () => {
      const newTitle = titleInput.value.trim();
      const newDesc = descInput.value.trim();
      const newStatus = statusSelect.value;

      if (!newTitle) {
        alert('Please enter a task title.');
        return;
      }

      // Find the task index and update it
      const idx = tasks.findIndex(t => t.id === task.id);
      if (idx !== -1) {
        tasks[idx].title = newTitle;
        tasks[idx].description = newDesc;
        tasks[idx].status = newStatus;
      }

      // Re-render tasks in UI; do NOT save to localStorage
      renderTasks(tasks);
      modal.style.display = 'none'; // Close modal
    });

  } else {
    // Adding a new task: clear inputs
    modalHeading.textContent = 'Add New Task';
    titleInput.value = '';
    descInput.value = '';
    statusSelect.value = 'todo';
    saveBtn.textContent = 'Create Task';

    // Remove old listeners
    saveBtn.replaceWith(saveBtn.cloneNode(true));
    const newSaveBtn = document.getElementById('saveTaskBtn');

    // Add new task on click (only in memory)
    newSaveBtn.addEventListener('click', () => {
      const title = titleInput.value.trim();
      const description = descInput.value.trim();
      const status = statusSelect.value;

      if (!title) {
        alert('Please enter a task title.');
        return;
      }

      // Generate a new unique id
      const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      const newTask = { id: newId, title, description, status };

      tasks.push(newTask); // Add new task in memory

      // Re-render tasks; do NOT save to localStorage
      renderTasks(tasks);
      modal.style.display = 'none'; // Close modal
    });
  }
}

/**
 * Sets up the modal close button and allows closing modal by clicking outside content.
 */
function setupModalClose() {
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('close-modal');

  // Close modal when clicking close button (×)
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside modal content area
  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

/**
 * App initialization function, runs after DOM content loaded.
 */
function init() {
  // Load tasks (default or from localStorage)
  const tasks = loadTasks();

  // Render tasks on page
  renderTasks(tasks);

  // Setup modal close handlers
  setupModalClose();

  // Setup "Add New Task" button to open empty modal for new tasks
  const addTaskBtn = document.getElementById('addTaskBtn');
  addTaskBtn.addEventListener('click', () => openTaskModal(null, tasks));
}

// Run init function after page DOM is fully loaded
window.addEventListener('DOMContentLoaded', init);
