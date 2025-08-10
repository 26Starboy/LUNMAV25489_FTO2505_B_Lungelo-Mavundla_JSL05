const STORAGE_KEY = "kanban_tasks";

let tasks = []; // holds current tasks in memory
let currentTask = null;

// Load tasks from localStorage or fallback to initialTasks
function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  } else {
    tasks = [...initialTasks]; // clone array
    saveTasks();
  }
}

// Save tasks array to localStorage
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Render all tasks and update counts
function updateCanban() {
  const todoDiv = document.getElementById("todo-tasks");
  const doingDiv = document.getElementById("doing-tasks");
  const doneDiv = document.getElementById("done-tasks");
