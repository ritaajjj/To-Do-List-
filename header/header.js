/* Header Component JavaScript - header/header.js */

// Header component functionality
function loadHeader() {
    console.log('📋 Loading Header Component...');
    
    // Get the header container
    const headerContainer = document.getElementById('header-component');
    
    // Header HTML template
    const headerHTML = `
        <div class="header-container">
            <div class="header-content">
                <h1 class="app-title">
                    <span class="title-icon">✅</span>
                    TaskMaster Pro
                </h1>
                <p class="app-subtitle">Your Professional Task Management Solution</p>
            </div>
            <div class="header-stats">
                <div class="stat-item">
                    <span class="stat-number" id="total-tasks">0</span>
                    <span class="stat-label">Total</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" id="active-tasks">0</span>
                    <span class="stat-label">Active</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" id="completed-tasks">0</span>
                    <span class="stat-label">Done</span>
                </div>
            </div>
        </div>
    `;
    
    // Insert the header HTML
    headerContainer.innerHTML = headerHTML;
    
    // Initialize header functionality
    initializeHeaderStats();
    
    console.log('✅ Header Component Loaded');
}

// Function to update header statistics
function updateHeaderStats() {
    // Get tasks from localStorage or return empty array
    const tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
    
    // Calculate statistics
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    // Update the display elements
    const totalElement = document.getElementById('total-tasks');
    const activeElement = document.getElementById('active-tasks');
    const completedElement = document.getElementById('completed-tasks');
    
    // Update with animation
    if (totalElement) animateNumber(totalElement, totalTasks);
    if (activeElement) animateNumber(activeElement, activeTasks);
    if (completedElement) animateNumber(completedElement, completedTasks);
}

// Function to animate number changes
function animateNumber(element, newValue) {
    const currentValue = parseInt(element.textContent) || 0;
    
    // If values are the same, no animation needed
    if (currentValue === newValue) return;
    
    // Simple animation for number change
    element.style.transform = 'scale(1.2)';
    element.style.color = '#48bb78';
    
    setTimeout(() => {
        element.textContent = newValue;
        element.style.transform = 'scale(1)';
        element.style.color = '#4299e1';
    }, 150);
}

// Initialize header statistics on load
function initializeHeaderStats() {
    // Update stats immediately
    updateHeaderStats();
    
    // Set up periodic updates (in case multiple tabs are open)
    setInterval(updateHeaderStats, 5000); // Update every 5 seconds
}

// Function to manually refresh header stats (called from other components)
function refreshHeaderStats() {
    updateHeaderStats();
}

// Export functions for use in other components
window.headerFunctions = {
    updateStats: updateHeaderStats,
    refreshStats: refreshHeaderStats
};