import { Injectable, signal, computed } from '@angular/core';

import esTranslations from '../../../assets/i18n/es.json';
import enTranslations from '../../../assets/i18n/en.json';

export type Lang = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class I18nService {
    private readonly STORAGE_KEY = 'therian-lang';
    private translations: Record<Lang, any> = {
        es: esTranslations,
        en: enTranslations
    };

    currentLang = signal<Lang>(this.getInitialLang());

    langLabel = computed(() => this.currentLang() === 'es' ? 'ES' : 'EN');

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
    }

    toggleLang() {
        this.setLang(this.currentLang() === 'es' ? 'en' : 'es');
    }

    t(key: string): string {
        const keys = key.split('.');
        let result: any = this.translations[this.currentLang()];
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                return key; // fallback to key if not found
            }
        }
        return typeof result === 'string' ? result : key;
    }

    /**
     * Get an array from translations (e.g. for lists of items)
     */
    tArray(key: string): any[] {
        const keys = key.split('.');
        let result: any = this.translations[this.currentLang()];
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                return [];
            }
        }
        return Array.isArray(result) ? result : [];
    }

    /**
     * Get an object from translations
     */
    tObj(key: string): any {
        const keys = key.split('.');
        let result: any = this.translations[this.currentLang()];
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                return null;
            }
        }
        return result;
    }
}
