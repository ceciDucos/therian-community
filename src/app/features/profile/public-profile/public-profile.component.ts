import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { Profile } from '../../../models/profile.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <div class="max-w-2xl mx-auto py-8 px-4">
      <!-- Loading -->
      <div *ngIf="loading()" class="text-center py-16">
        <div class="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p class="text-muted-foreground mt-4">{{ 'publicProfile.loading' | translate }}</p>
      </div>

      <!-- Not Found -->
      <div *ngIf="!loading() && !profile()" class="text-center py-16 space-y-4">
        <p class="text-5xl">🐾</p>
        <h2 class="text-2xl font-bold">{{ 'publicProfile.notFound' | translate }}</h2>
        <p class="text-muted-foreground">{{ 'publicProfile.notFoundDesc' | translate }}</p>
        <a routerLink="/" class="text-primary hover:underline">{{ 'publicProfile.backHome' | translate }}</a>
      </div>

      <!-- Profile Card -->
      <div *ngIf="!loading() && profile()" class="space-y-6">
        <!-- Header -->
        <div class="bg-card rounded-xl border p-6">
          <div class="flex items-center gap-6">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-white overflow-hidden flex-shrink-0">
              <img *ngIf="profile()?.avatar_url" [src]="profile()?.avatar_url" class="w-full h-full object-cover" alt="Avatar">
              <span *ngIf="!profile()?.avatar_url">{{ (profile()?.username?.charAt(0) || '?') | uppercase }}</span>
            </div>
            <div class="space-y-1">
              <h1 class="text-2xl font-bold">{{ profile()?.display_name || profile()?.username }}</h1>
              <p class="text-sm text-muted-foreground">{{'@'}}{{ profile()?.username }}</p>
              <p *ngIf="shouldShow('pronouns') && profile()?.pronouns" class="text-sm text-muted-foreground">
                {{ profile()?.pronouns }}
              </p>
            </div>
          </div>
        </div>

        <!-- Theriotype -->
        <div *ngIf="shouldShow('theriotype') && profile()?.theriotype" class="bg-card rounded-xl border p-5 space-y-2">
          <h3 class="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span>🐾</span> {{ 'publicProfile.theriotype' | translate }}
          </h3>
          <p class="font-medium">{{ profile()?.theriotype }}</p>
          <div *ngIf="profile()?.exploration_status" class="mt-1">
            <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                  [ngClass]="{
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300': profile()?.exploration_status === 'defined',
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300': profile()?.exploration_status === 'exploring',
                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400': profile()?.exploration_status === 'prefer_not_say'
                  }">
              {{ profile()?.exploration_status === 'defined' ? i18n.t('publicProfile.definedLabel') :
                 profile()?.exploration_status === 'exploring' ? i18n.t('publicProfile.exploringLabel') : '—' }}
            </span>
          </div>
        </div>

        <!-- Bio -->
        <div *ngIf="shouldShow('bio') && profile()?.bio" class="bg-card rounded-xl border p-5 space-y-2">
          <h3 class="text-sm font-medium text-muted-foreground">{{ 'publicProfile.bioLabel' | translate }}</h3>
          <p class="text-sm leading-relaxed whitespace-pre-line">{{ profile()?.bio }}</p>
        </div>

        <!-- Interests -->
        <div *ngIf="shouldShow('interests') && profile()?.interests?.length" class="bg-card rounded-xl border p-5 space-y-3">
          <h3 class="text-sm font-medium text-muted-foreground">{{ 'publicProfile.interestsLabel' | translate }}</h3>
          <div class="flex flex-wrap gap-2">
            <span *ngFor="let interest of profile()?.interests"
                  class="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {{ interest }}
            </span>
          </div>
        </div>

        <!-- External Links -->
        <div *ngIf="shouldShow('external_links') && hasExternalLinks()" class="bg-card rounded-xl border p-5 space-y-3">
          <h3 class="text-sm font-medium text-muted-foreground">{{ 'publicProfile.linksLabel' | translate }}</h3>
          <div class="space-y-2">
            <a *ngFor="let link of externalLinksArray()"
               [href]="link.url" target="_blank" rel="noopener noreferrer"
               class="flex items-center gap-2 text-sm text-primary hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              {{ link.label }}
            </a>
          </div>
        </div>

        <!-- Member since -->
        <div class="text-center text-xs text-muted-foreground pt-4">
          {{ 'publicProfile.memberSince' | translate }} {{ profile()?.created_at | date:'MMMM yyyy' }}
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PublicProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  i18n = inject(I18nService);

  profile = signal<Profile | null>(null);
  loading = signal(true);

  isAuthenticated = this.authService.isAuthenticated;

  async ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      await this.loadProfile(username);
    } else {
      this.loading.set(false);
    }
  }

  async loadProfile(username: string) {
    this.loading.set(true);
    const { data, error } = await this.profileService.getProfileByUsername(username);
    if (data) {
      this.profile.set(data);
    }
    this.loading.set(false);
  }

  shouldShow(field: string): boolean {
    const privacy = this.profile()?.privacy_settings;
    if (!privacy) return true;

    const setting = (privacy as any)[field];
    if (!setting || setting === 'public') return true;
    if (setting === 'members_only') return this.isAuthenticated();
    return false;
  }

  hasExternalLinks(): boolean {
    const links = this.profile()?.external_links;
    return !!links && Object.keys(links).length > 0;
  }

  externalLinksArray(): { label: string; url: string }[] {
    const links = this.profile()?.external_links;
    if (!links) return [];
    return Object.entries(links).map(([label, url]) => ({ label, url }));
  }
}
