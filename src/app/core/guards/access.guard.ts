import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccessService } from '../services/access.service';

export const accessGuard: CanActivateFn = (route, state) => {
    const accessService = inject(AccessService);
    const router = inject(Router);

    if (accessService.isUnlocked()) {
        return true;
    }

    // Redirect to welcome page if not unlocked
    return router.createUrlTree(['/welcome']);
};
