
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/misc.model';
import { CardComponent } from '../card/card.component';
import { ButtonComponent } from '../button/button.component';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, TranslatePipe],
  templateUrl: './product-card.component.html',
  styles: []
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  i18n = inject(I18nService);
}
