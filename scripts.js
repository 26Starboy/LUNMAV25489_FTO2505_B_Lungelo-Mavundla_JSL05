// Select the elements needed for modal control
const openModalBtn = document.getElementById('addTaskBtn'); // Button that opens the modal
const modal = document.querySelector('.modal');             // Modal overlay container
const closeModalBtn = document.getElementById('close-modal'); // Modal close (X) button
const saveBtn = document.querySelector('.save-btn');          // Save button inside modal

// Select input fields inside the modal for data handling
const taskTitleInput = document.getElementById('taskTitleInput');
const taskDescriptionInput = document.getElementById('taskDescriptionInput');
const taskStatusInput = document.getElementById('taskStatusInput');

/**
 * Function to open the modal
 */
function openModal() {
  modal.style.display = 'flex'; // Show the modal by setting display to flex
  clearForm();                  // Clear any previous input in the form
}

/**
 * Function to close the modal
 */
function closeModal() {
  modal.style.display = 'none'; // Hide the modal by setting display to none
}

/**
 * Function to clear/reset the form inputs inside the modal
 */
function clearForm() {
  taskTitleInput.value = '';       // Clear title input
  taskDescriptionInput.value = ''; // Clear description input
  taskStatusInput.value = 'todo';  // Reset status to default "todo"
}

/**
 * Function to handle saving the task (on Save button click)
 */
function saveTask() {
  // Get values from inputs
  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const status = taskStatusInput.value;

  // Basic validation: check if title is empty
  if (!title) {
    alert('Please enter a task title.');
    return; // Stop execution if title is empty
  }

  // Here you would typically add code to save the task data, for example:
  // - Add it to a list in the DOM
  // - Send it to a server or local storage
  console.log('Saving Task:', { title, description, status });

  // Close the modal after saving
  closeModal();
}

/**
 * Function to close modal if user clicks outside modal content
 * @param {Event} event - The click event
 */
function clickOutsideModal(event) {
  // If the click target is the modal overlay (not modal-content)
  if (event.target === modal) {
    closeModal(); // Close the modal
  }
}

// Event listeners to connect buttons with functions
openModalBtn.addEventListener('click', openModal);           // Open modal on button click
closeModalBtn.addEventListener('click', closeModal);         // Close modal on close button click
saveBtn.addEventListener('click', saveTask);                  // Save task on save button click
window.addEventListener('click', clickOutsideModal);          // Close modal if clicking outside content

// Optional: Allow closing modal with Escape key for accessibility
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.style.display === 'flex') {
    closeModal();
  }
});
