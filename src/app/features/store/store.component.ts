import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { I18nService } from '../../core/services/i18n.service';
import { Product } from '../../models/misc.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ButtonComponent, TranslatePipe],
  templateUrl: './store.component.html',
  styles: []
})
export class StoreComponent implements OnInit {
  private productService = inject(ProductService);
  i18n = inject(I18nService);

  products = signal<Product[]>([]);
  loading = signal(true);
  selectedCategory = signal<string | undefined>(undefined);

  get categories() {
    return [
      { label: this.i18n.t('store.all'), value: undefined },
      { label: this.i18n.t('store.masks'), value: 'mascaras' },
      { label: this.i18n.t('store.tailsEars'), value: 'colas_orejas' },
      { label: this.i18n.t('store.quadrobics'), value: 'rodilleras_quadrobics' },
      { label: this.i18n.t('store.digital'), value: 'digitales' }
    ];
  }

  async ngOnInit() {
    await this.loadProducts();
  }

  async loadProducts(category?: string) {
    this.loading.set(true);
    const { data } = await this.productService.getProducts(category);
    if (data) {
      this.products.set(data);
    }
    this.loading.set(false);
  }

  async filterCategory(category: string | undefined) {
    this.selectedCategory.set(category);
    await this.loadProducts(category);
  }
}
