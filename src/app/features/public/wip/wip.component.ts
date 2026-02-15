import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccessService } from '../../../core/services/access.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
    selector: 'app-wip',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonComponent, CardComponent],
    templateUrl: './wip.component.html',
    styleUrl: './wip.component.scss'
})
export class WipComponent {
    private accessService = inject(AccessService);
    private router = inject(Router);

    accessKey = '';
    error = signal(false);
    loading = signal(false);

    async submitKey() {
        if (!this.accessKey) return;

        this.loading.set(true);
        this.error.set(false);

        // Small delay for "feel"
        await new Promise(resolve => setTimeout(resolve, 800));

        const isValid = await this.accessService.validateKey(this.accessKey);

        if (isValid) {
            this.router.navigate(['/']);
        } else {
            this.error.set(true);
            this.accessKey = '';
        }
        this.loading.set(false);
    }
}
