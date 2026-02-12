import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { User, AuthError } from '@supabase/supabase-js';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUser = signal<User | null>(null);

    // Public readonly signals
    user = this.currentUser.asReadonly();
    isAuthenticated = computed(() => this.currentUser() !== null);
    isAdmin = computed(() => {
        const user = this.currentUser();
        // Check both metadata (if set there) and profile (we need to fetch profile for this to be 100% accurate, 
        // but for now let's assume we might set it in metadata or fetch it. 
        // Since we don't have the profile loaded here constantly, we might rely on metadata for quick check locally 
        // or we need to load the profile. 
        // Let's assume we put 'is_admin' in app_metadata or user_metadata for easier access).
        return user?.app_metadata?.['claims_admin'] === true || user?.user_metadata?.['is_admin'] === true;
    });

    constructor(
        private supabase: SupabaseService,
        private router: Router
    ) {
        this.initAuthListener();
    }

    private async initAuthListener() {
        // Get initial session
        const { data: { session } } = await this.supabase.auth.getSession();
        this.currentUser.set(session?.user ?? null);

        // Listen for auth changes
        this.supabase.auth.onAuthStateChange((_event, session) => {
            this.currentUser.set(session?.user ?? null);
        });
    }

    async signUp(email: string, password: string, userData: any): Promise<{ error: AuthError | null }> {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        });

        if (data.user && !error) {
            // Create profile in database
            // TODO: Implement profile creation
        }

        return { error };
    }

    async signIn(email: string, password: string): Promise<{ error: AuthError | null }> {
        const { error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (!error) {
            await this.router.navigate(['/feed']);
        }

        return { error };
    }

    async signOut(): Promise<void> {
        await this.supabase.auth.signOut();
        this.currentUser.set(null);
        await this.router.navigate(['/']);
    }

    async getCurrentUser(): Promise<User | null> {
        const { data: { user } } = await this.supabase.auth.getUser();
        return user;
    }
}
