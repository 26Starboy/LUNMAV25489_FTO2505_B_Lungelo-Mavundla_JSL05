/**
 * Key used in localStorage to store tasks persistently
 * @constant {string}
 */
const TASKS_STORAGE_KEY = 'kanban_tasks';

/**
 * Load tasks from localStorage.
 * If no tasks stored, return default sample tasks.
 * @returns {Array<{id:number, title:string, description:string, status:string}>}
 */
function loadTasks() {
  // Get stored tasks JSON string
  const stored = localStorage.getItem(TASKS_STORAGE_KEY);
  if (stored) {
    try {
      // Try to parse JSON string into array
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Error parsing stored tasks:', e);
    }
  }
  // Return default tasks if none in localStorage or error occurs
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
 * Save tasks array to localStorage as JSON string.
 * @param {Array} tasks - Array of task objects to save.
 */
function saveTasks(tasks) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Render tasks into columns based on their status.
 * Also sets up task click to open modal for editing,
 * and adds delete buttons for removing tasks.
 * @param {Array} tasks - The full list of tasks.
 */
function renderTasks(tasks) {
  // Select containers for each task status column
  const todoContainer = document.querySelector('.tasks-container[data-status="todo"]');
  const doingContainer = document.querySelector('.tasks-container[data-status="doing"]');
  const doneContainer = document.querySelector('.tasks-container[data-status="done"]');

  // Clear all existing tasks before rendering fresh
  todoContainer.innerHTML = '';
  doingContainer.innerHTML = '';
  doneContainer.innerHTML = '';

  // Loop through each task to create its DOM element
  tasks.forEach(task => {
    // Create a container div for the task card
    const div = document.createElement('div');
    div.classList.add('task-div');
    div.dataset.taskId = task.id; // store task id for reference

    // Create a span to hold the task title text
    const titleSpan = document.createElement('span');
    titleSpan.textContent = task.title;
    titleSpan.style.cursor = 'pointer'; // indicate clickable for modal open

    // When title clicked, open modal to edit task
    titleSpan.addEventListener('click', () => openTaskModal(task, tasks));

    // Append title span to task div
    div.appendChild(titleSpan);

    // Create a delete button for this task
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×'; // cross symbol
    deleteBtn.classList.add('delete-btn');
    deleteBtn.title = 'Delete task';

    // Style delete button (can be moved to CSS file if preferred)
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.color = 'red';
    deleteBtn.style.border = 'none';
    deleteBtn.style.background = 'transparent';
    deleteBtn.style.fontSize = '16px';
    deleteBtn.style.cursor = 'pointer';

    // When delete clicked, remove task after confirmation
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent modal open on delete click
      if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
        // Find task index in tasks array
        const index = tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          tasks.splice(index, 1); // remove task from array
          saveTasks(tasks);       // update localStorage with new array
          renderTasks(tasks);     // re-render the updated task list
        }
      }
    });

    // Append delete button to task div
    div.appendChild(deleteBtn);

    // Append task div to the correct column based on status
    if (task.status === 'todo') todoContainer.appendChild(div);
    else if (task.status === 'doing') doingContainer.appendChild(div);
    else if (task.status === 'done') doneContainer.appendChild(div);
  });

  // Update task counts in the column headers
  document.getElementById('todoText').textContent = `TODO (${tasks.filter(t => t.status === 'todo').length})`;
  document.getElementById('doingText').textContent = `DOING (${tasks.filter(t => t.status === 'doing').length})`;
  document.getElementById('doneText').textContent = `DONE (${tasks.filter(t => t.status === 'done').length})`;
}

/**
 * Opens the modal window for adding a new task or editing an existing task.
 * Sets up input values, modal heading, and save button handler accordingly.
 * @param {Object|null} task - The task to edit, or null to add new task.
 * @param {Array} tasks - The full tasks array for updating or adding.
 */
function openTaskModal(task, tasks) {
  const modal = document.getElementById('modal');
  const titleInput = document.getElementById('taskTitleInput');
  const descInput = document.getElementById('taskDescriptionInput');
  const statusSelect = document.getElementById('taskStatusInput');
  const saveBtn = document.getElementById('saveTaskBtn');
  const modalHeading = document.querySelector('#modal-content h1');

  // Show modal by setting display to flex
  modal.style.display = 'flex';

  if (task) {
    // Editing existing task
    modalHeading.textContent = 'Edit Task';
    titleInput.value = task.title;
    descInput.value = task.description || '';
    statusSelect.value = task.status;
    saveBtn.textContent = 'Save Changes';

    // Remove any existing click listeners by replacing the button with a clone
    saveBtn.replaceWith(saveBtn.cloneNode(true));
    const newSaveBtn = document.getElementById('saveTaskBtn');

    // Set up click handler to save edits
    newSaveBtn.addEventListener('click', () => {
      const newTitle = titleInput.value.trim();
      const newDesc = descInput.value.trim();
      const newStatus = statusSelect.value;

      // Validate title input
      if (!newTitle) {
        alert('Please enter a task title.');
        return;
      }

      // Find index of the task being edited
      const idx = tasks.findIndex(t => t.id === task.id);
      if (idx !== -1) {
        // Update task properties
        tasks[idx].title = newTitle;
        tasks[idx].description = newDesc;
        tasks[idx].status = newStatus;
      }

      // Save updated tasks array to localStorage
      saveTasks(tasks);
      // Re-render tasks in UI
      renderTasks(tasks);
      // Close the modal
      modal.style.display = 'none';
    });
  } else {
    // Adding a new task
    modalHeading.textContent = 'Add New Task';
    titleInput.value = '';
    descInput.value = '';
    statusSelect.value = 'todo';
    saveBtn.textContent = 'Create Task';

    // Remove any existing click listeners by replacing the button with a clone
    saveBtn.replaceWith(saveBtn.cloneNode(true));
    const newSaveBtn = document.getElementById('saveTaskBtn');

    // Set up click handler to add new task
    newSaveBtn.addEventListener('click', () => {
      const title = titleInput.value.trim();
      const description = descInput.value.trim();
      const status = statusSelect.value;

      // Validate title input
      if (!title) {
        alert('Please enter a task title.');
        return;
      }

      // Generate new unique task id (max existing id + 1)
      const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      const newTask = { id: newId, title, description, status };

      // Add new task to array
      tasks.push(newTask);
      // Save updated tasks to localStorage
      saveTasks(tasks);
      // Re-render updated tasks list
      renderTasks(tasks);
      // Close modal
      modal.style.display = 'none';
    });
  }
}

/**
 * Set up event listeners to close modal when clicking 'X' button or outside modal.
 */
function setupModalClose() {
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('close-modal');

  // Close modal when 'X' button clicked
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside the modal content area
  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

/**
 * Initialize the app:
 * - Load tasks from storage
 * - Render tasks on screen
 * - Setup modal close functionality
 * - Setup add task button to open modal for new task
 */
function init() {
  let tasks = loadTasks();

  renderTasks(tasks);
  setupModalClose();

  const addTaskBtn = document.getElementById('addTaskBtn');
  // Open modal to add new task on clicking the add button
  addTaskBtn.addEventListener('click', () => openTaskModal(null, tasks));
}

// Start app initialization when DOM content is fully loaded
window.addEventListener('DOMContentLoaded', init);
