
// --- Constants & DOM Elements ---
const LOCAL_STORAGE_KEY = 'kanbanTasksV2'; // Use a new key to avoid conflicts with old data
const todoTasksContainer = document.querySelector('.column-div[data-status="todo"] .tasks-container');
const doingTasksContainer = document.querySelector('.column-div[data-status="doing"] .tasks-container');
const doneTasksContainer = document.querySelector('.column-div[data-status="done"] .tasks-container');


// --- Data Management ---

/**
 * Loads tasks from localStorage or uses initial data.
 * @returns {Array} Array of task objects.
 */

function loadTasks() {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTasks) {
        try {
            console.log("Loading tasks from localStorage");
            const parsedTasks = JSON.parse(storedTasks);
            console.log("Loaded tasks:", parsedTasks);
            return parsedTasks;
        } catch (e) {
            console.error("Error parsing tasks from localStorage:", e);
            // Fallback to initial data if parsing fails
            console.warn("Falling back to initial tasks due to localStorage error.");
        }
    }
    // If no data in localStorage, or parsing failed, use initial data
    // Ensure initialData.js is loaded before this script
    console.log("Using initial tasks");
    // Use the global `initialTasks` defined in initialData.js
    return window.initialTasks && Array.isArray(window.initialTasks) ? [...window.initialTasks] : [];
}

/**
 * Saves the current list of tasks to localStorage.
 * @param {Array} tasks - Array of task objects to save.
 */
function saveTasks(tasks) {
    try {
        console.log("Saving tasks to localStorage:", tasks);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
        console.log("Tasks saved successfully.");
    } catch (e) {
        console.error("Error saving tasks to localStorage:", e);
        alert("Failed to save task data. Changes might be lost on refresh.");
    }
}


// --- State ---
let tasks = [];

// --- Utility & Rendering Functions ---

/**
 * Updates the task count displayed in each column header.
 */
function updateColumnCounts() {
    const todoCount = tasks.filter(t => t.status === 'todo').length;
    const doingCount = tasks.filter(t => t.status === 'doing').length;
    const doneCount = tasks.filter(t => t.status === 'done').length;

    if (todoCountEl) todoCountEl.textContent = todoCount;
    if (doingCountEl) doingCountEl.textContent = doingCount;
    if (doneCountEl) doneCountEl.textContent = doneCount;
}
/**
 * Creates a task DOM element.
 * @param {Object} task - The task object.
 * @returns {HTMLElement} - The task div element.
 */
function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-div';
    taskDiv.dataset.id = task.id;
    taskDiv.textContent = task.title;
    // Placeholder for future modal interaction
    taskDiv.addEventListener('click', () => {
        alert(`Task: ${task.title}\nDescription: ${task.description}\nStatus: ${task.status}`);
        // TODO: Implement actual edit modal here
    });
    return taskDiv;
}

/**
 * Renders all tasks to their respective columns.
 */

function renderTasks() {
    // Clear existing tasks
    if (todoTasksContainer) todoTasksContainer.innerHTML = '';
    if (doingTasksContainer) doingTasksContainer.innerHTML = '';
    if (doneTasksContainer) doneTasksContainer.innerHTML = '';

    // Render tasks based on status
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        switch (task.status) {
            case 'todo':
                if (todoTasksContainer) todoTasksContainer.appendChild(taskElement);
                break;
            case 'doing':
                if (doingTasksContainer) doingTasksContainer.appendChild(taskElement);
                break;
            case 'done':
                if (doneTasksContainer) doneTasksContainer.appendChild(taskElement);
                break;
            default:
                console.warn(`Unknown task status '${task.status}' for task ID ${task.id}. Task not rendered.`);
        }
    });


    updateColumnCounts();
}

// --- Task Operations ---

/**
 * Adds a new task to the list and updates UI/storage.
 * @param {Object} newTask - The new task object to add.
 */
function addNewTask(newTask) {
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
}

// --- Modal Handling (Add Task) ---

/**
 * Opens the add new task modal.
 */
function openAddTaskModal() {
    const titleInput = document.getElementById('add-task-title');
    const descInput = document.getElementById('add-task-description');
    const statusSelect = document.getElementById('add-task-status');
  if (titleInput) titleInput.value = '';
    if (descInput) descInput.value = '';
    if (statusSelect) statusSelect.value = 'todo';

    if (addTaskModal) {
        addTaskModal.classList.remove('hidden');
    }
}

/**
 * Closes the add new task modal.
 */
function closeAddTaskModal() {
    if (addTaskModal) {
        addTaskModal.classList.add('hidden');
    }
}

/**
 * Handles the submission of the add task form.
 */
function handleAddTaskSubmit() {
    const titleInput = document.getElementById('add-task-title');
    const descInput = document.getElementById('add-task-description');
    const statusSelect = document.getElementById('add-task-status');

    const title = titleInput ? titleInput.value.trim() : '';
    const description = descInput ? descInput.value.trim() : '';
    const status = statusSelect ? statusSelect.value : 'todo';

    if (!title) {
        alert("Please enter a task title.");
        return;
    }

 const newTask = {
        id: Date.now(), // Simple ID generation
        title: title,
        description: description,
        status: status
    };

    addNewTask(newTask);
    closeAddTaskModal();
}

// --- UI Interactions ---

/**
 * Toggles the dark/light theme.
 */
function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    document.body.removeAttribute('data-theme');
  } else {
    document.body.setAttribute('data-theme', 'dark');
  }
}

/**
 * Toggles the visibility of the sidebar.
 */
function toggleSidebar() {
  sideBar.classList.toggle('show');
}
