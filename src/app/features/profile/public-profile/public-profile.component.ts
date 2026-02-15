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
  templateUrl: './public-profile.component.html',
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
