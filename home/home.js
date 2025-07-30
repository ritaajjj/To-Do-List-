/* Home Component JavaScript - home/home.js */

// Global variables for task management
let tasks = [];
let currentFilter = 'all';
let draggedElement = null;

// Function to load the home component
function loadHome() {
    console.log('🏠 Loading Home Component...');
    
    // Get the main content container
    const mainContainer = document.getElementById('main-content');
    
    // Home HTML template
    const homeHTML = `
        <div class="main-container">
            <!-- Task Input Section -->
            <section class="task-input-section">
                <div class="input-group">
                    <input 
                        type="text" 
                        id="task-input" 
                        class="task-input" 
                        placeholder="Enter a new task..."
                        maxlength="200"
                    >
                    <button id="add-task-btn" class="add-btn">
                        ➕ Add Task
                    </button>
                </div>
                
                <!-- Filter Buttons -->
                <div class="filter-section">
                    <button class="filter-btn active" data-filter="all">All Tasks</button>
                    <button class="filter-btn" data-filter="active">Active</button>
                    <button class="filter-btn" data-filter="completed">Completed</button>
                </div>
            </section>
            
            <!-- Task List Section -->
            <section class="task-list-section">
                <div class="tasks-header">
                    <h2 class="tasks-title">My Tasks</h2>
                    <button id="clear-completed-btn" class="clear-completed-btn" disabled>
                        🗑️ Clear Completed
                    </button>
                </div>
                
                <ul id="task-list" class="task-list">
                    <!-- Tasks will be dynamically inserted here -->
                </ul>
                
                <!-- Empty State -->
                <div id="empty-state" class="empty-state" style="display: none;">
                    <span class="empty-state-icon">📝</span>
                    <div class="empty-state-text">No tasks yet!</div>
                    <div class="empty-state-subtext">Add your first task to get started</div>
                </div>
            </section>
        </div>
    `;
    
    // Insert the home HTML
    mainContainer.innerHTML = homeHTML;
    
    // Initialize home functionality
    initializeHome();
    
    console.log('✅ Home Component Loaded');
}

// Initialize home component functionality
function initializeHome() {
    // Load tasks from localStorage
    loadTasksFromStorage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Render tasks
    renderTasks();
    
    // Update header stats
    if (window.headerFunctions) {
        window.headerFunctions.updateStats();
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Add task button
    const addBtn = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            setFilter(this.dataset.filter);
        });
    });
    
    
    const clearBtn = document.getElementById('clear-completed-btn');
    clearBtn.addEventListener('click', clearCompletedTasks);
}


function loadTasksFromStorage() {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        tasks = [];
    }
}

// Save tasks to localStorage
function saveTasksToStorage() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
    
    
    if (window.headerFunctions) {
        window.headerFunctions.updateStats();
    }
}


function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();
    
   
    if (!taskText) {
        alert('Please enter a task!');
        taskInput.focus();
        return;
    }
    
    if (taskText.length > 200) {
        alert('Task is too long! Please keep it under 200 characters.');
        return;
    }
    
    // Create new task object
    const newTask = {
        id: Date.now(), 
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    // Add to tasks array
    tasks.unshift(newTask); // Add at beginning
    
    // Clear input
    taskInput.value = '';
    
    // Save and render
    saveTasksToStorage();
    renderTasks();
    
    // Show success animation
    showTaskAddedAnimation();
}

// Show task added animation
function showTaskAddedAnimation() {
    const addBtn = document.getElementById('add-task-btn');
    addBtn.style.transform = 'scale(0.95)';
    addBtn.style.background = 'linear-gradient(145deg, #48bb78, #38a169)';
    addBtn.textContent = '✅ Added!';
    
    setTimeout(() => {
        addBtn.style.transform = 'scale(1)';
        addBtn.style.background = 'linear-gradient(145deg, #4299e1, #3182ce)';
        addBtn.textContent = '➕ Add Task';
    }, 1000);
}

// Toggle task completion
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        
        saveTasksToStorage();
        renderTasks();
    }
}

// Edit a task
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newText = prompt('Edit task:', task.text);
    
    if (newText !== null && newText.trim() !== '') {
        if (newText.length > 200) {
            alert('Task is too long! Please keep it under 200 characters.');
            return;
        }
        
        task.text = newText.trim();
        task.editedAt = new Date().toISOString();
        
        saveTasksToStorage();
        renderTasks();
    }
}

// Delete a task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        
        saveTasksToStorage();
        renderTasks();
    }
}


function setFilter(filter) {
    currentFilter = filter;
   
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    // Re-render tasks
    renderTasks();
}

// Clear completed tasks
function clearCompletedTasks() {
    const completedCount = tasks.filter(t => t.completed).length;
    
    if (completedCount === 0) return;
    
    if (confirm(`Delete ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`)) {
        tasks = tasks.filter(t => !t.completed);
        
        saveTasksToStorage();
        renderTasks();
    }
}

// Render all tasks
function renderTasks() {
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const clearBtn = document.getElementById('clear-completed-btn');
    
    // Filter tasks based on current filter
    let filteredTasks = tasks;
    
    switch (currentFilter) {
        case 'active':
            filteredTasks = tasks.filter(t => !t.completed);
            break;
        case 'completed':
            filteredTasks = tasks.filter(t => t.completed);
            break;
        default:
            filteredTasks = tasks;
    }
    
    // Show/hide empty state
    if (filteredTasks.length === 0) {
        taskList.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        taskList.style.display = 'flex';
        emptyState.style.display = 'none';
    }
    
    
    const completedCount = tasks.filter(t => t.completed).length;
    clearBtn.disabled = completedCount === 0;
    clearBtn.textContent = `🗑️ Clear Completed (${completedCount})`;
    

    taskList.innerHTML = '';
    
 
    filteredTasks.forEach((task, index) => {
        const taskElement = createTaskElement(task, index);
        taskList.appendChild(taskElement);
    });
    
    
    setupDragAndDrop();
}

// Create a task element
function createTaskElement(task, index) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-task-id', task.id);
    li.draggable = true;
    
    li.innerHTML = `
        <div class="task-content">
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <span class="task-text">${escapeHtml(task.text)}</span>
        </div>
        <div class="task-actions">
            <button class="edit-btn" onclick="editTask(${task.id})" ${task.completed ? 'style="opacity: 0.5;"' : ''}>
                ✏️ Edit
            </button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                🗑️ Delete
            </button>
        </div>
    `;
    
    return li;
}


function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}


function setupDragAndDrop() {
    const taskItems = document.querySelectorAll('.task-item');
    
    taskItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            draggedElement = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.outerHTML);
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            draggedElement = null;
        });
        
        item.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const afterElement = getDragAfterElement(this.parentNode, e.clientY);
            if (afterElement == null) {
                this.parentNode.appendChild(draggedElement);
            } else {
                this.parentNode.insertBefore(draggedElement, afterElement);
            }
        });
        
        item.addEventListener('drop', function(e) {
            e.preventDefault();
            reorderTasks();
        });
    });
}


function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


function reorderTasks() {
    const taskElements = document.querySelectorAll('.task-item');
    const newOrder = [];
    
    taskElements.forEach(element => {
        const taskId = parseInt(element.getAttribute('data-task-id'));
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            newOrder.push(task);
        }
    });
    
    tasks = newOrder;
    saveTasksToStorage();
}


window.toggleTask = toggleTask;
window.editTask = editTask;
window.deleteTask = deleteTask;