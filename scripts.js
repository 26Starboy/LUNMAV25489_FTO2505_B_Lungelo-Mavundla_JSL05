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
function updateCanban() 
  const todoDiv = document.getElementById("todo-tasks");
  const doingDiv = document.getElementById("doing-tasks");
  const doneDiv = document.getElementById("done-tasks");

  todoDiv.innerHTML = "";
  doingDiv.innerHTML = "";
  doneDiv.innerHTML = "";

  let todoCount = 0, doingCount = 0, doneCount = 0;

  tasks.forEach(task => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task-div";
    taskDiv.setAttribute("data-id", task.id);
    taskDiv.textContent = task.title;
    taskDiv.onclick = () => openEditModal(task.id);

    if (task.status === "todo") {
      todoDiv.appendChild(taskDiv);
      todoCount++;
    } else if (task.status === "doing") {
      doingDiv.appendChild(taskDiv);
      doingCount++;
    } else if (task.status === "done") {
      doneDiv.appendChild(taskDiv);
      doneCount++;
    }
  });

  document.getElementById("toDoText").textContent = `TODO (${todoCount})`;
  document.getElementById("doingText").textContent = `DOING (${doingCount})`;
  document.getElementById("doneText").textContent = `DONE (${doneCount})`;
