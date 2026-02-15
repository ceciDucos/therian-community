
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
  templateUrl: './admin-dashboard.component.html',
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
