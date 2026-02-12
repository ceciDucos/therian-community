import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
            { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
            {
                path: 'profile',
                loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
                canActivate: [(route, state) => import('./core/guards/auth.guard').then(m => m.authGuard(route, state))]
            },
            {
                path: 'feed',
                loadComponent: () => import('./features/community/feed/feed.component').then(m => m.FeedComponent),
                canActivate: [(route, state) => import('./core/guards/auth.guard').then(m => m.authGuard(route, state))]
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
            },
            {
                path: 'admin',
                loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
                canActivate: [(route, state) => import('./core/guards/auth.guard').then(m => m.authGuard(route, state))]
                // TODO: Add adminGuard specific check if needed, relying on functional guard/service/profile check within component or robust guard
            },
            // Future routes will go here
        ]
    },
    { path: '**', redirectTo: '' }
];
