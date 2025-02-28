export class ThemeManager {
  constructor() {
    this.root = document.documentElement;
    this.themeToggle = document.getElementById('themeToggle');
    this.init();
  }

  init() {
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    this.updateTheme();
  }

  toggleTheme() {
    const newTheme = this.root.classList.toggle('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    this.updateThemeIcon(newTheme);
  }

  updateTheme() {
    const preferredTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.root.classList.toggle('dark', preferredTheme === 'dark');
    this.updateThemeIcon(preferredTheme);
  }

  updateThemeIcon(theme) {
    this.themeToggle.textContent = theme === 'dark' ? '💡' : '🌑';
  }
} 