
import { Component, inject, OnInit, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../models/misc.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, TranslateModule],
  templateUrl: './product-detail.component.html',
  styles: []
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  product = signal<Product | null>(null);
  loading = signal(true);

  @Input() id?: string;

  async ngOnInit() {
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
