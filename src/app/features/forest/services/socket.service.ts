import { Injectable, signal, inject } from '@angular/core';
import io, { Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket | undefined;
    private url = environment.mmoUrl;
    private authService = inject(AuthService);

    // State signals
    private currentUsername = signal<string>('Guest');
    username = this.currentUsername.asReadonly();

    // Events
    public state$ = new Subject<any>();
    public messages$ = new Subject<{ id: string, username: string, message: string }>();
    public emotes$ = new Subject<{ id: string, emote: string }>();

    get socketId() {
        return this.socket?.id;
    }

    constructor() {
        // In a real app we'd set this from auth
        // We can use an effect here or just check once since this service is likely singleton-ish but depends on auth
        // Better to check on connect or when auth changes, but for now constructor is fine if auth is ready.
        // Actually best to set it in connect() or use an effect.
        // Let's use a computed in AuthService? or just grab it here.
        const user = this.authService.user();
        if (user) {
            const name = (user as any)?.user_metadata?.username || (user as any)?.username || user?.email?.split('@')[0] || 'Guest';
            this.currentUsername.set(name);
        }
    }

    connect() {
        const token = this.authService.session()?.access_token;

        if (!token) {
            console.error('No token found for socket connection');
            return;
        }

        this.socket = io(this.url, {
            auth: { token },
            transports: ['websocket']
        });

        this.socket.on('connect', () => {
            console.log('Connected to MMO Server:', this.socket?.id);
        });

        this.socket.on('state', (state: any) => {
            this.state$.next(state);
        });

        this.socket.on('chatMessage', (msg: any) => {
            this.messages$.next(msg);
        });

        this.socket.on('playerEmote', (data: any) => {
            this.emotes$.next(data);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from MMO Server');
        });
    }

    emit(event: string, data: any) {
        this.socket?.emit(event, data);
    }

    sendMessage(message: string) {
        this.socket?.emit('chat', message);
    }

    sendEmote(emote: string) {
        this.socket?.emit('emote', emote);
    }

    disconnect() {
        this.socket?.disconnect();
    }
}
