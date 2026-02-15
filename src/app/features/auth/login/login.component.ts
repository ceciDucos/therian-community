import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { CardComponent } from '../../../shared/components/card/card.component';

import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, TranslateModule, CardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = signal(false);
  errorMessage = signal('');

  getEmailError(): string {
    const control = this.loginForm.controls.email;
    if (control.touched && control.hasError('required')) return this.translate.instant('auth.emailRequired');
    if (control.touched && control.hasError('email')) return this.translate.instant('auth.emailInvalid');
    return '';
  }

  getPasswordError(): string {
    const control = this.loginForm.controls.password;
    if (control.touched && control.hasError('required')) return this.translate.instant('auth.passwordRequired');
    if (control.touched && control.hasError('minlength')) return this.translate.instant('auth.passwordMin');
    return '';
  }

  emailError() { return this.getEmailError(); }
  passwordError() { return this.getPasswordError(); }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm.getRawValue();

    try {
      const { error } = await this.authService.signIn(email, password);
      if (error) throw error;
      this.router.navigate(['/']);
    } catch (err: any) {
      this.errorMessage.set(err.message || this.translate.instant('auth.loginError'));
    } finally {
      this.isLoading.set(false);
    }
  }
}
