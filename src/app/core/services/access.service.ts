import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AccessService {
    private readonly STORAGE_KEY = 'tc_unlocked';
    private http = inject(HttpClient);
    private readonly API_URL = environment.mmoUrl || 'http://localhost:3000';
    private unlockedSignal = signal<boolean>(false);
    isUnlocked = this.unlockedSignal.asReadonly();

    constructor() {
        this.checkInitialState();
    }

    private checkInitialState() {
        const isUnlocked = localStorage.getItem(this.STORAGE_KEY) === 'true';
        this.unlockedSignal.set(isUnlocked);
    }

    async validateKey(key: string): Promise<boolean> {
        try {
            const response = await firstValueFrom(
                this.http.post<{ valid: boolean }>(`${this.API_URL}/verify-access`, { key })
            );

            if (response.valid) {
                this.unlock();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Access verification failed:', error);
            return false;
        }
    }

    private unlock() {
        localStorage.setItem(this.STORAGE_KEY, 'true');
        this.unlockedSignal.set(true);
    }

    lock() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.unlockedSignal.set(false);
    }
}
