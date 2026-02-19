import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile } from '../../models/profile.model';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private http = inject(HttpClient);
    private readonly API = environment.mmoUrl;

    async getProfile(userId: string): Promise<{ data: Profile | null; error: any }> {
        try {
            const data = await firstValueFrom(this.http.get<Profile>(`${this.API}/profiles/${userId}`));
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    async getProfileByUsername(username: string): Promise<{ data: Profile | null; error: any }> {
        try {
            const data = await firstValueFrom(this.http.get<Profile>(`${this.API}/profiles/by-username/${username}`));
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ error: any }> {
        try {
            await firstValueFrom(this.http.put(`${this.API}/profiles/${userId}`, updates));
            return { error: null };
        } catch (error) {
            return { error };
        }
    }

    async uploadAvatar(userId: string, file: File): Promise<{ url: string | null; error: any }> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await firstValueFrom(this.http.post<{ url: string }>(`${this.API}/profiles/${userId}/avatar`, formData));
            return { url: res.url, error: null };
        } catch (error) {
            return { url: null, error };
        }
    }
}
