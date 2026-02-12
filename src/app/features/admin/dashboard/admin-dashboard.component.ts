
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationService } from '../../../core/services/moderation.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, ButtonComponent, CardComponent],
    template: `
    <div class="container mx-auto py-8 px-4">
      <h1 class="text-3xl font-bold tracking-tight mb-6">Panel de Moderación</h1>
      
      <div class="flex gap-4 mb-6">
        <app-button 
          [variant]="activeTab() === 'reports' ? 'primary' : 'outline'" 
          (click)="setTab('reports')"
        >
          Reportes Pendientes
        </app-button>
        <app-button 
          [variant]="activeTab() === 'users' ? 'primary' : 'outline'" 
          (click)="setTab('users')"
        >
          Usuarios Bloqueados
        </app-button>
      </div>

      <!-- Reports Tab -->
      <div *ngIf="activeTab() === 'reports'" class="space-y-4">
        <div *ngIf="loading()" class="text-center py-8">Cargando reportes...</div>

        <div *ngIf="!loading() && reports().length === 0" class="text-center py-8 text-muted-foreground bg-muted rounded-lg">
          No hay reportes pendientes. ¡Buen trabajo! 🐺
        </div>

        <app-card *ngFor="let report of reports()" class="mb-4">
          <div class="flex justify-between items-start">
            <div>
              <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 mb-2">
                {{ report.content_type | uppercase }}
              </span>
              <p class="font-medium">Razón: {{ report.reason }}</p>
              <p class="text-sm text-muted-foreground">ID Contenido: {{ report.content_id }}</p>
              <p class="text-xs text-muted-foreground mt-1">Reportado el: {{ report.created_at | date:'medium' }}</p>
            </div>
            <div class="flex flex-col gap-2">
              <app-button size="sm" variant="outline" (click)="resolveReport(report.id, 'dismissed')">Descartar</app-button>
              <app-button size="sm" variant="danger" (click)="resolveReport(report.id, 'actioned')">Tomar Acción</app-button>
            </div>
          </div>
        </app-card>
      </div>

      <!-- Blocked Users Tab -->
      <div *ngIf="activeTab() === 'users'" class="space-y-4">
         <div *ngIf="loading()" class="text-center py-8">Cargando usuarios...</div>
         
         <div *ngIf="!loading() && blockedUsers().length === 0" class="text-center py-8 text-muted-foreground bg-muted rounded-lg">
           No hay usuarios bloqueados actualmente.
         </div>

         <app-card *ngFor="let block of blockedUsers()" class="mb-4">
           <div class="flex justify-between items-center">
             <div>
               <h3 class="font-bold">Usuario ID: {{ block.blocked_user_id }}</h3>
               <p class="text-sm">Razón: {{ block.reason }}</p>
               <p class="text-xs text-muted-foreground">Bloqueado por: {{ block.blocked_by }} el {{ block.created_at | date }}</p>
             </div>
             <app-button size="sm" variant="outline" (click)="unblockUser(block.id)">Desbloquear</app-button>
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

    activeTab = signal<'reports' | 'users'>('reports');
    reports = signal<any[]>([]);
    blockedUsers = signal<any[]>([]);
    loading = signal(false);

    constructor() {
        // Determine effect-like behavior for tab switching if needed, 
        // or just load data when tab changes. For simplicity, binding click to set and load.
        // However, simplest is to use effect() but I'll keeping it manual for clarity in this snippet.
    }

    ngOnInit() {
        // Initial load
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
