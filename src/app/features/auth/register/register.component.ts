
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent, CardComponent],
    template: `
    <div class="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <app-card class="w-full max-w-md space-y-8" [header]="true">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">Únete a la Manada</h1>
          <p class="text-sm text-muted-foreground">Crea tu cuenta para conectar con la comunidad</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4 mt-6">
          <app-input
            formControlName="username"
            label="Usuario"
            placeholder="KinaTheWolf"
            [error]="usernameError"
            hint="Este será tu identificador único (@usuario)"
          ></app-input>

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
          
          <div *ngIf="successMessage" class="p-3 text-sm text-green-600 bg-green-50 rounded-md">
            {{ successMessage }}
          </div>

          <app-button
            type="submit"
            description="Register"
            [disabled]="registerForm.invalid || isLoading"
            [fullWidth]="true"
            variant="primary"
          >
            {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </app-button>

          <div class="text-center text-sm">
            <span class="text-muted-foreground">¿Ya tienes cuenta? </span>
            <a routerLink="/login" class="font-medium hover:underline text-primary">Inicia Sesión</a>
          </div>
        </form>
      </app-card>
    </div>
  `,
    styles: []
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

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
        if (control?.touched && control?.errors?.['required']) return 'El usuario es requerido';
        if (control?.touched && control?.errors?.['minlength']) return 'Mínimo 3 caracteres';
        if (control?.touched && control?.errors?.['pattern']) return 'Solo letras, números y guión bajo';
        return '';
    }

    get emailError(): string {
        const control = this.registerForm.get('email');
        if (control?.touched && control?.errors?.['required']) return 'El email es requerido';
        if (control?.touched && control?.errors?.['email']) return 'Email inválido';
        return '';
    }

    get passwordError(): string {
        const control = this.registerForm.get('password');
        if (control?.touched && control?.errors?.['required']) return 'La contraseña es requerida';
        if (control?.touched && control?.errors?.['minlength']) return 'Mínimo 6 caracteres';
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
            // Pass metadata for trigger to use
            const { error } = await this.authService.signUp(email, password, { username });
            if (error) throw error;

            this.successMessage = '¡Cuenta creada! Por favor verifica tu email o inicia sesión.';
            // Optional: Redirect after delay or let them read the message
            setTimeout(() => this.router.navigate(['/login']), 2000);
        } catch (err: any) {
            this.errorMessage = err.message || 'Error al crear cuenta';
        } finally {
            this.isLoading = false;
        }
    }
}
