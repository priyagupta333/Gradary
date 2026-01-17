// Shared UI Components (Navbar, renderers)
export const renderNavbar = (activePage) => {
    const navHTML = `
        <div class="logo">
            Gradary
        </div>
        <ul class="nav-links">
            <li><a href="dashboard.html" class="nav-link ${activePage === 'dashboard' ? 'active' : ''}">Dashboard</a></li>
            <li><a href="tasks.html" class="nav-link ${activePage === 'tasks' ? 'active' : ''}">Tasks</a></li>
            <li><a href="subjects.html" class="nav-link ${activePage === 'subjects' ? 'active' : ''}">Subjects</a></li>
            <li><a href="focus.html" class="nav-link ${activePage === 'focus' ? 'active' : ''}">Focus</a></li>
            <li><a href="goals.html" class="nav-link ${activePage === 'goals' ? 'active' : ''}">Goals</a></li>
            <li><a href="about.html" class="nav-link ${activePage === 'about' ? 'active' : ''}">About</a></li>
            <li><a href="#" id="nav-logout" class="nav-link" style="color: var(--accent-red); margin-left: 1rem;"><i class="fas fa-sign-out-alt"></i></a></li>
        </ul>
    `;
    const navElement = document.querySelector('.navbar');
    if (navElement) {
        navElement.innerHTML = navHTML;
        
        const logoutBtn = document.getElementById('nav-logout');
        if(logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if(confirm('Are you sure you want to log out?')) {
                    localStorage.removeItem('gradary_session');
                    window.location.href = 'index.html';
                }
            });
        }
    }
};

export const renderEmptyState = (message, iconClass = 'fas fa-tasks') => {
    return `
        <div class="empty-state text-center" style="padding: 2rem; color: var(--text-light);">
            <div style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"><i class="${iconClass}"></i></div>
            <p>${message}</p>
        </div>
    `;
};
