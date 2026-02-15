
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent, TranslatePipe],
  template: `
    <div class="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md">
        <!-- Register Card -->
        <div class="bg-card border rounded-2xl shadow-lg overflow-hidden">
          <!-- Accent bar -->
          <div class="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
          
          <div class="p-8 space-y-6">
            <!-- Header -->
            <div class="text-center space-y-3">
              <!-- Paw icon -->
              <div class="mx-auto w-28 h-28 flex items-center justify-center mb-2">
                <img src="assets/masks/register-wolf.png" alt="Wolf Mask" class="w-full h-full object-contain drop-shadow-lg">
              </div>
              <div>
                <h1 class="text-2xl font-bold tracking-tight">{{ 'auth.joinPack' | translate }}</h1>
                <p class="text-sm text-muted-foreground mt-1">{{ 'auth.registerSubtitle' | translate }}</p>
              </div>
            </div>

            <!-- Form -->
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
              <app-input
                formControlName="username"
                [label]="i18n.t('auth.username')"
                [placeholder]="i18n.t('auth.usernamePlaceholder')"
                [error]="usernameError"
                [hint]="i18n.t('auth.usernameHint')"
              ></app-input>

              <app-input
                formControlName="email"
                [label]="i18n.t('auth.email')"
                type="email"
                [placeholder]="i18n.t('auth.emailPlaceholder')"
                [error]="emailError"
              ></app-input>

              <app-input
                formControlName="password"
                [label]="i18n.t('auth.password')"
                type="password"
                [placeholder]="i18n.t('auth.passwordPlaceholder')"
                [error]="passwordError"
              ></app-input>

              <div *ngIf="errorMessage" class="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                {{ errorMessage }}
              </div>
              
              <div *ngIf="successMessage" class="p-3 text-sm text-green-600 bg-green-50 rounded-lg border border-green-200">
                {{ successMessage }}
              </div>

              <app-button
                type="submit"
                description="Register"
                [disabled]="registerForm.invalid || isLoading"
                [fullWidth]="true"
                variant="primary"
              >
                {{ isLoading ? i18n.t('auth.creatingAccount') : i18n.t('auth.createAccount') }}
              </app-button>
            </form>

            <!-- Divider -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center"><span class="w-full border-t"></span></div>
            </div>

            <!-- Sign in link -->
            <p class="text-center text-sm text-muted-foreground">
              {{ 'auth.hasAccount' | translate }}
              <a routerLink="/login" class="font-semibold text-primary hover:underline underline-offset-4 transition-colors">{{ 'auth.signIn' | translate }}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  i18n = inject(I18nService);

  registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  get usernameError(): string {
    const control = this.registerForm.get('username');
    if (control?.touched && control?.errors?.['required']) return this.i18n.t('auth.usernameRequired');
    if (control?.touched && control?.errors?.['minlength']) return this.i18n.t('auth.usernameMin');
    if (control?.touched && control?.errors?.['pattern']) return this.i18n.t('auth.usernamePattern');
    return '';
  }

  get emailError(): string {
    const control = this.registerForm.get('email');
    if (control?.touched && control?.errors?.['required']) return this.i18n.t('auth.emailRequired');
    if (control?.touched && control?.errors?.['email']) return this.i18n.t('auth.emailInvalid');
    return '';
  }

  get passwordError(): string {
    const control = this.registerForm.get('password');
    if (control?.touched && control?.errors?.['required']) return this.i18n.t('auth.passwordRequired');
    if (control?.touched && control?.errors?.['minlength']) return this.i18n.t('auth.passwordMin');
    return '';
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { email, password, username } = this.registerForm.getRawValue();

    try {
      const { error } = await this.authService.signUp(email, password, { username });
      if (error) throw error;

      this.successMessage = this.i18n.t('auth.accountCreated');
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (err: any) {
      this.errorMessage = err.message || this.i18n.t('auth.registerError');
    } finally {
      this.isLoading = false;
    }
  }
}
