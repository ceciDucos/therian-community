
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, CardComponent],
  template: `
    <div class="space-y-12">
      <!-- Hero Section -->
      <section class="flex flex-col items-center justify-center space-y-4 text-center py-20">
        <h1 class="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Therian Community
        </h1>
        <p class="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Un espacio seguro para explorar tu identidad, conectar con tu manada y expresar tu verdadero ser.
        </p>
        <div class="flex gap-4">
          <app-button variant="primary" size="lg" routerLink="/register">Únete a la Manada</app-button>
          <app-button variant="outline" size="lg" routerLink="/learn">Descubre Más</app-button>
        </div>
      </section>

      <!-- Features Section -->
      <section class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <app-card title="Comunidad" description="Conecta con otros therians" [header]="true">
          <p class="text-sm text-muted-foreground mb-4">
            Comparte tus experiencias, shifts y arte en un entorno moderado y seguro.
          </p>
          <app-button variant="ghost" size="sm" class="w-full" routerLink="/feed">Ir al Feed</app-button>
        </app-card>
        
        <app-card title="Tienda" description="Gear y accesorios" [header]="true">
          <p class="text-sm text-muted-foreground mb-4">
            Encuentra máscaras, colas y accesorios hechos a mano por la comunidad.
          </p>
          <app-button variant="ghost" size="sm" class="w-full" routerLink="/store">Visitar Tienda</app-button>
        </app-card>

        <app-card title="Recursos" description="Aprende y crece" [header]="true">
          <p class="text-sm text-muted-foreground mb-4">
            Artículos educativos, guías de meditación y consejos para nuevos therians.
          </p>
          <app-button variant="ghost" size="sm" class="w-full" routerLink="/learn">Biblioteca</app-button>
        </app-card>
      </section>
    </div>
  `,
  styles: []
})
export class HomeComponent {
}
