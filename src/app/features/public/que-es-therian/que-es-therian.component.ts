import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-que-es-therian',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, TranslatePipe],
  templateUrl: './que-es-therian.component.html',
  styles: []
})
export class QueEsTherianComponent {
  i18n = inject(I18nService);

  get experiences(): any[] {
    return this.i18n.tArray('queEs.experiences');
  }

  get differences(): any[] {
    return this.i18n.tArray('queEs.differences');
  }
}
