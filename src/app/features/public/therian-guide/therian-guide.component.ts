import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-therian-guide',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, TranslateModule],
  templateUrl: './therian-guide.component.html',
  styleUrls: ['./therian-guide.component.scss']
})
export class TherianGuideComponent {
  private translate = inject(TranslateService);

  get experiences(): any[] {
    const res = this.translate.instant('therianGuide.experiences');
    return Array.isArray(res) ? res : [];
  }

  get differences(): any[] {
    const res = this.translate.instant('therianGuide.differences');
    return Array.isArray(res) ? res : [];
  }
}
