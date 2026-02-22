import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User, AuthError } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Auth-only Supabase client — not exposed outside, no DB access
    private readonly authClient: SupabaseClient = createClient(
        environment.supabaseUrl,
        environment.supabaseKey
    );

    private currentUser = signal<User | null>(null);
    private currentSession = signal<any>(null);

    // Public readonly signals
    user = this.currentUser.asReadonly();
    session = this.currentSession.asReadonly();
    isAuthenticated = computed(() => this.currentUser() !== null);
    isAdmin = computed(() => {
        const user = this.currentUser();
        return user?.app_metadata?.['claims_admin'] === true || user?.user_metadata?.['is_admin'] === true;
    });

    constructor(private router: Router) {
        this.initAuthListener();
    }

    private async initAuthListener() {
        try {
            const { data: { session }, error } = await this.authClient.auth.getSession();

            if (error) {
                // Invalid/expired refresh token — clear stale session silently
                console.warn('[Auth] Session inválida, limpiando...', error.message);
                await this.authClient.auth.signOut();
                this.currentUser.set(null);
                this.currentSession.set(null);
            } else {
                this.currentUser.set(session?.user ?? null);
                this.currentSession.set(session);
            }
        } catch (err) {
            // Unexpected error (network, etc.) — fail safe
            console.warn('[Auth] Error inesperado al inicializar sesión:', err);
            this.currentUser.set(null);
            this.currentSession.set(null);
        }

        this.authClient.auth.onAuthStateChange((_event, session) => {
            this.currentUser.set(session?.user ?? null);
            this.currentSession.set(session);
        });
    }

    async signUp(email: string, password: string, userData: any): Promise<{ error: AuthError | null }> {
        const { data, error } = await this.authClient.auth.signUp({
            email,
            password,
            options: { data: userData }
        });

        if (data.user && !error) {
            // TODO: notify API to create profile record
        }

        return { error };
    }

    async signIn(email: string, password: string): Promise<{ data?: { user: User | null, session: any }, error: AuthError | null }> {
        try {
            const { data, error } = await this.authClient.auth.signInWithPassword({ email, password });

            if (data.user && !error) {
                this.currentUser.set(data.user);
                this.currentSession.set(data.session);
                return { data, error: null };
            }

            if (error) return { error };
        } catch (err: any) {
            console.error('Unexpected auth error:', err);
            return { error: { message: 'Unexpected error', name: 'AuthError', status: 500 } as AuthError };
        }
        return { error: { message: 'Unknown error', name: 'AuthError', status: 500 } as AuthError };
    }

    async signOut(): Promise<void> {
        await this.authClient.auth.signOut();
        this.currentUser.set(null);
        await this.router.navigate(['/']);
    }

    async getCurrentUser(): Promise<User | null> {
        const { data: { user } } = await this.authClient.auth.getUser();
        return user;
    }
}
