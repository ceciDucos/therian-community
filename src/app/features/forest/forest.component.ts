import { Component, OnDestroy, AfterViewInit, ElementRef, ViewChild, inject, computed, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MainScene } from './scenes/MainScene';
import { SocketService } from './services/socket.service';
import { AuthService } from '../../core/services/auth.service';
import { ChatComponent } from './components/chat/chat.component';

@Component({
    selector: 'app-forest',
    standalone: true,
    imports: [CommonModule, ChatComponent],
    templateUrl: './forest.component.html',
    styleUrl: './forest.component.scss'
})
export class ForestComponent implements AfterViewInit, OnDestroy {
    @ViewChild('gameContainer') gameContainer!: ElementRef;

    private game: Game | undefined;
    private authService = inject(AuthService);
    private socketService = inject(SocketService);
    private cdr = inject(ChangeDetectorRef);
    private viewReady = false;

    // Signal-based: no manual mutation, no ExpressionChanged error
    authenticated = computed(() => !!this.authService.user());

    constructor() {
        // React to auth changes (e.g. on page refresh session restores async)
        effect(() => {
            const isAuth = this.authenticated();
            if (isAuth && this.viewReady && !this.game) {
                this.startGame();
                // Trigger CD so template reacts to the signal
                this.cdr.detectChanges();
            }
        });
    }

    ngAfterViewInit() {
        this.viewReady = true;
        // If already authenticated when view is ready, start immediately
        if (this.authenticated() && !this.game) {
            this.startGame();
        }
    }

    private startGame() {
        if (this.game) return; // Guard against double-init

        this.socketService.connect();

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: this.gameContainer.nativeElement,
            scene: [BootScene, MainScene],
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: false
                }
            },
            backgroundColor: '#1a2a0d',
            pixelArt: true,
            roundPixels: true,
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: this.gameContainer.nativeElement.clientWidth || window.innerWidth,
                height: this.gameContainer.nativeElement.clientHeight || (window.innerHeight - 64),
            }
        };

        this.game = new Game(config);

        this.game.registry.set('socketService', this.socketService);
        const user = this.authService.user();
        const username = (user as any)?.user_metadata?.username
            || (user as any)?.username
            || user?.email?.split('@')[0]
            || 'Guest';
        this.game.registry.set('username', username);
    }

    ngOnDestroy() {
        if (this.game) {
            this.game.destroy(true);
        }
        this.socketService.disconnect();
    }
}
