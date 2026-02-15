import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'identity' | 'experience' | 'community' | 'practice';
}

@Component({
  selector: 'app-glosario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './glosario.component.html',
  styles: []
})
export class GlosarioComponent {
  private translate = inject(TranslateService);
  searchQuery = signal('');
  activeCategory = signal<string | null>(null);

  get categoryButtons() {
    const cats: any = this.translate.instant('glosario.categories');
    const safeCats = (cats && typeof cats === 'object') ? cats : {};
    return [
      { value: 'identity', label: safeCats['identity'] || 'Identity' },
      { value: 'experience', label: safeCats['experience'] || 'Experience' },
      { value: 'community', label: safeCats['community'] || 'Community' },
      { value: 'practice', label: safeCats['practice'] || 'Practice' }
    ];
  }

  get terms(): GlossaryTerm[] {
    const rawTerms = this.translate.instant('glosario.termsList');
    const terms = Array.isArray(rawTerms) ? rawTerms : [];
    return terms.sort((a: GlossaryTerm, b: GlossaryTerm) => a.term.localeCompare(b.term));
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
    const cats: any = this.translate.instant('glosario.categories');
    const safeCats = (cats && typeof cats === 'object') ? cats : {};
    return safeCats[category] || category;
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
