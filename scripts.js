/**
 * @fileoverview Task management application.
 * This script handles creating, editing, and rendering tasks
 * with support for saving to and retrieving from localStorage.
 */

import { initialTasks } from "./initialData.js";
let selectedTask = null;
let tasks = getTasksFromLocalStorage();

/**
 * @type {HTMLElement|null}
 * The currently selected task element for editing.
 */

// *****getting DOM elements*******

/** @type {HTMLDivElement} */
const modal = document.getElementById("modal");
/** @type {HTMLDivElement} */
const taskInput = document.getElementById("taskTitleInput");
/** @type {HTMLDivElement} */
const taskDiscriptionInput = document.getElementById("taskDescriptionInput");
/** @type {HTMLDivElement} */
const closeModalBtn = document.getElementById("close-modal");
/** @type {HTMLDivElement} */
const taskStatusInput = document.getElementById("taskStatusInput");
const addTaskBtn = document.getElementById("addTaskBtn");
/** @type {HTMLDivElement} */
const saveTaskBtn = document.getElementById("saveTaskBtn");

addTaskBtn.addEventListener("click", () => {
	openModal(null);
});

/**
 * Retrieves tasks from localStorage.
 * @returns {Array<Object>} - The list of stored tasks or an empty array.
 */

function getTasksFromLocalStorage() {
	try {
		const saved = localStorage.getItem("tasks");
		return saved ? JSON.parse(saved) : [];
	} catch (e) {
		console.error("Error reading localStorage", e);
		return [];
	}
}

/**
 * Renders all tasks into their respective status containers.
 *
 * @param {Array<{title: string, description: string, status: string}>} tasks -
 *        The list of task objects to render.
 *
 * Each task object should have:
 *  - title {string}: The task's title.
 *  - description {string}: A more detailed explanation of the task.
 *  - status {string}: The task's current status (used to determine which container it goes into).
 *
 * Process:
 *  1. Clears all task containers.
 *  2. Creates a new task element for each task.
 *  3. Appends it to the correct container based on status.
 *  4. Adds click event for editing via modal.
 *  5. Updates column headers to show task counts.
 */

const renderTasks = (tasks) => {
	// 1 Clear all existing tasks
	document.querySelectorAll(".tasks-container").forEach((container) => {
		container.innerHTML = "";
	});

	// 2. Loop through and create task elements
	tasks.forEach((task) => {
		const taskDiv = document.createElement("div");
		taskDiv.className = "task-div";
		taskDiv.textContent = task.title;
		taskDiv.dataset.description = task.description;
		taskDiv.dataset.status = task.status;
		taskDiv.dataset.taskId = task.id;

		// 3. Append to correct container
		appendTaskToContainer(task, taskDiv);

		// 4. Enable click-to-edit modal
		taskDiv.addEventListener("click", function () {
			openModal(this);
		});
	});

	// 5. Update column headers with counts
	updateColumnHeaders(tasks);
};

/**
 * Append a task DOM element to the correct container based on its status.
 * @param {Object} task - The task object containing title, description, and status.
 * @param {HTMLElement} taskDiv - The DOM element representing the task.
 */
function appendTaskToContainer(task, taskDiv) {
	const container = document.querySelector(
		`.tasks-container[data-status="${task.status}"]`
	);
	if (container) {
		container.appendChild(taskDiv);
	}
}

/**
 * Update the header text for each status column with task count.
 * @param {Array<Object>} tasks - List of all tasks.
 */

const updateColumnHeaders = (tasks) => {
	const statuses = ["todo", "doing", "done"];
	statuses.forEach((status) => {
		const count = tasks.filter((task) => task.status === status).length;
		document.getElementById(
			`${status}Text`
		).textContent = `${status.toUpperCase()} (${count})`;
	});
};

/**
 * Handles saving a task when clicking the Save button.
 * Updates an existing task or adds a new one.
 */

saveTaskBtn.addEventListener("click", () => {
	const title = taskInput.value.trim();
	const description = taskDiscriptionInput.value.trim();
	const status = taskStatusInput.value;

	if (!title) {
		alert("Task title cannot be empty.");
		return;
	}

	// ****This  decides whether to edit an existing task or add a new one based on whether selectedTask exists. ******

	if (selectedTask) {
		// Edit existing task
		const oldTitle = selectedTask.textContent;
		const index = tasks.findIndex((t) => t.id === oldTitle);
		if (index !== -1) {
			// tasks[index] = { title, description, status };
			tasks[index] = { ...tasks[index], title, description, status };
		}
	} else {
		// Add new task
		tasks.push({ id: Date.now(), title, description, status });
	}
	saveTasksToLocalStorage(tasks);
	renderTasks(tasks);
	modal.style.display = "none";
});

/**
 * Opens the task modal for adding or editing a task.
 * @param {HTMLElement|null} taskElement - The clicked task element or null for new tasks.
 * @returns {void}
 */

function openModal(taskElement) {
	const heading = document.getElementById("modal-heading");
	selectedTask = taskElement;

	if (taskElement) {
		taskInput.value = taskElement.textContent;
		taskDiscriptionInput.value = taskElement.dataset.description;
		taskStatusInput.value = taskElement.dataset.status;

		heading.textContent = "Edit Task";
		saveTaskBtn.textContent = "Update Task";
	} else {
		taskInput.value = "";
		taskDiscriptionInput.value = "";
		taskStatusInput.value = "todo";

		heading.textContent = "Add New Task";
		saveTaskBtn.textContent = "Create Task";
	}
	modal.style.display = "flex";
}

/**
 * Saves tasks to localStorage.
 * @param {Array<Object>} tasks - The array of task objects to store.
 * @returns {void}
 */

function saveTasksToLocalStorage(tasks) {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**
 * Closes the modal when clicking the Close button.
 */

closeModalBtn.addEventListener("click", () => {
	modal.style.display = "none";
	selectedTask = null;
});

/**
 * Closes the modal when clicking outside it.
 * @param {MouseEvent} event
 */

window.addEventListener("click", function (event) {
	if (event.target === modal) {
		modal.style.display = "none";
	}
});

/**
 * Initializes the app after the DOM content is loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
	if (tasks.length === 0) {
		saveTasksToLocalStorage(initialTasks); // Optional fallback
	}
	renderTasks(getTasksFromLocalStorage());
});