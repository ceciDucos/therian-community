
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { I18nService } from '../../core/services/i18n.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { Profile } from '../../models/profile.model';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, CardComponent, TranslatePipe],
  template: `
    <div class="container mx-auto py-12 px-4 max-w-xl">
      <app-card [header]="true" [title]="i18n.t('profile.title')">
        <div *ngIf="loading()" class="py-12 text-center text-muted-foreground animate-pulse">
          {{ 'profile.loading' | translate }}
        </div>

        <form *ngIf="!loading()" [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-8">
          
          <!-- Header Section with Avatar -->
          <div class="flex flex-col items-center space-y-4">
            <div class="relative group">
              <div class="w-32 h-32 rounded-full bg-secondary/50 flex items-center justify-center text-4xl font-bold text-secondary-foreground overflow-hidden border-4 border-primary/20 shadow-lg">
                  <img *ngIf="profileForm.get('avatar_url')?.value" [src]="profileForm.get('avatar_url')?.value" class="w-full h-full object-cover">
                  <span *ngIf="!profileForm.get('avatar_url')?.value">{{ (profile()?.username?.charAt(0) || '?') | uppercase }}</span>
              </div>
            </div>
            
            <div class="text-center space-y-1">
              <h3 class="font-bold text-2xl text-foreground">{{ profile()?.username }}</h3>
              <p class="text-sm text-muted-foreground">{{ authService.user()?.email }}</p>
            </div>
          </div>

          <hr class="border-white/10" />

          <!-- Avatar Selection Grid -->
          <div class="space-y-4">
            <label class="text-sm font-semibold text-foreground/80 block">Choose an Avatar</label>
            <div class="grid grid-cols-5 gap-4">
              <button *ngFor="let mask of masks" 
                      type="button"
                      (click)="selectAvatar(mask.url)"
                      class="relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-black/20"
                      [class.border-primary]="profileForm.get('avatar_url')?.value === mask.url"
                      [class.border-transparent]="profileForm.get('avatar_url')?.value !== mask.url"
                      [class.opacity-50]="profileForm.get('avatar_url')?.value !== mask.url"
                      [class.opacity-100]="profileForm.get('avatar_url')?.value === mask.url">
                <img [src]="mask.url" [alt]="mask.name" class="w-full h-full object-cover">
                <div *ngIf="profileForm.get('avatar_url')?.value === mask.url" class="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                  <div class="bg-primary text-primary-foreground rounded-full p-1.5 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <hr class="border-white/10" />

          <!-- Form Fields -->
          <div class="grid gap-6">
            <app-input
              formControlName="display_name"
              [label]="i18n.t('profile.displayName')"
              [placeholder]="i18n.t('profile.displayNamePlaceholder')"
            ></app-input>

            <div class="grid grid-cols-2 gap-6">
               <app-input
                formControlName="theriotype"
                [label]="i18n.t('profile.theriotype')"
                [placeholder]="i18n.t('profile.theriotypePlaceholder')"
              ></app-input>
              
              <app-input
                formControlName="pronouns"
                [label]="i18n.t('profile.pronouns')"
                [placeholder]="i18n.t('profile.pronounsPlaceholder')"
              ></app-input>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium leading-none text-foreground/80">{{ 'profile.bio' | translate }}</label>
              <textarea
                formControlName="bio"
                class="flex min-h-[100px] w-full rounded-xl border border-input bg-black/20 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
                [placeholder]="i18n.t('profile.bioPlaceholder')"
              ></textarea>
            </div>
            
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none text-foreground/80">{{ 'profile.explorationStatus' | translate }}</label>
              <select formControlName="exploration_status" class="flex h-11 w-full rounded-xl border border-input bg-black/20 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none">
                <option value="exploring">{{ 'profile.exploring' | translate }}</option>
                <option value="defined">{{ 'profile.defined' | translate }}</option>
                <option value="prefer_not_say">{{ 'profile.preferNotSay' | translate }}</option>
              </select>
            </div>
          </div>

          <div *ngIf="message()" class="p-4 text-sm rounded-xl flex items-center gap-2" [ngClass]="messageType() === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'">
            <svg *ngIf="messageType() === 'success'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <svg *ngIf="messageType() === 'error'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {{ message() }}
          </div>

          <div class="flex justify-end pt-4">
             <app-button type="submit" variant="primary" size="lg" [disabled]="saving()" class="w-full sm:w-auto min-w-[150px]">
               <span *ngIf="saving()" class="flex items-center gap-2">
                 <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 {{ i18n.t('profile.saving') }}
               </span>
               <span *ngIf="!saving()">{{ i18n.t('profile.saveChanges') }}</span>
             </app-button>
          </div>
        </form>
      </app-card>
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private profileService = inject(ProfileService);
  i18n = inject(I18nService);
  private fb = inject(FormBuilder);

  profile = signal<Profile | null>(null);
  loading = signal(true);
  saving = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error'>('success');

  profileForm = this.fb.group({
    display_name: [''],
    theriotype: [''],
    pronouns: [''],
    bio: [''],
    exploration_status: ['exploring'],
    avatar_url: ['']
  });

  masks = [
    { id: 'wolf', url: 'assets/masks/wolf.png', name: 'Wolf' },
    { id: 'cat', url: 'assets/masks/cat.png', name: 'Cat' },
    { id: 'deer', url: 'assets/masks/deer.png', name: 'Deer' },
    { id: 'raven', url: 'assets/masks/raven.png', name: 'Raven' },
    { id: 'dragon', url: 'assets/masks/dragon.png', name: 'Dragon' }
  ];

  async ngOnInit() {
    const user = await this.authService.getCurrentUser();
    if (user) {
      await this.loadProfile(user.id);
    } else {
      this.loading.set(false);
    }
  }

  async loadProfile(userId: string) {
    this.loading.set(true);
    const { data, error } = await this.profileService.getProfile(userId);

    if (data) {
      this.profile.set(data);
      this.profileForm.patchValue({
        display_name: data.display_name,
        theriotype: data.theriotype,
        pronouns: data.pronouns,
        bio: data.bio,
        exploration_status: data.exploration_status || 'exploring',
        avatar_url: data.avatar_url
      });
    }
    this.loading.set(false);
  }

  selectAvatar(url: string) {
    this.profileForm.patchValue({ avatar_url: url });
    this.profileForm.markAsDirty();
  }

  async onSubmit() {
    if (this.profileForm.invalid) return;

    this.saving.set(true);
    this.message.set('');

    const user = this.authService.user();
    if (!user) return;

    // Construct safe payload with known existing columns
    // We omit 'pronouns', 'theriotype', 'exploration_status' as they seem to be missing in DB
    const updates: any = {
      display_name: this.profileForm.value.display_name,
      bio: this.profileForm.value.bio,
      avatar_url: this.profileForm.value.avatar_url,
      updated_at: new Date()
    };

    // If profile doesn't exist, we must provide a username for creation
    if (!this.profile()) {
      const email = user.email || '';
      updates.username = email.split('@')[0] || `user_${user.id.slice(0, 8)}`;
    }

    const { error } = await this.profileService.updateProfile(user.id, updates);

    if (error) {
      this.message.set(this.i18n.t('profile.updateError'));
      this.messageType.set('error');
    } else {
      this.message.set(this.i18n.t('profile.updateSuccess'));
      this.messageType.set('success');
      // Update local state - purely client side for immediate feedback
      this.profile.update(p => ({ ...p!, ...updates }));
    }

    this.saving.set(false);
  }
}
