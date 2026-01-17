export const Utils = {
    // Format date to human readable string
    formatDate: (dateString) => {
        if (!dateString) return 'No Date';
        const options = { month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    },

    // Calculate days remaining
    getDaysRemaining: (dueDate) => {
        if (!dueDate) return Infinity;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        const diffTime = due - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    // Determine urgency level
    getUrgency: (dueDate) => {
        const remaining = Utils.getDaysRemaining(dueDate);
        if (remaining < 0) return 'overdue';
        if (remaining <= 2) return 'high';
        if (remaining <= 5) return 'medium';
        return 'low';
    },

    // Get color based on urgency
    getUrgencyColor: (dueDate) => {
        const urgency = Utils.getUrgency(dueDate);
        switch (urgency) {
            case 'overdue': return 'var(--accent-red)';
            case 'high': return 'var(--accent-red)';
            case 'medium': return 'var(--accent-orange)';
            case 'low': return 'var(--secondary-color)';
            default: return 'var(--text-secondary)';
        }
    },

    // Generate unique ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};
