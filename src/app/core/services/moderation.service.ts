
import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Report } from '../../models/misc.model';
import { Profile } from '../../models/profile.model';

@Injectable({
    providedIn: 'root'
})
export class ModerationService {
    private supabase = inject(SupabaseService);

    async getReports(status: 'pending' | 'reviewed' | 'dismissed' | 'actioned' = 'pending'): Promise<{ data: Report[] | null; error: any }> {
        const { data, error } = await this.supabase.client
            .from('reports')
            .select('*')
            .eq('status', status)
            .order('created_at', { ascending: false });

        return { data: data as Report[], error };
    }

    async createReport(report: Pick<Report, 'content_type' | 'content_id' | 'reason'>): Promise<{ error: any }> {
        const user = (await this.supabase.client.auth.getUser()).data.user;
        if (!user) return { error: 'Not authenticated' };

        const { error } = await this.supabase.client
            .from('reports')
            .insert({
                reporter_id: user.id,
                ...report
            });

        return { error };
    }

    async updateReportStatus(reportId: string, status: Report['status'], notes?: string): Promise<{ error: any }> {
        const user = (await this.supabase.client.auth.getUser()).data.user;
        if (!user) return { error: 'Not authenticated' };

        const updates: any = {
            status,
            reviewed_by: user.id,
            reviewed_at: new Date().toISOString()
        };

        if (notes) updates.admin_notes = notes;

        const { error } = await this.supabase.client
            .from('reports')
            .update(updates)
            .eq('id', reportId);

        return { error };
    }

    // --- User Blocking ---

    async getBlockedUsers(): Promise<{ data: any[] | null; error: any }> {
        const { data, error } = await this.supabase.client
            .from('blocked_users')
            .select('*, profile:blocked_user_id(username, display_name)')
            .order('created_at', { ascending: false });

        return { data, error };
    }

    async blockUser(userId: string, reason: string): Promise<{ error: any }> {
        const admin = (await this.supabase.client.auth.getUser()).data.user;
        if (!admin) return { error: 'Not authenticated' };

        const { error } = await this.supabase.client
            .from('blocked_users')
            .insert({
                blocked_user_id: userId,
                blocked_by: admin.id,
                reason
            });

        return { error };
    }

    async unblockUser(blockId: string): Promise<{ error: any }> {
        const { error } = await this.supabase.client
            .from('blocked_users')
            .delete()
            .eq('id', blockId);

        return { error };
    }
}
