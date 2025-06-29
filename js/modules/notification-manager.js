export class NotificationManager {
    constructor() {
        this.container = null;
        this.notifications = new Map();
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
    }

    init() {
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            this.createContainer();
        }
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(title, message, type = 'info', duration = this.defaultDuration) {
        if (!this.container) {
            this.init();
        }

        const id = this.generateId();
        const notification = this.createNotification(id, title, message, type);
        
        // Add to container
        this.container.appendChild(notification);
        this.notifications.set(id, notification);

        // Trigger entrance animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }

        // Limit number of notifications
        this.limitNotifications();

        return id;
    }

    createNotification(id, title, message, type) {
        const notification = document.createElement('div');
        notification.className = `toast ${type}`;
        notification.dataset.id = id;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notification.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <div class="toast-content">
                <p class="toast-title">${title}</p>
                <p class="toast-message">${message}</p>
            </div>
            <button class="toast-close" aria-label="Fechar notificação">✕</button>
        `;

        // Add close functionality
        const closeBtn = notification.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.remove(id);
        });

        // Add click to dismiss
        notification.addEventListener('click', (e) => {
            if (e.target !== closeBtn) {
                this.remove(id);
            }
        });

        return notification;
    }

    remove(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        // Add exit animation
        notification.classList.add('removing');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.delete(id);
        }, 300);
    }

    clear() {
        this.notifications.forEach((notification, id) => {
            this.remove(id);
        });
    }

    limitNotifications() {
        if (this.notifications.size > this.maxNotifications) {
            const oldestId = this.notifications.keys().next().value;
            this.remove(oldestId);
        }
    }

    generateId() {
        return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Predefined notification types
    success(title, message, duration) {
        return this.show(title, message, 'success', duration);
    }

    error(title, message, duration) {
        return this.show(title, message, 'error', duration);
    }

    warning(title, message, duration) {
        return this.show(title, message, 'warning', duration);
    }

    info(title, message, duration) {
        return this.show(title, message, 'info', duration);
    }

    // Progress notification (for long operations)
    showProgress(title, message) {
        const id = this.generateId();
        const notification = this.createProgressNotification(id, title, message);
        
        this.container.appendChild(notification);
        this.notifications.set(id, notification);

        return {
            id,
            update: (progress, message) => this.updateProgress(id, progress, message),
            complete: (title, message) => this.completeProgress(id, title, message),
            error: (title, message) => this.errorProgress(id, title, message)
        };
    }

    createProgressNotification(id, title, message) {
        const notification = document.createElement('div');
        notification.className = 'toast progress';
        notification.dataset.id = id;

        notification.innerHTML = `
            <span class="toast-icon">⏳</span>
            <div class="toast-content">
                <p class="toast-title">${title}</p>
                <p class="toast-message">${message}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
            </div>
        `;

        return notification;
    }

    updateProgress(id, progress, message) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        const progressFill = notification.querySelector('.progress-fill');
        const messageEl = notification.querySelector('.toast-message');

        if (progressFill) {
            progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }

        if (message && messageEl) {
            messageEl.textContent = message;
        }
    }

    completeProgress(id, title, message) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        notification.className = 'toast success';
        notification.querySelector('.toast-icon').textContent = '✅';
        notification.querySelector('.toast-title').textContent = title;
        notification.querySelector('.toast-message').textContent = message;
        
        const progressBar = notification.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.remove();
        }

        // Auto remove after completion
        setTimeout(() => {
            this.remove(id);
        }, 3000);
    }

    errorProgress(id, title, message) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        notification.className = 'toast error';
        notification.querySelector('.toast-icon').textContent = '❌';
        notification.querySelector('.toast-title').textContent = title;
        notification.querySelector('.toast-message').textContent = message;
        
        const progressBar = notification.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.remove();
        }

        // Auto remove after error
        setTimeout(() => {
            this.remove(id);
        }, 5000);
    }
}