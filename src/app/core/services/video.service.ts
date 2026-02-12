
import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { EmbeddedVideo } from '../../models/misc.model';

@Injectable({
    providedIn: 'root'
})
export class VideoService {
    private supabase = inject(SupabaseService);

    async getVideos(): Promise<{ data: EmbeddedVideo[] | null; error: any }> {
        const { data, error } = await this.supabase.client
            .from('embedded_videos')
            .select('*')
            .order('created_at', { ascending: false });

        return { data: data as EmbeddedVideo[], error };
    }

    async addVideo(video: Omit<EmbeddedVideo, 'id' | 'created_at' | 'added_by'>): Promise<{ error: any }> {
        const user = (await this.supabase.client.auth.getUser()).data.user;
        if (!user) return { error: 'Not authenticated' };

        const { error } = await this.supabase.client
            .from('embedded_videos')
            .insert({
                ...video,
                added_by: user.id
            });

        return { error };
    }

    // Helper to parse YouTube ID (basic implementation)
    extractVideoId(url: string): string | null {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
}
