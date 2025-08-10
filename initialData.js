// initial.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Initial Data ---
    const initialTasksData = [
        {
            id: 1,
            title: "Launch Epic Career 🚀",
            description: "Create a killer Resume",
            status: "todo",
        },
        {
            id: 2,
            title: "Master JavaScript 💛",
            description: "Get comfortable with the fundamentals",
            status: "doing",
        },
        {
            id: 3,
            title: "Keep on Going 🏆",
            description: "You're almost there",
            status: "doing",
        },
        {
            id: 11,
            title: "Learn Data Structures and Algorithms 📚",
            description:
                "Study fundamental data structures and algorithms to solve coding problems efficiently",
            status: "todo",
        },
        {
            id: 12,
            title: "Contribute to Open Source Projects 🌐",
            description:
                "Gain practical experience and collaborate with others in the software development community",
            status: "done",
        },
        {
            id: 13,
            title: "Build Portfolio Projects 🛠️",
            description:
                "Create a portfolio showcasing your skills and projects to potential employers",
            status: "done",
        },
    ];

    // --- App Constants & DOM Elements ---
    const LOCAL_STORAGE_KEY = 'kanbanTasksV7';
    // Task container elements
    const todoTasksContainer = document.getElementById('todo-tasks');
    const doingTasksContainer = document.getElementById('doing-tasks');
    const doneTasksContainer = document.getElementById('done-tasks');
    // Count display elements
    const todoCountEl = document.getElementById('todo-count');
    const doingCountEl = document.getElementById('doing-count');
    const doneCountEl = document.getElementById('done-count');

    // Modals
    const addTaskModal = document.getElementById('add-task-modal');
    const editTaskModal = document.getElementById('edit-task-modal');

    // Theme Toggle Elements
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');

    // --- Data Management ---

    /**
     * Loads tasks from localStorage or uses initial data.
     * @returns {Array} Array of task objects.
     */
    function loadTasks() {
        const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedTasks) {
            try {
                return JSON.parse(storedTasks);
            } catch (e) {
                console.error("Error parsing tasks from localStorage:", e);
            }
        }
        // Fallback to initial data
        return [...initialTasksData]; // Create a copy
    }

    /**
     * Saves the current list of tasks to localStorage.
     * @param {Array} tasks - Array of task objects to save.
     */
    function saveTasks(tasks) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error("Error saving tasks to localStorage:", e);
            alert("Failed to save task data. Changes might be lost on refresh.");
        }
    }

    // --- State ---
    let tasks = loadTasks();

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
        // Open the EDIT modal when clicked
        taskDiv.addEventListener('click', () => openEditTaskModal(task));
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
            const container = getTaskContainerByStatus(task.status);
            if (container) {
                container.appendChild(taskElement);
            }
        });

        updateColumnCounts();
    }

    /**
     * Helper to get the correct container element based on status.
     * @param {string} status - The task status.
     * @returns {HTMLElement|null} - The container element or null.
     */
    function getTaskContainerByStatus(status) {
        switch (status) {
            case 'todo': return todoTasksContainer;
            case 'doing': return doingTasksContainer;
            case 'done': return doneTasksContainer;
            default:
                console.warn(`Unknown status: ${status}`);
                return null;
        }
    }

    // --- Task Operations ---

    /**
     * Adds a new task to the list and updates UI/storage.
     * @param {Object} newTask - The new task object to add.
     */
    function addNewTask(newTask) {
        tasks.push(newTask);
        saveTasks(tasks);
        renderTasks(); // Re-render the updated list
    }

    /**
     * Updates an existing task in the list and updates UI/storage.
     * @param {Object} updatedTask - The task object with updated properties.
     */
    function updateTask(updatedTask) {
        const index = tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
            tasks[index] = updatedTask;
            saveTasks(tasks);
            renderTasks(); // Re-render the updated list
        } else {
             console.error("Task not found for update:", updatedTask.id);
        }
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
        if (statusSelect) statusSelect.value = 'todo'; // Default status

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

        // Simple ID generation - consider UUID for production
        const newTask = {
            id: Date.now(),
            title: title,
            description: description,
            status: status
        };

        addNewTask(newTask);
        closeAddTaskModal();
    }

    // --- Modal Handling (Edit Task) ---
    let currentTaskId = null; // Variable to hold the ID of the task being edited

    /**
     * Opens the edit task modal and populates it with task data.
     * @param {Object} task - The task object to edit.
     */
    function openEditTaskModal(task) {
        currentTaskId = task.id; // Store the ID

        const idInput = document.getElementById('edit-task-id');
        const titleInput = document.getElementById('edit-task-title');
        const descInput = document.getElementById('edit-task-description');
        const statusSelect = document.getElementById('edit-task-status');

        if (idInput) idInput.value = task.id;
        if (titleInput) titleInput.value = task.title || '';
        if (descInput) descInput.value = task.description || '';
        if (statusSelect) statusSelect.value = task.status || 'todo';

        if (editTaskModal) {
            editTaskModal.classList.remove('hidden');
        }
    }

    /**
     * Closes the edit task modal.
     */
    function closeEditTaskModal() {
        if (editTaskModal) {
            editTaskModal.classList.add('hidden');
        }
        currentTaskId = null; // Clear the ID
    }

    /**
     * Handles the submission of the edit task form.
     */
    function handleEditTaskSubmit() {
        if (currentTaskId === null) {
             console.error("No task ID set for editing.");
             closeEditTaskModal(); // Close modal if no task is set
             return;
        }

        const titleInput = document.getElementById('edit-task-title');
        const descInput = document.getElementById('edit-task-description');
        const statusSelect = document.getElementById('edit-task-status');

        const title = titleInput ? titleInput.value.trim() : '';
        const description = descInput ? descInput.value.trim() : '';
        const status = statusSelect ? statusSelect.value : 'todo';

        if (!title) {
            alert("Please enter a task title.");
            return;
        }

        const updatedTask = {
            id: currentTaskId,
            title: title,
            description: description,
            status: status
        };

        updateTask(updatedTask);
        closeEditTaskModal();
    }

    // --- UI Interactions (Dark Mode) ---

    /**
     * Toggles the dark/light theme based on the checkbox state.
     */
    function toggleTheme() {
        if (themeToggleCheckbox && themeToggleCheckbox.checked) {
            document.body.setAttribute('data-theme', 'dark');
            // Optional: Save preference
            // localStorage.setItem('theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
             // Optional: Save preference
            // localStorage.setItem('theme', 'light');
        }
    }

     /**
      * Initializes the theme toggle state based on saved preference or system preference.
      */
     function initTheme() {
         // Optional: Load saved theme preference from localStorage
         // const savedTheme = localStorage.getItem('theme');
         // if (savedTheme === 'dark') {
         //     document.body.setAttribute('data-theme', 'dark');
         //     if (themeToggleCheckbox) themeToggleCheckbox.checked = true;
         // } else if (savedTheme === 'light') {
         //     document.body.removeAttribute('data-theme');
         //     if (themeToggleCheckbox) themeToggleCheckbox.checked = false;
         // } else {
             // Fallback to system preference or default (light)
             const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
             if (prefersDarkScheme.matches) {
                 document.body.setAttribute('data-theme', 'dark');
                 if (themeToggleCheckbox) themeToggleCheckbox.checked = true;
             } else {
                 document.body.removeAttribute('data-theme');
                 if (themeToggleCheckbox) themeToggleCheckbox.checked = false;
             }
         // }
     }


    // --- Initialization ---
    initTheme(); // Set initial theme
    renderTasks(); // Initial render

    // --- Event Listeners ---

    // Add Task Modal Event Listeners
    const openAddModalBtn = document.getElementById('add-task-btn');
    const closeAddModalBtn = document.getElementById('close-add-modal-btn');
    const addTaskSubmitBtn = document.getElementById('create-task-btn');

    if (openAddModalBtn) {
        openAddModalBtn.addEventListener('click', openAddTaskModal);
    }
    if (closeAddModalBtn) {
        closeAddModalBtn.addEventListener('click', closeAddTaskModal);
    }
    if (addTaskSubmitBtn) {
        addTaskSubmitBtn.addEventListener('click', handleAddTaskSubmit);
    }

    // Edit Task Modal Event Listeners
    const closeEditModalBtn = document.getElementById('close-edit-modal-btn');
    const editTaskSubmitBtn = document.getElementById('save-task-btn');

    if (closeEditModalBtn) {
        closeEditModalBtn.addEventListener('click', closeEditTaskModal);
    }
    if (editTaskSubmitBtn) {
        editTaskSubmitBtn.addEventListener('click', handleEditTaskSubmit);
    }

    // Theme Toggle Event Listener
    if (themeToggleCheckbox) {
        themeToggleCheckbox.addEventListener('change', toggleTheme);
    }

    // Close modals if clicked outside of content
    window.addEventListener('click', (event) => {
        if (addTaskModal && event.target === addTaskModal) {
            closeAddTaskModal();
        }
        if (editTaskModal && event.target === editTaskModal) {
            closeEditTaskModal();
        }
    });

});