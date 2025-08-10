/**
 * Key used in localStorage to store tasks
 * @constant {string}
 */
const TASKS_STORAGE_KEY = 'kanban_tasks'; // localStorage key to save/retrieve tasks

/**
 * Loads tasks from localStorage or returns default tasks if none found.
 * @returns {Array<{id:number, title:string, description:string, status:string}>}
 */
function loadTasks() {
  const stored = localStorage.getItem(TASKS_STORAGE_KEY); // get stored tasks string from localStorage
  if (stored) {
    try {
      return JSON.parse(stored); // parse stored JSON string to object array
    } catch (e) {
      console.warn('Error parsing stored tasks:', e); // if parse error, log warning
    }
  }
  // If no stored tasks, return default sample tasks
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
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks)); // convert tasks array to JSON string and save in localStorage
}

/**
 * Renders tasks into their respective columns based on status.
 * Also attaches click listeners to each task to open modal with details.
 * @param {Array} tasks
 */
function renderTasks(tasks) {
  // Select containers for each status column
  const todoContainer = document.querySelector('.tasks-container[data-status="todo"]');
  const doingContainer = document.querySelector('.tasks-container[data-status="doing"]');
  const doneContainer = document.querySelector('.tasks-container[data-status="done"]');

  // Clear current tasks inside containers
  todoContainer.innerHTML = '';
  doingContainer.innerHTML = '';
  doneContainer.innerHTML = '';

  // Loop over each task and create a div for it
  tasks.forEach(task => {
    const div = document.createElement('div'); // create new div element
    div.classList.add('task-div'); // add CSS class for styling
    div.textContent = task.title; // set visible task title text
    div.dataset.taskId = task.id; // store task id as data attribute for reference

    // Add click event to open modal and view/edit task details
    div.addEventListener('click', () => openTaskModal(task, tasks));

    // Append task div to its appropriate column container based on status
    if (task.status === 'todo') todoContainer.appendChild(div);
    else if (task.status === 'doing') doingContainer.appendChild(div);
    else if (task.status === 'done') doneContainer.appendChild(div);
  });

  // Update the counts in each column header
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
  const modal = document.getElementById('modal'); // modal container
  const titleInput = document.getElementById('taskTitleInput'); // title input field
  const descInput = document.getElementById('taskDescriptionInput'); // description textarea
  const statusSelect = document.getElementById('taskStatusInput'); // status dropdown
  const saveBtn = document.getElementById('saveTaskBtn'); // save button in modal
  const modalHeading = document.querySelector('#modal-content h1'); // modal heading element

  modal.style.display = 'flex'; // show the modal

  if (task) {
    // Editing existing task
    modalHeading.textContent = 'Edit Task'; // set modal title
    titleInput.value = task.title; // fill in existing title
    descInput.value = task.description || ''; // fill description or empty if missing
    statusSelect.value = task.status; // set current status
    saveBtn.textContent = 'Save Changes'; // button text

    // Remove any old event listeners from save button to prevent duplicates
    saveBtn.replaceWith(saveBtn.cloneNode(true));
    const newSaveBtn = document.getElementById('saveTaskBtn');

    // Add new click event listener for saving edits
    newSaveBtn.addEventListener('click', () => {
      const newTitle = titleInput.value.trim(); // get updated title
      const newDesc = descInput.value.trim(); // get updated description
      const newStatus = statusSelect.value; // get updated status

      if (!newTitle) { // validate title is not empty
        alert('Please enter a task title.');
        return; // stop saving if invalid
      }

      // Find task in array and update properties
      const idx = tasks.findIndex(t => t.id === task.id);
      if (idx !== -1) {
        tasks[idx].title = newTitle;
        tasks[idx].description = newDesc;
        tasks[idx].status = newStatus;
      }

      saveTasks(tasks); // save updated array to localStorage
      renderTasks(tasks); // re-render task list with changes
      modal.style.display = 'none'; // hide modal
    });

  } else {
    // Adding a new task
    modalHeading.textContent = 'Add New Task'; // modal title
    titleInput.value = ''; // clear inputs
    descInput.value = '';
    statusSelect.value = 'todo'; // default status todo
    saveBtn.textContent = 'Create Task'; // button text

    // Remove old listeners to avoid stacking
    saveBtn.replaceWith(saveBtn.cloneNode(true));
    const newSaveBtn = document.getElementById('saveTaskBtn');

    // Add click listener to create new task
    newSaveBtn.addEventListener('click', () => {
      const title = titleInput.value.trim(); // new task title
      const description = descInput.value.trim(); // new task description
      const status = statusSelect.value; // selected status

      if (!title) { // validation
        alert('Please enter a task title.');
        return;
      }

      // Generate a new unique id (max existing id +1)
      const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      const newTask = { id: newId, title, description, status };

      tasks.push(newTask); // add new task to tasks array
      saveTasks(tasks); // save updated tasks array
      renderTasks(tasks); // re-render tasks on page
      modal.style.display = 'none'; // hide modal
    });
  }
}

/**
 * Sets up modal close button and outside-click close.
 */
function setupModalClose() {
  const modal = document.getElementById('modal'); // modal element
  const closeBtn = document.getElementById('close-modal'); // close button inside modal

  // Close modal when close button clicked
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal if user clicks outside modal content (on overlay)
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
  let tasks = loadTasks(); // load tasks from storage or defaults

  renderTasks(tasks); // show tasks on page
  setupModalClose(); // set modal close functionality

  const addTaskBtn = document.getElementById('addTaskBtn'); // Add Task button
  // Open modal for adding new task when button clicked
  addTaskBtn.addEventListener('click', () => openTaskModal(null, tasks));
}

// Run init function when DOM content is fully loaded
window.addEventListener('DOMContentLoaded', init);
