
import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Post } from '../../models/post.model';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private supabase = inject(SupabaseService);

    async getPosts(page = 0, limit = 10): Promise<{ data: Post[] | null; error: any }> {
        const from = page * limit;
        const to = from + limit - 1;

        const { data, error } = await this.supabase.client
            .from('posts')
            .select(`
        *,
        author:author_id (
          id, 
          username, 
          display_name, 
          avatar:avatar_id (image_url)
        ),
        likes_count,
        comments_count
      `)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) return { data: null, error };

        const posts = (data as any[]).map(post => ({
            ...post,
            author: {
                ...post.author,
                avatar_url: post.author?.avatar?.image_url
            }
        }));

        return { data: posts as Post[], error: null };
    }

    async createPost(content: string, imageUrl?: string): Promise<{ error: any }> {
        const user = (await this.supabase.client.auth.getUser()).data.user;
        if (!user) return { error: 'Not authenticated' };

        const { error } = await this.supabase.client
            .from('posts')
            .insert({
                author_id: user.id,
                content,
                image_url: imageUrl
            });

        return { error };
    }

    async toggleLike(postId: string): Promise<{ error: any }> {
        const user = (await this.supabase.client.auth.getUser()).data.user;
        if (!user) return { error: 'Not authenticated' };

        // Check if liked
        const { data: existing } = await this.supabase.client
            .from('likes')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .single();

        if (existing) {
            // Unlike
            const { error } = await this.supabase.client
                .from('likes')
                .delete()
                .eq('id', existing.id);
            return { error };
        } else {
            // Like
            const { error } = await this.supabase.client
                .from('likes')
                .insert({
                    post_id: postId,
                    user_id: user.id
                });
            return { error };
        }
    }

    async uploadPostImage(file: File): Promise<{ url: string | null; error: any }> {
        const user = (await this.supabase.client.auth.getUser()).data.user;
        if (!user) return { url: null, error: 'Not authenticated' };

        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await this.supabase.client.storage
            .from('posts')
            .upload(filePath, file);

        if (uploadError) {
            return { url: null, error: uploadError };
        }

        const { data } = this.supabase.client.storage
            .from('posts')
            .getPublicUrl(filePath);

        return { url: data.publicUrl, error: null };
    }

    // ─── Comments ──────────────────────────────────────────

    async getComments(postId: string): Promise<{ data: any[] | null; error: any }> {
        const { data, error } = await this.supabase.client
            .from('comments')
            .select(`
                *,
                author:author_id (
                    id,
                    username,
                    display_name
                )
            `)
            .eq('post_id', postId)
            .eq('is_deleted', false)
            .order('created_at', { ascending: true });

        return { data, error };
    }

    async createComment(postId: string, content: string): Promise<{ error: any }> {
        const user = (await this.supabase.client.auth.getUser()).data.user;
        if (!user) return { error: 'Not authenticated' };

        const { error } = await this.supabase.client
            .from('comments')
            .insert({
                post_id: postId,
                author_id: user.id,
                content
            });

        return { error };
    }

    async deleteComment(commentId: string): Promise<{ error: any }> {
        const { error } = await this.supabase.client
            .from('comments')
            .update({ is_deleted: true })
            .eq('id', commentId);

        return { error };
    }
}
