
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
