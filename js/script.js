const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section');

let isScrollingFromClick = false;

// Function to update connecting line gradients
function updateConnectingLines() {
    navItems.forEach((item, index) => {
        const connectingLine = item.querySelector('.connecting-line');
        if (!connectingLine) return;
        
        const isCurrentActive = item.classList.contains('active');
        const prevItem = navItems[index - 1];
        const nextItem = navItems[index + 1];
        
        const isPrevActive = prevItem ? prevItem.classList.contains('active') : false;
        const isNextActive = nextItem ? nextItem.classList.contains('active') : false;
        
        // Define colors
        const activeStart = '#22c55e';
        const activeEnd = '#15803d';
        const inactiveStart = '#3b82f6';
        const inactiveEnd = '#1e40af';
        
        // Determine gradient based on current and next item states
        let gradient;
        
        if (isCurrentActive && isNextActive) {
            // Both current and next are active - solid active gradient
            gradient = `linear-gradient(180deg, ${activeStart}, ${activeEnd})`;
        } else if (isCurrentActive && !isNextActive) {
            // Current active, next inactive - gradient from active to inactive
            gradient = `linear-gradient(180deg, ${activeStart}, ${inactiveStart})`;
        } else if (!isCurrentActive && isNextActive) {
            // Current inactive, next active - gradient from inactive to active
            gradient = `linear-gradient(180deg, ${inactiveStart}, ${activeStart})`;
        } else {
            // Both inactive - solid inactive gradient
            gradient = inactiveStart//`linear-gradient(180deg, ${inactiveStart}, ${inactiveEnd})`;
        }
        
        connectingLine.style.background = gradient;
    });
}

// Function to update active navigation item
function updateActiveNav(targetSectionId) {
    // Remove active class from all nav items and nodes
    navItems.forEach(navItem => {
        navItem.classList.remove('active');
        navItem.querySelector('.node').classList.remove('active');
    });
    
    // Find and activate the corresponding nav item
    const activeNavItem = document.querySelector(`[data-section="${targetSectionId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
        activeNavItem.querySelector('.node').classList.add('active');
    }
    
    // Update connecting lines after state change
    updateConnectingLines();
}

// Function to handle scroll end
function handleScrollEnd() {
    isScrollingFromClick = false;
    window.removeEventListener('scrollend', handleScrollEnd);
}

// Click event listeners
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        isScrollingFromClick = true;
        const targetSection = document.getElementById(item.dataset.section);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
        updateActiveNav(item.dataset.section);
        
        window.addEventListener('scrollend', handleScrollEnd);
    });
});

// Intersection Observer for scroll detection
const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    if (!isScrollingFromClick) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveNav(entry.target.id);
            }
        });
    }
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    observer.observe(section);
});

// Initialize connecting lines on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active state (typically the first section)
    updateActiveNav('bio');
});