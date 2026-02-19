import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Report } from '../../models/misc.model';

@Injectable({
    providedIn: 'root'
})
export class ModerationService {
    private http = inject(HttpClient);
    private readonly API = environment.mmoUrl;

    async getReports(status: 'pending' | 'reviewed' | 'dismissed' | 'actioned' = 'pending'): Promise<{ data: Report[] | null; error: any }> {
        try {
            const params = new HttpParams().set('status', status);
            const data = await firstValueFrom(this.http.get<Report[]>(`${this.API}/reports`, { params }));
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    async createReport(report: Pick<Report, 'content_type' | 'content_id' | 'reason'>): Promise<{ error: any }> {
        try {
            await firstValueFrom(this.http.post(`${this.API}/reports`, report));
            return { error: null };
        } catch (error) {
            return { error };
        }
    }

    async updateReportStatus(reportId: string, status: Report['status'], notes?: string): Promise<{ error: any }> {
        try {
            await firstValueFrom(this.http.patch(`${this.API}/reports/${reportId}`, { status, notes }));
            return { error: null };
        } catch (error) {
            return { error };
        }
    }

    async getBlockedUsers(): Promise<{ data: any[] | null; error: any }> {
        try {
            const data = await firstValueFrom(this.http.get<any[]>(`${this.API}/blocked-users`));
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    async blockUser(userId: string, reason: string): Promise<{ error: any }> {
        try {
            await firstValueFrom(this.http.post(`${this.API}/blocked-users`, { userId, reason }));
            return { error: null };
        } catch (error) {
            return { error };
        }
    }

    async unblockUser(blockId: string): Promise<{ error: any }> {
        try {
            await firstValueFrom(this.http.delete(`${this.API}/blocked-users/${blockId}`));
            return { error: null };
        } catch (error) {
            return { error };
        }
    }
}
