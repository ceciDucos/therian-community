import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

interface MythFact {
  myth: string;
  reality: string;
  icon: string;
  expanded: boolean;
}

@Component({
  selector: 'app-mitos',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, TranslatePipe],
  templateUrl: './mitos.component.html',
  styles: []
})
export class MitosComponent {
  i18n = inject(I18nService);

  get myths(): MythFact[] {
    const rawMyths = this.i18n.tArray('mitos.myths');
    return rawMyths.map((m: any) => ({
      ...m,
      expanded: this._expandedState[m.myth] || false
    }));
  }

  private _expandedState: Record<string, boolean> = {};

  toggle(index: number) {
    const myth = this.myths[index];
    if (myth) {
      this._expandedState[myth.myth] = !this._expandedState[myth.myth];
    }
  }
}
