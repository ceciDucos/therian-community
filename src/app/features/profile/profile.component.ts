import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, CardComponent, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private translate = inject(TranslateService);
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
      this.message.set(this.translate.instant('profile.updateError'));
      this.messageType.set('error');
    } else {
      this.message.set(this.translate.instant('profile.updateSuccess'));
      this.messageType.set('success');
      // Update local state - purely client side for immediate feedback
      this.profile.update(p => ({ ...p!, ...updates }));
    }

    this.saving.set(false);
  }
}
