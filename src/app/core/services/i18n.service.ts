import { Injectable, inject, signal, computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class I18nService {
    private translate = inject(TranslateService);
    private readonly STORAGE_KEY = 'therian-lang';

    currentLang = signal<Lang>(this.getInitialLang());

    constructor() {
        const lang = this.currentLang();
        this.translate.setFallbackLang('es');
        this.translate.use(lang);
    }

    private getInitialLang(): Lang {
        const stored = localStorage.getItem(this.STORAGE_KEY) as Lang | null;
        if (stored && (stored === 'es' || stored === 'en')) return stored;
        const browserLang = navigator.language.split('-')[0];
        return browserLang === 'en' ? 'en' : 'es';
    }

    setLang(lang: Lang) {
        this.currentLang.set(lang);
        localStorage.setItem(this.STORAGE_KEY, lang);
        document.documentElement.lang = lang;
        this.translate.use(lang);
    }

    toggleLang() {
        this.setLang(this.currentLang() === 'es' ? 'en' : 'es');
    }
}
