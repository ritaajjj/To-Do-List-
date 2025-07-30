/* Footer Component JavaScript - footer/footer.js */

// Footer component functionality
function loadFooter() {
    console.log('🦶 Loading Footer Component...');
    
    // Get the footer container
    const footerContainer = document.getElementById('footer-component');
    
    // Footer HTML template
    const footerHTML = `
        <div class="footer-container">
            <div class="footer-content">
                <!-- Left Section: Logo and Info -->
                <div class="footer-info">
                    <a href="#" class="footer-logo">
                        ✅ TaskMaster Pro
                    </a>
                    <div class="footer-text">
                        Professional task management made simple
                    </div>
                </div>
                
                <!-- Center Section: Quick Stats -->
                <div class="quick-stats">
                    <div class="quick-stat">
                        <span class="stat-value" id="footer-total">0</span>
                        <span class="stat-name">Tasks</span>
                    </div>
                    <div class="quick-stat">
                        <span class="stat-value" id="footer-productivity">0%</span>
                        <span class="stat-name">Done</span>
                    </div>
                </div>
                
                <!-- Right Section: Links and Social -->
                <div class="footer-links">
                    <div class="made-with-love">
                        Made with <span class="heart">❤️</span> for productivity
                    </div>
                    <div class="version-info">v1.0.0</div>
                    <div class="footer-social">
                        <a href="#" class="social-link" title="GitHub">
                            🐙
                        </a>
                        <a href="#" class="social-link" title="Twitter">
                            🐦
                        </a>
                        <a href="#" class="social-link" title="LinkedIn">
                            💼
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Copyright -->
            <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 0.8rem;">
                © ${new Date().getFullYear()} TaskMaster Pro. Built with modern web technologies.
            </div>
        </div>
    `;
    
    // Insert the footer HTML
    footerContainer.innerHTML = footerHTML;
    
    // Initialize footer functionality
    initializeFooter();
    
    console.log('✅ Footer Component Loaded');
}

// Initialize footer functionality
function initializeFooter() {
    // Update footer stats
    updateFooterStats();
    
    // Set up periodic updates
    setInterval(updateFooterStats, 3000); // Update every 3 seconds
    
    // Add click handlers for social links
    setupSocialLinks();
    
    // Add logo click handler
    setupLogoHandler();
}

// Update footer statistics
function updateFooterStats() {
    // Get tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
    
    // Calculate stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const productivityRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update footer elements
    const totalElement = document.getElementById('footer-total');
    const productivityElement = document.getElementById('footer-productivity');
    
    if (totalElement) {
        animateFooterNumber(totalElement, totalTasks);
    }
    
    if (productivityElement) {
        animateFooterNumber(productivityElement, productivityRate, '%');
    }
}

// Animate footer numbers
function animateFooterNumber(element, newValue, suffix = '') {
    const currentValue = parseInt(element.textContent) || 0;
    
    if (currentValue === newValue) return;
    
    // Simple animation
    element.style.transform = 'scale(1.1)';
    element.style.color = '#48bb78';
    
    setTimeout(() => {
        element.textContent = newValue + suffix;
        element.style.transform = 'scale(1)';
        element.style.color = '#38a169';
    }, 200);
}

// Setup social links
function setupSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const title = this.getAttribute('title');
            
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Show coming soon message
            showToast(`${title} integration coming soon! 🚀`);
        });
    });
}

// Setup logo click handler
function setupLogoHandler() {
    const logo = document.querySelector('.footer-logo');
    
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll to top with smooth animation
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            showToast('Scrolled to top! ⬆️');
        });
    }
}

// Simple toast notification function
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    // Toast styles
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: linear-gradient(145deg, #4299e1, #3182ce);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-size: 0.9rem;
        font-weight: 500;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// Function to get app statistics for external use
function getAppStatistics() {
    const tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
    
    return {
        totalTasks: tasks.length,
        activeTasks: tasks.filter(t => !t.completed).length,
        completedTasks: tasks.filter(t => t.completed).length,
        productivityRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0,
        oldestTask: tasks.length > 0 ? Math.min(...tasks.map(t => new Date(t.createdAt).getTime())) : null,
        newestTask: tasks.length > 0 ? Math.max(...tasks.map(t => new Date(t.createdAt).getTime())) : null
    };
}

// Export functions for global use
window.footerFunctions = {
    updateStats: updateFooterStats,
    getStatistics: getAppStatistics,
    showToast: showToast
};