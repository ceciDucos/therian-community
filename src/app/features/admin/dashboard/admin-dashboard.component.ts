
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationService } from '../../../core/services/moderation.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, TranslatePipe],
  template: `
    <div class="container mx-auto py-8 px-4">
      <h1 class="text-3xl font-bold tracking-tight mb-6">{{ 'admin.title' | translate }}</h1>
      
      <div class="flex gap-4 mb-6">
        <app-button 
          [variant]="activeTab() === 'reports' ? 'primary' : 'outline'" 
          (click)="setTab('reports')"
        >
          {{ 'admin.pendingReports' | translate }}
        </app-button>
        <app-button 
          [variant]="activeTab() === 'users' ? 'primary' : 'outline'" 
          (click)="setTab('users')"
        >
          {{ 'admin.blockedUsers' | translate }}
        </app-button>
      </div>

      <!-- Reports Tab -->
      <div *ngIf="activeTab() === 'reports'" class="space-y-4">
        <div *ngIf="loading()" class="text-center py-8">{{ 'admin.loadingReports' | translate }}</div>

        <div *ngIf="!loading() && reports().length === 0" class="text-center py-8 text-muted-foreground bg-muted rounded-lg">
          {{ 'admin.noReports' | translate }}
        </div>

        <app-card *ngFor="let report of reports()" class="mb-4">
          <div class="flex justify-between items-start">
            <div>
              <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 mb-2">
                {{ report.content_type | uppercase }}
              </span>
              <p class="font-medium">{{ 'admin.reason' | translate }}: {{ report.reason }}</p>
              <p class="text-sm text-muted-foreground">{{ 'admin.contentId' | translate }}: {{ report.content_id }}</p>
              <p class="text-xs text-muted-foreground mt-1">{{ 'admin.reportedOn' | translate }}: {{ report.created_at | date:'medium' }}</p>
            </div>
            <div class="flex flex-col gap-2">
              <app-button size="sm" variant="outline" (click)="resolveReport(report.id, 'dismissed')">{{ 'admin.dismiss' | translate }}</app-button>
              <app-button size="sm" variant="danger" (click)="resolveReport(report.id, 'actioned')">{{ 'admin.takeAction' | translate }}</app-button>
            </div>
          </div>
        </app-card>
      </div>

      <!-- Blocked Users Tab -->
      <div *ngIf="activeTab() === 'users'" class="space-y-4">
         <div *ngIf="loading()" class="text-center py-8">{{ 'admin.loadingUsers' | translate }}</div>
         
         <div *ngIf="!loading() && blockedUsers().length === 0" class="text-center py-8 text-muted-foreground bg-muted rounded-lg">
           {{ 'admin.noBlocked' | translate }}
         </div>

         <app-card *ngFor="let block of blockedUsers()" class="mb-4">
           <div class="flex justify-between items-center">
             <div>
               <h3 class="font-bold">{{ 'admin.userId' | translate }}: {{ block.blocked_user_id }}</h3>
               <p class="text-sm">{{ 'admin.reason' | translate }}: {{ block.reason }}</p>
               <p class="text-xs text-muted-foreground">{{ 'admin.blockedBy' | translate }}: {{ block.blocked_by }} {{ block.created_at | date }}</p>
             </div>
             <app-button size="sm" variant="outline" (click)="unblockUser(block.id)">{{ 'admin.unblock' | translate }}</app-button>
           </div>
         </app-card>
      </div>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent implements OnInit {
  private moderationService = inject(ModerationService);
  authService = inject(AuthService);
  i18n = inject(I18nService);

  activeTab = signal<'reports' | 'users'>('reports');
  reports = signal<any[]>([]);
  blockedUsers = signal<any[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadReports();
  }

  async loadReports() {
    this.loading.set(true);
    const { data } = await this.moderationService.getReports('pending');
    if (data) this.reports.set(data);
    this.loading.set(false);
  }

  async loadBlockedUsers() {
    this.loading.set(true);
    const { data } = await this.moderationService.getBlockedUsers();
    if (data) this.blockedUsers.set(data);
    this.loading.set(false);
  }

  async setTab(tab: 'reports' | 'users') {
    this.activeTab.set(tab);
    if (tab === 'reports') await this.loadReports();
    else await this.loadBlockedUsers();
  }

  async resolveReport(id: string, status: 'dismissed' | 'actioned') {
    await this.moderationService.updateReportStatus(id, status);
    await this.loadReports();
  }

  async unblockUser(id: string) {
    await this.moderationService.unblockUser(id);
    await this.loadBlockedUsers();
  }
}
