import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'identity' | 'experience' | 'community' | 'practice';
}

@Component({
  selector: 'app-glosario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  template: `
    <div class="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <!-- Header -->
      <section class="text-center space-y-4">
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-600">
          {{ 'glosario.title' | translate }}
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          {{ 'glosario.subtitle' | translate }}
        </p>
      </section>

      <!-- Search & Filter -->
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            [placeholder]="i18n.t('glosario.searchPlaceholder')"
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            *ngFor="let cat of categoryButtons"
            (click)="toggleCategory(cat.value)"
            [class]="activeCategory() === cat.value
              ? 'px-3 py-1.5 rounded-full text-xs font-medium bg-primary text-primary-foreground transition'
              : 'px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition'"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Results count -->
      <p class="text-sm text-muted-foreground">
        {{ 'glosario.showing' | translate }} {{ filteredTerms().length }} {{ 'glosario.of' | translate }} {{ terms.length }} {{ 'glosario.terms' | translate }}
      </p>

      <!-- Terms Grid -->
      <div class="grid gap-4 md:grid-cols-2">
        <div
          *ngFor="let item of filteredTerms()"
          class="bg-card rounded-xl border p-5 space-y-2 hover:shadow-md transition-all hover:border-primary/30"
        >
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-lg">{{ item.term }}</h3>
            <span [class]="getCategoryBadgeClass(item.category)">
              {{ getCategoryLabel(item.category) }}
            </span>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">{{ item.definition }}</p>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="filteredTerms().length === 0" class="text-center py-12 space-y-3">
        <p class="text-4xl">🔍</p>
        <p class="text-muted-foreground">{{ 'glosario.emptySearch' | translate }} "{{ searchQuery() }}"</p>
      </div>

      <!-- Back links -->
      <div class="text-center pt-4">
        <a routerLink="/que-es-therian" class="text-sm text-primary hover:underline">
          {{ 'glosario.backLink' | translate }}
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class GlosarioComponent {
  i18n = inject(I18nService);
  searchQuery = signal('');
  activeCategory = signal<string | null>(null);

  get categoryButtons() {
    const cats = this.i18n.tObj('glosario.categories') || {};
    return [
      { value: 'identity', label: cats['identity'] || 'Identity' },
      { value: 'experience', label: cats['experience'] || 'Experience' },
      { value: 'community', label: cats['community'] || 'Community' },
      { value: 'practice', label: cats['practice'] || 'Practice' }
    ];
  }

  get terms(): GlossaryTerm[] {
    const rawTerms = this.i18n.tArray('glosario.termsList') as GlossaryTerm[];
    return rawTerms.sort((a, b) => a.term.localeCompare(b.term));
  }

  filteredTerms = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const cat = this.activeCategory();

    return this.terms.filter(t => {
      const matchesSearch = !query ||
        t.term.toLowerCase().includes(query) ||
        t.definition.toLowerCase().includes(query);
      const matchesCategory = !cat || t.category === cat;
      return matchesSearch && matchesCategory;
    });
  });

  toggleCategory(value: string) {
    this.activeCategory.update(current => current === value ? null : value);
  }

  getCategoryLabel(category: string): string {
    const cats = this.i18n.tObj('glosario.categories') || {};
    return cats[category] || category;
  }

  getCategoryBadgeClass(category: string): string {
    const base = 'px-2 py-0.5 rounded-full text-xs font-medium';
    const colors: Record<string, string> = {
      identity: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      experience: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
      community: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      practice: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
    };
    return `${base} ${colors[category] || ''}`;
  }
}
