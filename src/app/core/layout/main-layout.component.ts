
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
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
              <a routerLink="/feed" class="transition-colors hover:text-foreground/80 text-foreground/60">Comunidad</a>
              <a routerLink="/media" class="transition-colors hover:text-foreground/80 text-foreground/60">Multimedia</a>
              <a routerLink="/store" class="transition-colors hover:text-foreground/80 text-foreground/60">Tienda</a>
              <a routerLink="/learn" class="transition-colors hover:text-foreground/80 text-foreground/60">Aprender</a>
            </nav>
          </div>
          
          <!-- Mobile Menu Button (Placeholder) -->
          <button class="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
            <span class="sr-only">Toggle Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>

          <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div class="w-full flex-1 md:w-auto md:flex-none">
              <!-- Search Placeholder -->
            </div>
            <nav class="flex items-center gap-2">
              <ng-container *ngIf="authService.isAuthenticated(); else authButtons">
                <span class="text-sm font-medium hidden md:inline-block mr-2">
                  {{ authService.user()?.user_metadata?.['username'] || 'User' }}
                </span>
                <app-button variant="outline" size="sm" (click)="logout()">Logout</app-button>
              </ng-container>
              <ng-template #authButtons>
                <app-button variant="ghost" size="sm" routerLink="/login">Login</app-button>
                <app-button variant="primary" size="sm" routerLink="/register">Register</app-button>
              </ng-template>
            </nav>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1">
        <div class="container py-6">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Footer -->
      <footer class="py-6 md:px-8 md:py-0">
        <div class="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by <a href="#" class="font-medium underline underline-offset-4">TherianCommunity</a>.
            The source code is available on <a href="#" class="font-medium underline underline-offset-4">GitHub</a>.
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/']);
  }
}
