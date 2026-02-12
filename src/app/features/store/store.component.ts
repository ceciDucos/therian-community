
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../models/misc.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
    selector: 'app-store',
    standalone: true,
    imports: [CommonModule, ProductCardComponent, ButtonComponent],
    template: `
    <div class="container mx-auto py-8 px-4">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 class="text-3xl font-bold tracking-tight">Tienda de la Manada</h1>
           <p class="text-muted-foreground mt-2">Gear y accesorios creados por la comunidad para la comunidad.</p>
        </div>
        
        <!-- Category Filter -->
        <div class="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          <app-button 
            *ngFor="let cat of categories" 
            [variant]="selectedCategory() === cat.value ? 'primary' : 'outline'" 
            size="sm"
            (click)="filterCategory(cat.value)"
            class="whitespace-nowrap"
          >
            {{ cat.label }}
          </app-button>
        </div>
      </div>

      <!-- Disclaimer -->
      <div class="bg-yellow-50/50 border border-yellow-200 rounded-lg p-4 mb-8 text-sm text-yellow-800 flex gap-2 items-start">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
         <div>
           <strong>Nota importante:</strong> El gear (máscaras, colas, etc.) NO es un requisito para ser therian. 
           Ser therian es una identidad interna y espiritual/psicológica, no depende de lo que llevas puesto. 
           Estos artículos son solo para expresión y diversión.
         </div>
      </div>

      <!-- Grid -->
      <div *ngIf="loading()" class="py-12 text-center text-muted-foreground">
        Cargando productos...
      </div>

      <div *ngIf="!loading()" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <app-product-card 
          *ngFor="let product of products()" 
          [product]="product"
        ></app-product-card>
      </div>

      <div *ngIf="!loading() && products().length === 0" class="text-center py-12 text-muted-foreground">
        No se encontraron productos en esta categoría.
      </div>
    </div>
  `,
    styles: []
})
export class StoreComponent implements OnInit {
    private productService = inject(ProductService);

    products = signal<Product[]>([]);
    loading = signal(true);
    selectedCategory = signal<string | undefined>(undefined);

    categories = [
        { label: 'Todos', value: undefined },
        { label: 'Máscaras', value: 'mascaras' },
        { label: 'Colas y Orejas', value: 'colas_orejas' },
        { label: 'Quadrobics', value: 'rodilleras_quadrobics' },
        { label: 'Digitales', value: 'digitales' }
    ];

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
