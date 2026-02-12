
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div [class]="getClasses()">
      <div *ngIf="header || title" class="flex flex-col space-y-1.5 p-6">
        <h3 *ngIf="title" class="text-2xl font-semibold leading-none tracking-tight">{{ title }}</h3>
        <p *ngIf="description" class="text-sm text-muted-foreground">{{ description }}</p>
        <ng-content select="[header]"></ng-content>
      </div>
      <div class="p-6 pt-0" [class.p-6]="!header && !title">
        <ng-content></ng-content>
      </div>
      <div *ngIf="footer" class="flex items-center p-6 pt-0">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
    styles: []
})
export class CardComponent {
    @Input() title: string = '';
    @Input() description: string = '';
    @Input() footer: boolean = false;
    @Input() header: boolean = false; /* If true, expects projected content for header */
    @Input() className: string = '';

    getClasses(): string {
        return `rounded-lg border bg-card text-card-foreground shadow-sm ${this.className}`;
    }
}
