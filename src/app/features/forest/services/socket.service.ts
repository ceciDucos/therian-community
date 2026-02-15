import { Injectable } from '@angular/core';
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

    // Events
    public state$ = new Subject<any>();
    public messages$ = new Subject<{ id: string, username: string, message: string }>();
    public emotes$ = new Subject<{ id: string, emote: string }>();

    get socketId() {
        return this.socket?.id;
    }

    constructor(private authService: AuthService) { }

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
