import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        if (!environment.supabaseUrl || !environment.supabaseKey) {
            console.warn('Supabase not configured. Please set environment variables.');
        }

        this.supabase = createClient(
            environment.supabaseUrl || '',
            environment.supabaseKey || ''
        );
    }

    get client(): SupabaseClient {
        return this.supabase;
    }

    // Auth helpers
    get auth() {
        return this.supabase.auth;
    }

    // Storage helpers
    get storage() {
        return this.supabase.storage;
    }
}
