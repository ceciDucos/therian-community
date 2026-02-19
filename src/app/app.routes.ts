import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout.component';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { accessGuard } from './core/guards/access.guard';

export const routes: Routes = [
    {
        path: 'welcome',
        loadComponent: () => import('./features/public/wip/wip.component').then(m => m.WipComponent)
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [accessGuard],
        children: [
            { path: '', component: HomeComponent },
            { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
            { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
            {
                path: 'profile',
                loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
                canActivate: [authGuard]
            },
            /* {
                path: 'feed',
                loadComponent: () => import('./features/community/feed/feed.component').then(m => m.FeedComponent)
            },
            {
                path: 'store',
                loadComponent: () => import('./features/store/store.component').then(m => m.StoreComponent)
            },
            {
                path: 'store/:id',
                loadComponent: () => import('./features/store/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
            },
            {
                path: 'media',
                loadComponent: () => import('./features/media/video-gallery/video-gallery.component').then(m => m.VideoGalleryComponent)
            }, */
            {
                path: 'admin',
                loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
                canActivate: [authGuard]
            },
            // Educational / Public pages
            { path: 'info', loadComponent: () => import('./features/public/therian-guide/therian-guide.component').then(m => m.TherianGuideComponent) },
            { path: 'glossary', loadComponent: () => import('./features/public/glosario/glosario.component').then(m => m.GlosarioComponent) },
            { path: 'myths', loadComponent: () => import('./features/public/mitos/mitos.component').then(m => m.MitosComponent) },
            { path: 'guidelines', loadComponent: () => import('./features/public/normas/normas.component').then(m => m.NormasComponent) },
            // Public profile
            { path: 'u/:username', loadComponent: () => import('./features/profile/public-profile/public-profile.component').then(m => m.PublicProfileComponent) },
            // MMO
            { path: 'forest', loadComponent: () => import('./features/forest/forest.component').then(m => m.ForestComponent) },
        ]
    },
    { path: '**', loadComponent: () => import('./features/public/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
