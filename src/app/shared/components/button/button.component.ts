
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class ButtonComponent {
    variant = input<ButtonVariant>('primary');
    size = input<ButtonSize>('md');
    type = input<'button' | 'submit' | 'reset'>('button');
    disabled = input(false);
    loading = input(false);
    fullWidth = input(false);

    classes = computed(() => {
        const baseClasses = 'btn';

        const variantClasses = {
            primary: 'btn--primary',
            secondary: 'btn--secondary',
            outline: 'btn--outline',
            ghost: 'btn--ghost',
            danger: 'btn--danger'
        };

        const sizeClasses = {
            sm: 'btn--sm',
            md: 'btn--md',
            lg: 'btn--lg'
        };

        const widthClass = this.fullWidth() ? 'btn--full' : '';
        const loadingClass = this.loading() ? 'btn--loading' : '';

        return `${baseClasses} ${variantClasses[this.variant()]} ${sizeClasses[this.size()]} ${widthClass} ${loadingClass}`;
    });

    onClick(event: Event) {
        if (this.disabled()) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
}
