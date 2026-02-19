import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post } from '../../models/post.model';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private http = inject(HttpClient);
    private readonly API = environment.mmoUrl;

    async getPosts(page = 0, limit = 10): Promise<{ data: Post[] | null; error: any }> {
        try {
            const params = new HttpParams().set('page', page).set('limit', limit);
            const data = await firstValueFrom(this.http.get<Post[]>(`${this.API}/posts`, { params }));
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    async createPost(content: string, imageUrl?: string): Promise<{ error: any }> {
        try {
            await firstValueFrom(this.http.post(`${this.API}/posts`, { content, imageUrl }));
            return { error: null };
        } catch (error) {
            return { error };
        }
    }

    async toggleLike(postId: string): Promise<{ liked: boolean; error: any }> {
        try {
            const res = await firstValueFrom(this.http.post<{ liked: boolean }>(`${this.API}/posts/${postId}/like`, {}));
            return { liked: res.liked, error: null };
        } catch (error) {
            return { liked: false, error };
        }
    }

    async uploadPostImage(file: File): Promise<{ url: string | null; error: any }> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await firstValueFrom(this.http.post<{ url: string }>(`${this.API}/posts/upload-image`, formData));
            return { url: res.url, error: null };
        } catch (error) {
            return { url: null, error };
        }
    }

    async deletePost(postId: string): Promise<{ error: any }> {
        try {
            await firstValueFrom(this.http.delete(`${this.API}/posts/${postId}`));
            return { error: null };
        } catch (error) {
            return { error };
        }
    }

    async getComments(postId: string): Promise<{ data: any[] | null; error: any }> {
        try {
            const data = await firstValueFrom(this.http.get<any[]>(`${this.API}/posts/${postId}/comments`));
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    async createComment(postId: string, content: string): Promise<{ error: any }> {
        try {
            await firstValueFrom(this.http.post(`${this.API}/posts/${postId}/comments`, { content }));
            return { error: null };
        } catch (error) {
            return { error };
        }
    }

    async deleteComment(commentId: string): Promise<{ error: any }> {
        try {
            await firstValueFrom(this.http.delete(`${this.API}/comments/${commentId}`));
            return { error: null };
        } catch (error) {
            return { error };
        }
    }
}
