
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="getClasses()"
      (click)="onClick($event)">
      <ng-content></ng-content>
    </button>
  `,
    styles: []
})
export class ButtonComponent {
    @Input() variant: ButtonVariant = 'primary';
    @Input() size: ButtonSize = 'md';
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() disabled: boolean = false;
    @Input() fullWidth: boolean = false;

    getClasses(): string {
        const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';

        const variantClasses = {
            primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
            outline: 'border border-input hover:bg-accent hover:text-accent-foreground focus:ring-accent',
            ghost: 'hover:bg-accent hover:text-accent-foreground focus:ring-accent',
            danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive'
        };

        const sizeClasses = {
            sm: 'h-9 px-3 text-xs',
            md: 'h-10 py-2 px-4 text-sm',
            lg: 'h-11 px-8 text-base'
        };

        const widthClass = this.fullWidth ? 'w-full' : '';

        return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]} ${widthClass}`;
    }

    onClick(event: Event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
}
