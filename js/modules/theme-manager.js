export class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.storageKey = 'cryptotext-theme';
    }

    init() {
        // Load saved theme or detect system preference
        const savedTheme = localStorage.getItem(this.storageKey);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        this.setTheme(initialTheme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.storageKey)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });

        // Update toggle state
        this.updateToggleState();
    }

    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.saveTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        
        // Update body class
        document.body.classList.toggle('dark-theme', theme === 'dark');
        
        // Update data attribute for CSS
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themechange', { 
            detail: { theme } 
        }));
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const colors = {
            light: '#ffffff',
            dark: '#0f172a'
        };
        
        metaThemeColor.content = colors[theme];
    }

    updateToggleState() {
        const checkbox = document.getElementById('theme-toggle-checkbox');
        if (checkbox) {
            checkbox.checked = this.currentTheme === 'dark';
        }
    }

    saveTheme(theme) {
        localStorage.setItem(this.storageKey, theme);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    // Get theme-aware colors for dynamic styling
    getThemeColors() {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        
        return {
            primary: computedStyle.getPropertyValue('--primary-color').trim(),
            secondary: computedStyle.getPropertyValue('--secondary-color').trim(),
            background: computedStyle.getPropertyValue('--bg-primary').trim(),
            text: computedStyle.getPropertyValue('--text-primary').trim(),
            border: computedStyle.getPropertyValue('--border-color').trim()
        };
    }

    // Apply custom theme colors (for future extensibility)
    applyCustomColors(colors) {
        const root = document.documentElement;
        
        Object.entries(colors).forEach(([property, value]) => {
            root.style.setProperty(`--${property}`, value);
        });
    }

    // Reset to default theme colors
    resetColors() {
        const root = document.documentElement;
        const customProperties = [
            '--primary-color',
            '--secondary-color',
            '--accent-color',
            '--success-color',
            '--warning-color',
            '--error-color'
        ];
        
        customProperties.forEach(property => {
            root.style.removeProperty(property);
        });
    }
}