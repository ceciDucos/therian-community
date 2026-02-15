import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { I18nService } from '../../services/i18n.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonComponent, TranslateModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    authService = inject(AuthService);
    themeService = inject(ThemeService);
    i18n = inject(I18nService);
    private router = inject(Router);

    mobileMenuOpen = signal(false);

    toggleMobileMenu() {
        this.mobileMenuOpen.update(v => !v);
    }

    async logout() {
        await this.authService.signOut();
        this.router.navigate(['/']);
    }
}
