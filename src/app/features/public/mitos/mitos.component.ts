import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';

interface MythFact {
  myth: string;
  reality: string;
  icon: string;
  expanded: boolean;
}

@Component({
  selector: 'app-mitos',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, TranslateModule],
  templateUrl: './mitos.component.html',
  styleUrl: './mitos.component.scss'
})
export class MitosComponent {
  private translate = inject(TranslateService);

  get myths(): MythFact[] {
    const rawMyths = this.translate.instant('mitos.myths');
    const mythsArray = Array.isArray(rawMyths) ? rawMyths : [];
    return mythsArray.map((m: any) => ({
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
