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
  styleUrl: './normas.component.scss'
})
export class NormasComponent {
  private translate = inject(TranslateService);

  stepColors = [
    'step-1',
    'step-2',
    'step-3',
    'step-4'
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
