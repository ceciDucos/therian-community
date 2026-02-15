import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-normas',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, TranslatePipe],
  templateUrl: './normas.component.html',
  styles: []
})
export class NormasComponent {
  i18n = inject(I18nService);

  stepColors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
  ];

  get coreValues(): any[] {
    return this.i18n.tArray('normas.values');
  }

  get positiveRules(): string[] {
    return this.i18n.tArray('normas.doList');
  }

  get negativeRules(): string[] {
    return this.i18n.tArray('normas.dontList');
  }

  get moderationSteps(): any[] {
    return this.i18n.tArray('normas.modSteps');
  }

  get consequences(): any[] {
    return this.i18n.tArray('normas.consequences');
  }
}
