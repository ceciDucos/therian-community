
import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Profile } from '../../models/profile.model';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private supabase = inject(SupabaseService);

    async getProfile(userId: string): Promise<{ data: Profile | null; error: any }> {
        const { data, error } = await this.supabase.client
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        return { data, error };
    }

    async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ error: any }> {
        const { error } = await this.supabase.client
            .from('profiles')
            .update(updates)
            .eq('id', userId);

        return { error };
    }

    async uploadAvatar(userId: string, file: File): Promise<{ url: string | null; error: any }> {
        // 1. Upload file to 'avatars' bucket
        const fileExt = file.name.split('.').pop();
        const filePath = `${userId}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await this.supabase.client.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) {
            return { url: null, error: uploadError };
        }

        // 2. Get public URL
        const { data } = this.supabase.client.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return { url: data.publicUrl, error: null };
    }
}
