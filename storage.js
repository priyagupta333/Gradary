// LocalStorage Wrapper
const Storage = {
    get: (key, defaultValue) => {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    },
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove: (key) => {
        localStorage.removeItem(key);
    },
    
    // Specific Data Helpers
    getTasks: () => Storage.get('gradary_tasks', []),
    saveTasks: (tasks) => Storage.set('gradary_tasks', tasks),
    
    getGoals: () => Storage.get('gradary_goals', {
        cgpaTarget: 0,
        dailyStudyHours: 0,
        streak: 0,
        lastVisit: null
    }),
    saveGoals: (goals) => Storage.set('gradary_goals', goals)
};

export default Storage;
