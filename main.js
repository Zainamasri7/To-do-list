const formlist = document.querySelector(".formTask");
formlist.onsubmit = addTask;

let tasks = loadTasksFromLocalStorage();

function addTask(e) {
  e.preventDefault();
  const input = document.querySelector(".formTask .input");
  const taskValue = input.value.trim();

  if (!taskValue) return alert("Please enter a task");

  const task = {
    value: taskValue,
    isChecked: false,
  };

  tasks.push(task);
  saveTasksToLocalStorage();
  input.value = "";
  renderTasks();
}

function renderTasks() {
  const tasksList = document.querySelector(".TasksList");
  tasksList.innerHTML = tasks
    .map((task, index) => {
      return `
      <div class="task-group">
        <li class="task">
          <input type="checkbox" name="checkbox" class="checkbox" ${task.isChecked ? "checked" : ""} data-index="${index}" />
          <span class="task-title ${task.isChecked ? "line" : ""}">${task.value}</span>
        </li>
        <button class="btn-deleteTask" data-index="${index}">Delete</button>
      </div>
    `;
    })
    .join("");

  addCheckboxListeners();
  addDeleteListeners();
}

function addCheckboxListeners() {
  const checkboxes = document.querySelectorAll(".checkbox");

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      tasks[index].isChecked = e.target.checked;
      saveTasksToLocalStorage();
      renderTasks();
    });
  });
}

function addDeleteListeners() {
  const deleteButtons = document.querySelectorAll(".btn-deleteTask");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      tasks.splice(index, 1);
      saveTasksToLocalStorage();
      renderTasks();
    });
  });
}

function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : [];
}

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

renderTasks();
// Dots Canvas Background
const canvas = document.getElementById("dotsCanvas");
const ctx = canvas.getContext("2d");

let dots = [];
let maxDots = 100; // Number of dots
let mousePosition = { x: null, y: null };
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 2;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fill();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
    if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

    this.draw();
  }
}

function createDots() {
  for (let i = 0; i < maxDots; i++) {
    dots.push(new Dot(Math.random() * canvas.width, Math.random() * canvas.height));
  }
}

function animateDots() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dots.forEach(dot => dot.update());
  connectDots();

  requestAnimationFrame(animateDots);
}

function connectDots() {
  dots.forEach((dot, index) => {
    for (let j = index + 1; j < dots.length; j++) {
      let otherDot = dots[j];
      let distance = Math.hypot(dot.x - otherDot.x, dot.y - otherDot.y);

      if (distance < 100) {
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(otherDot.x, otherDot.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / 100)})`;
        ctx.stroke();
      }
    }
  });
}

canvas.addEventListener("mousemove", (e) => {
  mousePosition.x = e.x;
  mousePosition.y = e.y;
});

function updateCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  dots = [];
  createDots();
}

window.addEventListener("resize", updateCanvasSize);

// Initialize the dots
createDots();
animateDots();

