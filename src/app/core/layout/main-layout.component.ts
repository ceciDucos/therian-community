
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
  template: `
    <div class="min-h-screen bg-background font-sans antialiased text-foreground">
      <!-- Navbar -->
      <nav class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="container flex h-14 items-center">
          <div class="mr-4 hidden md:flex">
            <a routerLink="/" class="mr-6 flex items-center space-x-2">
              <span class="hidden font-bold sm:inline-block">Therian Community</span>
            </a>
            <nav class="flex items-center space-x-6 text-sm font-medium">
              <a routerLink="/feed" class="transition-colors hover:text-foreground/80 text-foreground/60">{{ 'nav.community' | translate }}</a>
              <a routerLink="/media" class="transition-colors hover:text-foreground/80 text-foreground/60">{{ 'nav.multimedia' | translate }}</a>
              <a routerLink="/store" class="transition-colors hover:text-foreground/80 text-foreground/60">{{ 'nav.store' | translate }}</a>
              <a routerLink="/forest" class="transition-colors hover:text-emerald-500 text-emerald-600 font-semibold flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trees"><path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 5.3-1.8 1.54 1.54 0 0 1 1.7 1.7"/><path d="M14 19s-1.6-3-3.5-3c2-2 3-5 5.5-5 2.5 0 3.5 3 5.5 5-2 0-3.5 3-3.5 3"/><path d="M12 19V10"/><path d="M19 19V11"/></svg>
                Bosque
              </a>

              <!-- Aprender Dropdown -->
              <div class="relative group">
                <button class="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1 py-4 cursor-pointer">
                  {{ 'nav.learn' | translate }}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="transition-transform group-hover:rotate-180">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                <div class="absolute top-full left-0 w-56 bg-card border rounded-lg shadow-lg py-1 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                  <a routerLink="/que-es-therian" class="block px-4 py-2 text-sm hover:bg-muted transition-colors cursor-pointer">{{ 'nav.learnWhat' | translate }}</a>
                  <a routerLink="/glosario" class="block px-4 py-2 text-sm hover:bg-muted transition-colors cursor-pointer">{{ 'nav.learnGlossary' | translate }}</a>
                  <a routerLink="/mitos" class="block px-4 py-2 text-sm hover:bg-muted transition-colors cursor-pointer">{{ 'nav.learnMyths' | translate }}</a>
                  <a routerLink="/normas" class="block px-4 py-2 text-sm hover:bg-muted transition-colors cursor-pointer">{{ 'nav.learnRules' | translate }}</a>
                </div>
              </div>
            </nav>
          </div>

          <!-- Mobile Menu Button -->
          <button class="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                  (click)="toggleMobileMenu()">
            <span class="sr-only">{{ 'nav.toggleMenu' | translate }}</span>
            @if (!mobileMenuOpen()) {
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            }
          </button>

          <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div class="w-full flex-1 md:w-auto md:flex-none">
            </div>
            <nav class="flex items-center gap-2">
              <!-- Language Toggle -->
              <button
                (click)="i18n.toggleLang()"
                class="px-2 py-1 rounded-md text-xs font-bold hover:bg-muted transition-colors text-muted-foreground hover:text-foreground border"
                title="Switch language"
              >
                {{ i18n.currentLang() === 'es' ? 'EN' : 'ES' }}
              </button>

              <!-- Theme Toggle -->
              <button
                (click)="themeService.toggle()"
                class="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                [title]="themeService.theme() === 'dark' ? ('nav.toggleLight' | translate) : ('nav.toggleDark' | translate)"
              >
                @if (themeService.theme() === 'light') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                }
              </button>
              @if (authService.isAuthenticated()) {
                <a routerLink="/profile" class="text-sm font-medium hidden md:inline-block mr-2 hover:text-primary transition-colors cursor-pointer">
                  {{ authService.user()?.user_metadata?.['username'] || 'User' }}
                </a>
                <app-button variant="outline" size="sm" (click)="logout()">{{ 'nav.logout' | translate }}</app-button>
              } @else {
                <app-button variant="ghost" size="sm" routerLink="/login">{{ 'nav.login' | translate }}</app-button>
                <app-button variant="primary" size="sm" routerLink="/register">{{ 'nav.register' | translate }}</app-button>
              }
            </nav>
          </div>
        </div>

        <!-- Mobile Menu -->
        @if (mobileMenuOpen()) {
          <div class="md:hidden border-t bg-background">
            <div class="container py-4 space-y-3">
              <a routerLink="/feed" class="block py-2 text-sm font-medium hover:text-primary transition-colors" (click)="mobileMenuOpen.set(false)">{{ 'nav.community' | translate }}</a>
              <a routerLink="/media" class="block py-2 text-sm font-medium hover:text-primary transition-colors" (click)="mobileMenuOpen.set(false)">{{ 'nav.multimedia' | translate }}</a>
              <a routerLink="/store" class="block py-2 text-sm font-medium hover:text-primary transition-colors" (click)="mobileMenuOpen.set(false)">{{ 'nav.store' | translate }}</a>
              <div class="border-t pt-3 mt-3">
                <p class="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">{{ 'nav.learn' | translate }}</p>
                <a routerLink="/que-es-therian" class="block py-1.5 text-sm hover:text-primary transition-colors" (click)="mobileMenuOpen.set(false)">{{ 'nav.learnWhat' | translate }}</a>
                <a routerLink="/glosario" class="block py-1.5 text-sm hover:text-primary transition-colors" (click)="mobileMenuOpen.set(false)">{{ 'nav.learnGlossary' | translate }}</a>
                <a routerLink="/mitos" class="block py-1.5 text-sm hover:text-primary transition-colors" (click)="mobileMenuOpen.set(false)">{{ 'nav.learnMyths' | translate }}</a>
                <a routerLink="/normas" class="block py-1.5 text-sm hover:text-primary transition-colors" (click)="mobileMenuOpen.set(false)">{{ 'nav.learnRules' | translate }}</a>
              </div>
            </div>
          </div>
        }
      </nav>

      <!-- Main Content -->
      <main class="flex-1">
        <div class="container py-6">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Footer -->
      <footer class="py-6 md:px-8 md:py-0 border-t">
        <div class="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {{ 'footer.builtBy' | translate }} <a href="#" class="font-medium underline underline-offset-4">TherianCommunity</a>.
          </p>
          <nav class="flex items-center gap-4 text-sm text-muted-foreground">
            <a routerLink="/que-es-therian" class="hover:text-foreground transition-colors">{{ 'footer.whatIs' | translate }}</a>
            <a routerLink="/glosario" class="hover:text-foreground transition-colors">{{ 'footer.glossary' | translate }}</a>
            <a routerLink="/normas" class="hover:text-foreground transition-colors">{{ 'footer.rules' | translate }}</a>
          </nav>
        </div>
      </footer>
    </div>
  `,
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
