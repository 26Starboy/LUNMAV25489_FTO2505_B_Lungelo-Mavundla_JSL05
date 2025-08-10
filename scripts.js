// ==========================
// Select DOM Elements
// ==========================

// Button to open the "Add Task" modal
const openModalBtn = document.getElementById('addTaskBtn');

// The modal overlay container
const modal = document.querySelector('.modal');

// Close (X) button inside modal
const closeModalBtn = document.getElementById('close-modal');

// Save button inside modal
const saveBtn = document.querySelector('.save-btn');

// Form inputs inside modal
const taskTitleInput = document.getElementById('taskTitleInput');
const taskDescriptionInput = document.getElementById('taskDescriptionInput');
const taskStatusInput = document.getElementById('taskStatusInput');


// ==========================
// Functions
// ==========================

/**
 * Open the modal and reset form inputs
 */
function openModal() {
  modal.style.display = 'flex';  // Show modal by setting display to flex
  clearForm();                   // Reset all input fields to default/empty
}

/**
 * Close the modal
 */
function closeModal() {
  modal.style.display = 'none';  // Hide modal by setting display to none
}

/**
 * Clear/reset all form inputs inside the modal
 */
function clearForm() {
  taskTitleInput.value = '';       // Clear task title input
  taskDescriptionInput.value = ''; // Clear task description input
  taskStatusInput.value = 'todo';  // Reset status to default "todo"
}

/**
 * Save task on clicking the save button
 */
function saveTask() {
  // Trim to remove whitespace
  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const status = taskStatusInput.value;

  // Validate title input - must not be empty
  if (!title) {
    alert('Please enter a task title.');
    return;  // Stop if validation fails
  }

  // Normally, you'd add logic here to:
  // - Add the task to your data store (array/localStorage)
  // - Update the DOM to show the new task
  // Here, we'll just log to console for demo purposes
  console.log('Task saved:', { title, description, status });

  // Close modal after saving
  closeModal();
}

/**
 * Close modal when user clicks outside the modal content
 * @param {Event} event
 */
function clickOutsideModal(event) {
  // If click target is the modal background overlay, close modal
  if (event.target === modal) {
    closeModal();
  }
}

// ==========================
// Event Listeners
// ==========================

// Open modal on clicking "Add Task" button
openModalBtn.addEventListener('click', openModal);

// Close modal on clicking close button (X)
closeModalBtn.addEventListener('click', closeModal);

// Save task on clicking Save button
saveBtn.addEventListener('click', saveTask);

// Close modal if user clicks outside modal content
window.addEventListener('click', clickOutsideModal);

// Optional: Close modal when pressing Escape key (for accessibility)
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.style.display === 'flex') {
    closeModal();
  }
});
