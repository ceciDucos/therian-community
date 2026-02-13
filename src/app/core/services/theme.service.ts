import { Injectable, signal, effect } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly STORAGE_KEY = 'therian-theme';
    theme = signal<Theme>(this.getInitialTheme());

    constructor() {
        // Apply theme whenever it changes
        effect(() => {
            const t = this.theme();
            document.body.style.colorScheme = t;
            document.documentElement.setAttribute('data-theme', t);
            localStorage.setItem(this.STORAGE_KEY, t);
        });
    }

    toggle() {
        this.theme.update(t => t === 'light' ? 'dark' : 'light');
    }

    private getInitialTheme(): Theme {
        // 1. Check localStorage
        const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }

        // 2. Check system preference
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        return 'light';
    }
}
