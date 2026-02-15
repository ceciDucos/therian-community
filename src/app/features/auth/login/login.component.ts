import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  i18n = inject(I18nService);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = signal(false);
  errorMessage = signal('');

  // Computed signals for errors could be overkill if form structure is simple,
  // but let's stick to methods or computed if we tracked form status in a signal.
  // Since FormGroup is not signal-based by default in older Angular, we'll keep getters 
  // or just simple methods, but the UI calls them.
  // We can make them computed if we listen to valueChanges, but for now simple getters are fine
  // or we can just invoke the logic in the template. 
  // Let's keep the logic simple as getters but mapped to signals isn't direct without RxJS interop.
  // So we will just use standard getters but return the value, and the template uses () for signals where appropriate.
  // Actually, wait, the template uses error="emailError()" which implies it's a signal or function.
  // Let's make them functions to match the template call style if I used () in template.
  // In the template I wrote: [error]="emailError()" - so it expects a signal or function.



  // Better approach: straightforward methods called by template, 
  // or wrapping the form state. 
  // For now I'll use signals for loading/error state provided by the component logic.

  // NOTE: In the template I used `emailError()` which tries to call the signal.
  // But since form controls aren't signals, I can't easily make a computed signal that updates automatically
  // without `toSignal(this.loginForm.valueChanges)`.
  // I'll stick to methods for validation messages to avoid complex setup, 
  // but call them as functions in template.

  getEmailError(): string {
    const control = this.loginForm.controls.email;
    if (control.touched && control.hasError('required')) return this.i18n.t('auth.emailRequired');
    if (control.touched && control.hasError('email')) return this.i18n.t('auth.emailInvalid');
    return '';
  }

  getPasswordError(): string {
    const control = this.loginForm.controls.password;
    if (control.touched && control.hasError('required')) return this.i18n.t('auth.passwordRequired');
    if (control.touched && control.hasError('minlength')) return this.i18n.t('auth.passwordMin');
    return '';
  }

  emailError() { return this.getEmailError(); }
  passwordError() { return this.getPasswordError(); }

  // To make the template `emailError()` work if it refers to the computed signal:
  // I will just define methods and change template to `emailError()` (method call).
  // Wait, I already wrote the template to use `emailError()`.

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
      this.errorMessage.set(err.message || this.i18n.t('auth.loginError'));
    } finally {
      this.isLoading.set(false);
    }
  }
}
