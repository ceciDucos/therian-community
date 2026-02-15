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
  templateUrl: './glosario.component.html',
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
