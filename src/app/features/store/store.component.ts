import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../models/misc.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ButtonComponent, TranslateModule],
  templateUrl: './store.component.html',
  styles: []
})
export class StoreComponent implements OnInit {
  private productService = inject(ProductService);
  private translate = inject(TranslateService);

  products = signal<Product[]>([]);
  loading = signal(true);
  selectedCategory = signal<string | undefined>(undefined);

  get categories() {
    return [
      { label: this.translate.instant('store.all'), value: undefined },
      { label: this.translate.instant('store.colors'), value: 'colors' },
      { label: this.translate.instant('store.gear'), value: 'gear' },
      { label: this.translate.instant('store.badges'), value: 'badges' },
      { label: this.translate.instant('store.bundles'), value: 'bundles' }
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
