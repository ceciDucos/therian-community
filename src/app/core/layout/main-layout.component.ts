
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, TranslatePipe],
  templateUrl: './main-layout.component.html',
  styles: []
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  themeService = inject(ThemeService);
  i18n = inject(I18nService);
  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/']);
  }
}
