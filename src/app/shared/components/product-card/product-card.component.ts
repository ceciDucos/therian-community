
import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/misc.model';
import { CardComponent } from '../card/card.component';
import { ButtonComponent } from '../button/button.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, TranslateModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  product = input.required<Product>();
}
