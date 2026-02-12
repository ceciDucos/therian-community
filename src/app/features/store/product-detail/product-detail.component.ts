
import { Component, inject, OnInit, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../models/misc.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div class="container mx-auto py-8 px-4">
      <app-button variant="ghost" size="sm" routerLink="/store" class="mb-6">
        ← Volver a la Tienda
      </app-button>

      <div *ngIf="loading()" class="text-center py-12 text-muted-foreground">
        Cargando producto...
      </div>

      <div *ngIf="!loading() && product()" class="grid md:grid-cols-2 gap-8">
        <!-- Image -->
        <div class="rounded-lg overflow-hidden border bg-muted aspect-square">
           <img 
            *ngIf="product()?.image_url" 
            [src]="product()?.image_url" 
            [alt]="product()?.name"
            class="w-full h-full object-cover"
           >
           <div *ngIf="!product()?.image_url" class="w-full h-full flex items-center justify-center text-muted-foreground">
             No Image
           </div>
        </div>

        <!-- Details -->
        <div class="space-y-6">
          <div>
            <div class="text-sm text-muted-foreground uppercase tracking-wider mb-2">
              {{ product()?.category?.replace('_', ' ') }}
            </div>
            <h1 class="text-3xl font-bold tracking-tight mb-2">{{ product()?.name }}</h1>
            <div class="text-2xl font-bold text-primary" *ngIf="product()?.price">
              {{ product()?.price | currency }}
            </div>
          </div>

          <div class="prose prose-sm text-muted-foreground">
            <p>{{ product()?.description }}</p>
          </div>

          <div class="space-y-4 pt-6 border-t">
            <app-button variant="primary" size="lg" [fullWidth]="true">
              Añadir al Carrito (Demo)
            </app-button>
            <p class="text-xs text-center text-muted-foreground">
              * Nota: Esta tienda es una demostración. No se procesarán pagos reales.
            </p>
          </div>

          <div *ngIf="product()?.external_link" class="pt-4">
             <a [href]="product()?.external_link" target="_blank" class="text-primary hover:underline flex items-center gap-1">
               Ver en sitio externo 
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
             </a>
          </div>
        </div>
      </div>

      <div *ngIf="!loading() && !product()" class="text-center py-12">
        <h2 class="text-xl font-semibold">Producto no encontrado</h2>
        <app-button variant="outline" class="mt-4" routerLink="/store">Ver Catálogo</app-button>
      </div>
    </div>
  `,
  styles: []
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  product = signal<Product | null>(null);
  loading = signal(true);

  @Input() id?: string; // Route param binding (Angular 16+)

  async ngOnInit() {
    // If using component input binding, 'id' might be populated. 
    // Otherwise populate from route snapshot/params.
    // For standard param subscription:
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (id) {
        await this.loadProduct(id);
      }
    });
  }

  async loadProduct(id: string) {
    this.loading.set(true);
    const { data } = await this.productService.getProduct(id);
    if (data) {
      this.product.set(data);
    }
    this.loading.set(false);
  }
}
