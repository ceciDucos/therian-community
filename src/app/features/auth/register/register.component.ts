import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent, TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // Helper methods to match template calls (acting as computed values via function call on change detection)
  getUsernameError(): string {
    const control = this.registerForm.controls.username;
    if (control.touched && control.hasError('required')) return this.translate.instant('auth.usernameRequired');
    if (control.touched && control.hasError('minlength')) return this.translate.instant('auth.usernameMin');
    if (control.touched && control.hasError('pattern')) return this.translate.instant('auth.usernamePattern');
    return '';
  }

  getEmailError(): string {
    const control = this.registerForm.controls.email;
    if (control.touched && control.hasError('required')) return this.translate.instant('auth.emailRequired');
    if (control.touched && control.hasError('email')) return this.translate.instant('auth.emailInvalid');
    return '';
  }

  getPasswordError(): string {
    const control = this.registerForm.controls.password;
    if (control.touched && control.hasError('required')) return this.translate.instant('auth.passwordRequired');
    if (control.touched && control.hasError('minlength')) return this.translate.instant('auth.passwordMin');
    return '';
  }

  // Aliases for template usage [error]="usernameError()"
  usernameError() { return this.getUsernameError(); }
  emailError() { return this.getEmailError(); }
  passwordError() { return this.getPasswordError(); }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { email, password, username } = this.registerForm.getRawValue();

    try {
      const { error } = await this.authService.signUp(email, password, { username });
      if (error) throw error;

      this.successMessage.set(this.translate.instant('auth.accountCreated'));
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (err: any) {
      this.errorMessage.set(err.message || this.translate.instant('auth.registerError'));
    } finally {
      this.isLoading.set(false);
    }
  }
}
