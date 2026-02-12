
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent, CardComponent],
    template: `
    <div class="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <app-card class="w-full max-w-md space-y-8" [header]="true">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">Bienvenido de nuevo</h1>
          <p class="text-sm text-muted-foreground">Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6 mt-6">
          <app-input
            formControlName="email"
            label="Email"
            type="email"
            placeholder="tu@email.com"
            [error]="emailError"
          ></app-input>

          <app-input
            formControlName="password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            [error]="passwordError"
          ></app-input>

          <div *ngIf="errorMessage" class="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {{ errorMessage }}
          </div>

          <app-button
            type="submit"
            description="Login"
            [disabled]="loginForm.invalid || isLoading"
            [fullWidth]="true"
            variant="primary"
          >
            {{ isLoading ? 'Ingresando...' : 'Ingresar' }}
          </app-button>

          <div class="text-center text-sm">
            <span class="text-muted-foreground">¿No tienes cuenta? </span>
            <a routerLink="/register" class="font-medium hover:underline text-primary">Regístrate</a>
          </div>
        </form>
      </app-card>
    </div>
  `,
    styles: []
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    isLoading = false;
    errorMessage = '';

    get emailError(): string {
        const control = this.loginForm.get('email');
        if (control?.touched && control?.errors?.['required']) return 'El email es requerido';
        if (control?.touched && control?.errors?.['email']) return 'Email inválido';
        return '';
    }

    get passwordError(): string {
        const control = this.loginForm.get('password');
        if (control?.touched && control?.errors?.['required']) return 'La contraseña es requerida';
        if (control?.touched && control?.errors?.['minlength']) return 'Mínimo 6 caracteres';
        return '';
    }

    async onSubmit() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const { email, password } = this.loginForm.getRawValue();

        try {
            const { error } = await this.authService.signIn(email, password);
            if (error) throw error;
            this.router.navigate(['/']);
        } catch (err: any) {
            this.errorMessage = err.message || 'Error al iniciar sesión';
        } finally {
            this.isLoading = false;
        }
    }
}
