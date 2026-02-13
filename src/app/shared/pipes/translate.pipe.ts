import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

/**
 * Usage: {{ 'nav.community' | translate }}
 * Note: This pipe is impure so it reacts to language changes.
 */
@Pipe({
    name: 'translate',
    standalone: true,
    pure: false
})
export class TranslatePipe implements PipeTransform {
    private i18n = inject(I18nService);

    transform(key: string): string {
        return this.i18n.t(key);
    }
}
