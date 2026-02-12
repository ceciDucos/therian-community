
import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safe',
    standalone: true
})
export class SafePipe implements PipeTransform {
    private sanitizer = inject(DomSanitizer);

    transform(url: string, type: 'resourceUrl' | 'html' = 'resourceUrl'): SafeResourceUrl {
        switch (type) {
            case 'resourceUrl':
                return this.sanitizer.bypassSecurityTrustResourceUrl(url);
            case 'html': // useful for svg icons or raw html
                return this.sanitizer.bypassSecurityTrustHtml(url);
            default:
                return this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
    }
}
