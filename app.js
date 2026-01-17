import Storage from './storage.js';
import { renderNavbar, renderEmptyState } from './ui.js';
import { Utils } from './utils.js';

// Global State
let tasks = Storage.getTasks();
let goals = Storage.getGoals();

const App = {
    init: () => {
        // Session Check
        if (localStorage.getItem('gradary_session') !== 'active') {
             // Redirect to login if no session
             window.location.href = 'index.html';
             return;
        }

        const pageId = document.body.getAttribute('data-page');
        renderNavbar(pageId);
        App.updateStreak();
        
        // Page specific initializers
        if (pageId === 'dashboard') App.initDashboard();
        if (pageId === 'tasks') App.initTaskManager();
        if (pageId === 'subjects') App.initSubjects();
        if (pageId === 'goals') App.initGoals();
        if (pageId === 'focus') App.initFocus();
    },

    updateStreak: () => {
        const today = new Date().toDateString();
        if (goals.lastVisit !== today) {
            // Logic: if last visit was yesterday, increment streak
            // For simplicity, we just save today as last visit
            if (goals.lastVisit) {
                // Check if consecutive day logic here
            }
            goals.lastVisit = today;
            Storage.saveGoals(goals);
        }
    },

    // --- DASHBOARD LOGIC ---
    initDashboard: () => {
        // Simple stats
        const completed = tasks.filter(t => t.completed).length;
        const pending = tasks.length - completed;
        
        document.getElementById('stat-total').textContent = tasks.length;
        document.getElementById('stat-completed').textContent = completed;
        document.getElementById('stat-pending').textContent = pending;

        // Top 3 Priority Tasks
        const focusList = document.getElementById('focus-list');
        const sortedTasks = tasks
            .filter(t => !t.completed)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 3);

        if (sortedTasks.length === 0) {
            focusList.innerHTML = renderEmptyState('No urgent tasks today! Enjoy your free time.');
        } else {
            focusList.innerHTML = sortedTasks.map(task => `
                <div class="task-item card">
                    <div class="flex-between">
                        <div>
                            <h4 style="margin: 0; font-size: 1rem;">${task.title}</h4>
                            <span class="text-sm text-muted">${task.subject} • Due ${Utils.formatDate(task.dueDate)}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:0.5rem;">
                            <span class="badge badge-${Utils.getUrgency(task.dueDate)}" title="Urgency calculated based on due date">${Utils.getUrgency(task.dueDate)}</span>
                            <button class="btn btn-secondary btn-sm check-btn-dash" data-id="${task.id}" style="padding: 0.25rem 0.5rem;" title="Mark as Completed">
                                <i class="fas fa-check"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Attach listeners for Dashboard
            document.querySelectorAll('.check-btn-dash').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('button').dataset.id;
                    App.toggleTask(id);
                });
            });
        }

        // --- ADDED: Start Focus Session Button on Dashboard ---
        // Dynamically add focus CTA if not present
        if (!document.getElementById('focus-cta')) {
            const focusSection = document.createElement('div');
            focusSection.id = 'focus-cta';
            focusSection.className = 'card fade-in';
            focusSection.style.marginTop = '1.5rem';
            focusSection.innerHTML = `
                <div class="flex-between">
                    <div>
                        <h3 style="margin:0; font-size: 1rem;">Distraction-Free Mode</h3>
                        <p class="text-sm text-muted">Start a 25-minute study timer.</p>
                    </div>
                    <a href="focus.html" class="btn btn-secondary" style="padding: 0.5rem 1rem;">
                        <i class="fas fa-play"></i> Start
                    </a>
                </div>
            `;
            // Insert after Today's Focus List
            focusList.parentNode.appendChild(focusSection);
        }

        // Daily Reminder & Goals Display
        const greeting = document.getElementById('greeting');
        const hour = new Date().getHours();
        let greetText = 'Good Morning';
        if (hour >= 12) greetText = 'Good Afternoon';
        if (hour >= 18) greetText = 'Good Evening';
        
        const userStr = localStorage.getItem('gradary_user');
        let userName = 'Engineer';
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.name) {
                    // Get first name
                    userName = user.name.split(' ')[0];
                }
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
        greeting.textContent = `${greetText}, ${userName}!`;

        // Update Goal Card
        if (goals.cgpaTarget) {
            document.getElementById('dashboard-goal-title').textContent = "Target in Sight";
            document.getElementById('dashboard-goal-text').textContent = "You're working towards:";
            const cgpaDisplay = document.getElementById('cgpa-display');
            cgpaDisplay.textContent = `${goals.cgpaTarget} CGPA`;
            cgpaDisplay.style.display = 'block';
        }

        // --- CHARTS INITIALIZATION ---
        // 1. Task Types Distribution
        const typeCounts = { 'assignment': 0, 'exam': 0, 'project': 0, 'lab': 0, 'other': 0 };
        tasks.forEach(t => {
            if (!t.completed) {
                const type = t.type || 'other';
                typeCounts[type] = (typeCounts[type] || 0) + 1;
            }
        });

        const ctxTasks = document.getElementById('tasksChart');
        if (ctxTasks) {
            new Chart(ctxTasks, {
                type: 'doughnut',
                data: {
                    labels: ['Assignments', 'Exams', 'Projects', 'Labs'],
                    datasets: [{
                        data: [typeCounts.assignment, typeCounts.exam, typeCounts.project, typeCounts.lab],
                        backgroundColor: ['#3B82F6', '#EF4444', '#F59E0B', '#10B981'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 12 } }
                    }
                }
            });
        }

        // 2. Completion Status
        const ctxProgress = document.getElementById('progressChart');
        if (ctxProgress) {
            new Chart(ctxProgress, {
                type: 'pie',
                data: {
                    labels: ['Completed', 'Pending'],
                    datasets: [{
                        data: [completed, pending],
                        backgroundColor: ['#10B981', '#E5E7EB'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }
    },

    // --- TASK MANAGER LOGIC ---
    initTaskManager: () => {
        const taskList = document.getElementById('all-task-list');
        const addTaskForm = document.getElementById('add-task-form');

        const getIconForType = (type) => {
            const map = {
                'assignment': '<i class="fas fa-book"></i>',
                'lab': '<i class="fas fa-flask"></i>',
                'exam': '<i class="fas fa-file-alt"></i>',
                'project': '<i class="fas fa-project-diagram"></i>'
            };
            return map[type] || '<i class="fas fa-tasks"></i>';
        };

        const renderTasks = () => {
            taskList.innerHTML = '';
            const completedList = document.getElementById('completed-task-list');
            if (completedList) completedList.innerHTML = '';

            const pendingTasks = tasks.filter(t => !t.completed); // Simple filter
            const completedTasks = tasks.filter(t => t.completed);
            
            if (pendingTasks.length === 0) {
                taskList.innerHTML = renderEmptyState('No pending tasks found.');
            } else {
                pendingTasks.forEach(task => {
                    const el = document.createElement('div');
                    el.className = 'card task-row mb-2 fade-in';
                    const urgencyColor = Utils.getUrgencyColor(task.dueDate);
                    el.style.borderLeft = `4px solid ${urgencyColor}`;
                    el.innerHTML = `
                        <div class="flex-between">
                            <div>
                                <h3>${task.title}</h3>
                                <p class="text-sm text-muted"> 
                                    <span style="color:var(--primary-color)">${getIconForType(task.type)} ${task.subject}</span> • Due: ${Utils.formatDate(task.dueDate)}
                                    <br><span class="badge badge-low" style="margin-top:0.25rem">${task.type.toUpperCase()}</span>
                                </p>
                            </div>
                            <div style="display:flex; align-items: center; gap: 0.5rem;">
                                <span class="badge badge-${Utils.getUrgency(task.dueDate)}">${Utils.getUrgency(task.dueDate)}</span>
                                <button class="btn btn-secondary btn-sm check-btn" data-id="${task.id}" title="Complete Task">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="btn btn-secondary btn-sm delete-btn" data-id="${task.id}" style="color: var(--accent-red); border-color: #fee2e2;" title="Delete Task">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    taskList.appendChild(el);
                });
            }

            if (completedList && completedTasks.length > 0) {
                completedTasks.forEach(task => {
                    const el = document.createElement('div');
                    el.className = 'card task-row mb-2 fade-in';
                    el.style.borderLeft = `4px solid var(--secondary-color)`;
                    el.innerHTML = `
                        <div class="flex-between" style="opacity: 0.8">
                            <div>
                                <h3 style="text-decoration: line-through; color: var(--text-muted);">${task.title}</h3>
                                <p class="text-sm text-muted"> 
                                    <span>${getIconForType(task.type)} ${task.subject}</span> • Done
                                </p>
                            </div>
                            <div style="display:flex; align-items: center; gap: 0.5rem;">
                                <span class="badge badge-low">DONE</span>
                                <button class="btn btn-secondary btn-sm check-btn" data-id="${task.id}" style="color: var(--secondary-color); border-color: var(--secondary-color);" title="Mark as Incomplete">
                                    <i class="fas fa-undo"></i>
                                </button>
                                <button class="btn btn-secondary btn-sm delete-btn" data-id="${task.id}" style="color: var(--accent-red); border-color: #fee2e2;" title="Delete Task">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    completedList.appendChild(el);
                });
            }

            // Attach listeners
            document.querySelectorAll('.check-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('button').dataset.id;
                    App.toggleTask(id);
                });
            });

            // Delete listeners
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if(confirm('Are you sure you want to delete this task?')) {
                        const id = e.target.closest('button').dataset.id;
                        App.deleteTask(id);
                    }
                });
            });
        };

        if(addTaskForm) {
            addTaskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('task-title').value;
                const subject = document.getElementById('task-subject').value;
                const date = document.getElementById('task-date').value;
                const type = document.getElementById('task-type').value;

                if(title && subject && date) {
                    const newTask = {
                        id: Utils.generateId(),
                        title,
                        subject,
                        type,
                        dueDate: date,
                        completed: false,
                        createdAt: new Date()
                    };
                    tasks.push(newTask);
                    Storage.saveTasks(tasks);
                    renderTasks();
                    addTaskForm.reset();
                    // Close modal logic if implemented
                    alert('Task Added!');
                }
            });
        }

        renderTasks();
    },

    toggleTask: (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            Storage.saveTasks(tasks);
            
            // Refresh current view
            const pageId = document.body.getAttribute('data-page');
            if (pageId === 'dashboard') App.initDashboard();
            if (pageId === 'tasks') App.initTaskManager();
        }
    },

    deleteTask: (id) => {
        tasks = tasks.filter(t => t.id !== id);
        Storage.saveTasks(tasks);
        App.initTaskManager(); // Re-render logic
    },
    
    // --- FOCUS LOGIC ---
    initFocus: () => {
        const display = document.getElementById('timer');
        const startBtn = document.getElementById('start-timer');
        const resetBtn = document.getElementById('reset-timer');
        const modeBtns = document.querySelectorAll('.mode-btn');
        
        let timeLeft = 25 * 60;
        let timerId = null;
        let isRunning = false;

        const updateDisplay = () => {
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
            display.textContent = `${m}:${s}`;
            document.title = `${m}:${s} - Focus`;
        };

        const startTimer = () => {
            if (isRunning) return;
            isRunning = true;
            startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            timerId = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                } else {
                    clearInterval(timerId);
                    isRunning = false;
                    startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
                    alert('Session Complete! Take a break.');
                    // Play sound if we had one
                }
            }, 1000);
        };

        const pauseTimer = () => {
            clearInterval(timerId);
            isRunning = false;
            startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        };

        const resetTimer = () => {
            clearInterval(timerId);
            isRunning = false;
            // Get active mode time
            const activeBtn = document.querySelector('.mode-btn.active');
            timeLeft = parseInt(activeBtn.dataset.time) * 60;
            updateDisplay();
            startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            document.title = 'Gradary - Focus';
        };

        // Event Listeners
        startBtn.addEventListener('click', () => {
            if (isRunning) pauseTimer();
            else startTimer();
        });

        resetBtn.addEventListener('click', resetTimer);

        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                timeLeft = parseInt(btn.dataset.time) * 60;
                resetTimer(); // Reset to new time
            });
        });
        
        // Initial Display
        updateDisplay();
    },

    // --- GOALS LOGIC ---
    initGoals: () => {
         const cgpaInput = document.getElementById('goal-cgpa');
         const saveBtn = document.getElementById('save-goals');

         if(cgpaInput) cgpaInput.value = goals.cgpaTarget || '';
         
         if(saveBtn) {
             saveBtn.addEventListener('click', () => {
                 goals.cgpaTarget = cgpaInput.value;
                 Storage.saveGoals(goals);
                 alert('Goals Saved!');
             });
         }
    },
    
    // --- SUBJECTS LOGIC ---
    initSubjects: () => {
        const grid = document.getElementById('subjects-grid');
        // Group tasks by subject
        const subjects = {};
        tasks.forEach(t => {
            if(!subjects[t.subject]) subjects[t.subject] = { total:0, completed:0 };
            subjects[t.subject].total++;
            if(t.completed) subjects[t.subject].completed++;
        });

        if (Object.keys(subjects).length === 0) {
            grid.innerHTML = renderEmptyState('No subjects found yet. Add tasks to see them here.');
            return;
        }

        grid.innerHTML = Object.keys(subjects).map(sub => {
            const data = subjects[sub];
            const pendingCount = data.total - data.completed;
            const percent = Math.round((data.completed / data.total) * 100);
            
            let workload = 'Low';
            let badgeClass = 'badge-low';
            if (pendingCount > 2) { workload = 'Medium'; badgeClass = 'badge-medium'; }
            if (pendingCount > 5) { workload = 'High'; badgeClass = 'badge-urgent'; }

            return `
                <div class="card">
                    <div class="flex-between mb-2">
                        <h3>${sub}</h3>
                        <span class="badge ${badgeClass}">${workload} Load</span>
                    </div>
                    <div class="mb-2">
                        <div class="flex-between text-sm mb-2">
                            <span>Progress</span>
                            <span>${percent}%</span>
                        </div>
                        <div style="height: 8px; background: var(--bg-body); border-radius: 4px; overflow: hidden;">
                            <div style="width: ${percent}%; background: var(--secondary-color); height: 100%;"></div>
                        </div>
                    </div>
                    <div class="flex-between text-sm text-muted">
                        <span>${pendingCount} Pending</span>
                        <span>${data.completed} Done</span>
                    </div>
                </div>
            `;
        }).join('');
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);

export default App; // helper for debugging
