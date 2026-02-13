
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
  template: `
    <app-card class="h-full flex flex-col overflow-hidden">
      <!-- Image Aspect Ratio Container -->
      <div class="aspect-square w-full overflow-hidden bg-muted">
        <img 
          *ngIf="product.image_url" 
          [src]="product.image_url" 
          [alt]="product.name"
          class="h-full w-full object-cover transition-all hover:scale-105"
          loading="lazy"
        >
        <div *ngIf="!product.image_url" class="h-full w-full flex items-center justify-center bg-secondary text-secondary-foreground">
           {{ 'store.noImage' | translate }}
        </div>
      </div>

      <div class="flex flex-col flex-1 p-4 space-y-2">
        <div class="flex justify-between items-start">
           <div>
             <h3 class="font-semibold text-lg leading-tight">{{ product.name }}</h3>
             <p class="text-xs text-muted-foreground uppercase tracking-wider mt-1">{{ product.category.replace('_', ' ') }}</p>
           </div>
           <div class="font-bold text-primary whitespace-nowrap" *ngIf="product.price">
             {{ product.price | currency }}
           </div>
        </div>

        <p class="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
          {{ product.description }}
        </p>

        <div class="mt-auto pt-4 flex gap-2">
           <app-button variant="primary" size="sm" class="w-full">
             {{ 'store.viewDetails' | translate }}
           </app-button>
        </div>
      </div>
    </app-card>
  `,
  styles: []
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  i18n = inject(I18nService);
}
