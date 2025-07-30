
function loadHeader() {
    console.log('📋 Loading Header Component...');
    

    const headerContainer = document.getElementById('header-component');
    
   
    const headerHTML = `
        <div class="header-container">
            <div class="header-content">
                <h1 class="app-title">
                    <span class="title-icon">✅</span>
                      To Do List App
                </h1>
                <p class="app-subtitle">Your Personal Task Manager</p>
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
    
   
    initializeHeaderStats();
    
    console.log('✅ Header Component Loaded');
}


function updateHeaderStats() {
   
    const tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
    
   
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = tasks.filter(task => task.completed).length;
    

    const totalElement = document.getElementById('total-tasks');
    const activeElement = document.getElementById('active-tasks');
    const completedElement = document.getElementById('completed-tasks');
    
   
    if (totalElement) animateNumber(totalElement, totalTasks);
    if (activeElement) animateNumber(activeElement, activeTasks);
    if (completedElement) animateNumber(completedElement, completedTasks);
}


function animateNumber(element, newValue) {
    const currentValue = parseInt(element.textContent) || 0;
    
    
    if (currentValue === newValue) return;
    
    
    element.style.transform = 'scale(1.2)';
    element.style.color = '#48bb78';
    
    setTimeout(() => {
        element.textContent = newValue;
        element.style.transform = 'scale(1)';
        element.style.color = '#4299e1';
    }, 150);
}


function initializeHeaderStats() {
   
    updateHeaderStats();
    
    
    setInterval(updateHeaderStats, 5000); 
}


function refreshHeaderStats() {
    updateHeaderStats();
}

// Export functions for use in other components
window.headerFunctions = {
    updateStats: updateHeaderStats,
    refreshStats: refreshHeaderStats
};