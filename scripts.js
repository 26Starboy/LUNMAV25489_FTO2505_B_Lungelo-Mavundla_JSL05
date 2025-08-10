function updateCanban() {
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
}

function openAddTaskModal() {
  currentTask = null;
  closeModal();

  document.getElementById("modal-title").textContent = "Add New Task";
  document.querySelector(".createtask-btn").textContent = "Create Task";

  document.getElementById("edit-task-title").value = "";
  document.getElementById("edit-task-description").value = "";
  document.getElementById("edit-task-status").value = "todo";

  document.getElementById("task-modal").showModal();
  document.getElementById("edit-task-title").focus();
}

function openEditModal(id) {
  currentTask = tasks.find(t => t.id === id);
  if (!currentTask) return;

  document.getElementById("modal-title").textContent = "Edit Task";
  document.querySelector(".createtask-btn").textContent = "Update Task";

  document.getElementById("edit-task-title").value = currentTask.title;
  document.getElementById("edit-task-description").value = currentTask.description;
  document.getElementById("edit-task-status").value = currentTask.status;

  document.getElementById("task-modal").showModal();
  document.getElementById("edit-task-title").focus();
}
