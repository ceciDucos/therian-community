import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmbeddedVideo } from '../../models/misc.model';

@Injectable({
    providedIn: 'root'
})
export class VideoService {
    private http = inject(HttpClient);
    private readonly API = environment.mmoUrl;

    async getVideos(): Promise<{ data: EmbeddedVideo[] | null; error: any }> {
        try {
            const data = await firstValueFrom(this.http.get<EmbeddedVideo[]>(`${this.API}/videos`));
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    async addVideo(video: Omit<EmbeddedVideo, 'id' | 'created_at' | 'added_by'>): Promise<{ error: any }> {
        try {
            await firstValueFrom(this.http.post(`${this.API}/videos`, video));
            return { error: null };
        } catch (error) {
            return { error };
        }
    }

    extractVideoId(url: string): string | null {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
}
