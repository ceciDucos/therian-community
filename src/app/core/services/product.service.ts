
import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Product } from '../../models/misc.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private supabase = inject(SupabaseService);

    async getProducts(category?: string): Promise<{ data: Product[] | null; error: any }> {
        let query = this.supabase.client
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;
        return { data: data as Product[], error };
    }

    async getProduct(id: string): Promise<{ data: Product | null; error: any }> {
        const { data, error } = await this.supabase.client
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        return { data: data as Product, error };
    }
}
