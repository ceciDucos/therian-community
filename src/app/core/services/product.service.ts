import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/misc.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);
    private readonly API = environment.mmoUrl;

    async getProducts(category?: string): Promise<{ data: Product[] | null; error: any }> {
        try {
            let params = new HttpParams();
            if (category) params = params.set('category', category);
            const data = await firstValueFrom(this.http.get<Product[]>(`${this.API}/products`, { params }));
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    async getProduct(id: string): Promise<{ data: Product | null; error: any }> {
        try {
            const data = await firstValueFrom(this.http.get<Product>(`${this.API}/products/${id}`));
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
}
