
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
    <div class="container mx-auto py-8 px-4 max-w-2xl">
      <app-card [header]="true" [title]="i18n.t('profile.title')">
        <div *ngIf="loading()" class="py-8 text-center text-muted-foreground">
          {{ 'profile.loading' | translate }}
        </div>

        <form *ngIf="!loading()" [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="flex items-center space-x-6">
            <div class="relative">
               <div class="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-3xl font-bold text-secondary-foreground overflow-hidden">
                  <img *ngIf="profile()?.avatar_url" [src]="profile()?.avatar_url" class="w-full h-full object-cover">
                  <span *ngIf="!profile()?.avatar_url">{{ (profile()?.username?.charAt(0) || 'U') | uppercase }}</span>
               </div>
            </div>
            
            <div class="flex-1 space-y-1">
              <h3 class="font-medium text-lg">{{ profile()?.username }}</h3>
              <p class="text-sm text-muted-foreground">{{ authService.user()?.email }}</p>
            </div>
          </div>

          <div class="grid gap-4">
            <app-input
              formControlName="display_name"
              [label]="i18n.t('profile.displayName')"
              [placeholder]="i18n.t('profile.displayNamePlaceholder')"
            ></app-input>

            <app-input
              formControlName="theriotype"
              [label]="i18n.t('profile.theriotype')"
              [placeholder]="i18n.t('profile.theriotypePlaceholder')"
              [hint]="i18n.t('profile.theriotypeHint')"
            ></app-input>
            
            <app-input
              formControlName="pronouns"
              [label]="i18n.t('profile.pronouns')"
              [placeholder]="i18n.t('profile.pronounsPlaceholder')"
            ></app-input>

            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">{{ 'profile.bio' | translate }}</label>
              <textarea
                formControlName="bio"
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                [placeholder]="i18n.t('profile.bioPlaceholder')"
              ></textarea>
            </div>
            
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">{{ 'profile.explorationStatus' | translate }}</label>
              <select formControlName="exploration_status" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="exploring">{{ 'profile.exploring' | translate }}</option>
                <option value="defined">{{ 'profile.defined' | translate }}</option>
                <option value="prefer_not_say">{{ 'profile.preferNotSay' | translate }}</option>
              </select>
            </div>
          </div>

          <div *ngIf="message()" class="p-3 text-sm rounded-md" [ngClass]="messageType() === 'success' ? 'bg-green-50 text-green-600' : 'bg-destructive/10 text-destructive'">
            {{ message() }}
          </div>

          <div class="flex justify-end">
             <app-button type="submit" variant="primary" [disabled]="saving()">
               {{ saving() ? i18n.t('profile.saving') : i18n.t('profile.saveChanges') }}
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
    exploration_status: ['exploring']
  });

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
        exploration_status: data.exploration_status || 'exploring'
      });
    }
    this.loading.set(false);
  }

  async onSubmit() {
    if (this.profileForm.invalid) return;

    this.saving.set(true);
    this.message.set('');

    const user = this.authService.user();
    if (!user) return;

    const updates = this.profileForm.value as Partial<Profile>;

    const { error } = await this.profileService.updateProfile(user.id, updates);

    if (error) {
      this.message.set(this.i18n.t('profile.updateError'));
      this.messageType.set('error');
    } else {
      this.message.set(this.i18n.t('profile.updateSuccess'));
      this.messageType.set('success');
      this.profile.update(p => ({ ...p!, ...updates }));
    }

    this.saving.set(false);
  }
}
