
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { Profile } from '../../models/profile.model';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, CardComponent],
    template: `
    <div class="container mx-auto py-8 px-4 max-w-2xl">
      <app-card [header]="true" title="Tu Perfil Therian">
        <div *ngIf="loading()" class="py-8 text-center text-muted-foreground">
          Cargando perfil...
        </div>

        <form *ngIf="!loading()" [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="flex items-center space-x-6">
            <div class="relative">
               <!-- Simple Avatar Placeholder -->
               <div class="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-3xl font-bold text-secondary-foreground overflow-hidden">
                  <img *ngIf="profile()?.avatar_url" [src]="profile()?.avatar_url" class="w-full h-full object-cover">
                  <span *ngIf="!profile()?.avatar_url">{{ (profile()?.username?.charAt(0) || 'U') | uppercase }}</span>
               </div>
               <!-- Upload Button hidden for now, implemented logic later -->
            </div>
            
            <div class="flex-1 space-y-1">
              <h3 class="font-medium text-lg">{{ profile()?.username }}</h3>
              <p class="text-sm text-muted-foreground">{{ authService.user()?.email }}</p>
            </div>
          </div>

          <div class="grid gap-4">
            <app-input
              formControlName="display_name"
              label="Nombre para mostrar"
              placeholder="Tu nombre en la manada"
            ></app-input>

            <app-input
              formControlName="theriotype"
              label="Theriotype(s)"
              placeholder="Ej: Lobo Gris, Gato Montés"
              hint="Separa por comas si tienes varios"
            ></app-input>
            
            <app-input
              formControlName="pronouns"
              label="Pronombres"
              placeholder="Ej: Ella/She, Él/He, Elle/They"
            ></app-input>

            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">Biografía</label>
              <textarea
                formControlName="bio"
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Cuéntanos sobre ti..."
              ></textarea>
            </div>
            
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">Estado de Exploración</label>
              <select formControlName="exploration_status" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="exploring">Explorando / Cuestionando</option>
                <option value="defined">Identidad Definida</option>
                <option value="prefer_not_say">Prefiero no decir</option>
              </select>
            </div>
          </div>

          <div *ngIf="message()" class="p-3 text-sm rounded-md" [ngClass]="messageType() === 'success' ? 'bg-green-50 text-green-600' : 'bg-destructive/10 text-destructive'">
            {{ message() }}
          </div>

          <div class="flex justify-end">
             <app-button type="submit" variant="primary" [disabled]="saving()">
               {{ saving() ? 'Guardando...' : 'Guardar Cambios' }}
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
            this.message.set('Error al actualizar perfil');
            this.messageType.set('error');
        } else {
            this.message.set('Perfil actualizado correctamente');
            this.messageType.set('success');
            // Update local signal if needed
            this.profile.update(p => ({ ...p!, ...updates }));
        }

        this.saving.set(false);
    }
}
