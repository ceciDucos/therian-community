import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-normas',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, TranslateModule],
  templateUrl: './normas.component.html',
  styles: []
})
export class NormasComponent {
  private translate = inject(TranslateService);

  stepColors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
  ];

  get coreValues(): any[] {
    const res = this.translate.instant('normas.values');
    return Array.isArray(res) ? res : [];
  }

  get positiveRules(): string[] {
    const res = this.translate.instant('normas.doList');
    return Array.isArray(res) ? res : [];
  }

  get negativeRules(): string[] {
    const res = this.translate.instant('normas.dontList');
    return Array.isArray(res) ? res : [];
  }

  get moderationSteps(): any[] {
    const res = this.translate.instant('normas.modSteps');
    return Array.isArray(res) ? res : [];
  }

  get consequences(): any[] {
    const res = this.translate.instant('normas.consequences');
    return Array.isArray(res) ? res : [];
  }
}
