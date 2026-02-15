import { Component, OnDestroy, OnInit, ElementRef, ViewChild, inject } from '@angular/core';
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
    template: `
    <div class="relative w-full h-[calc(100vh-64px)] bg-black flex items-center justify-center overflow-hidden">
        <div #gameContainer id="game-container"></div>
        
        <!-- Chat Overlay -->
        <app-chat *ngIf="authenticated" class="absolute inset-0 pointer-events-none"></app-chat>

        <div *ngIf="!authenticated" class="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
            <p class="text-xl font-bold text-destructive">You must be logged in to enter the Forest.</p>
        </div>
        <div class="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded text-white text-xs">
            <p>Arrows or WASD to Move</p>
        </div>
    </div>
  `,
    styles: [`
    #game-container {
        width: 800px;
        height: 600px;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
    }
  `]
})
export class ForestComponent implements OnInit, OnDestroy {
    @ViewChild('gameContainer') gameContainer!: ElementRef;

    private game: Game | undefined;
    private authService = inject(AuthService);
    private socketService = inject(SocketService);

    authenticated = false;

    async ngOnInit() {
        this.authenticated = this.authService.isAuthenticated(); // Sync check usually sufficient if signal/observable
        if (this.authenticated) {
            this.socketService.connect();
            // Delay game init slightly to ensure container is ready (ngAfterViewInit is safer but this works with setTimeout usually, or just move to AfterViewInit)
        }
    }

    ngAfterViewInit() {
        if (this.authenticated) {
            this.initGame();
        }
    }

    initGame() {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: this.gameContainer.nativeElement,
            scene: [BootScene, MainScene],
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 }, // Top down
                    debug: false
                }
            },
            backgroundColor: '#2d2d2d',
            pixelArt: true, // Crucial for pixel art crispness
            roundPixels: true
        };

        this.game = new Game(config);

        // Pass services to scene
        this.game.registry.set('socketService', this.socketService);
        const user = this.authService.user();
        // Force cast or check if property exists, or use metadata
        const username = (user as any)?.user_metadata?.username || (user as any)?.username || user?.email?.split('@')[0] || 'Guest';
        this.game.registry.set('username', username);
        // Alternatively, scenes can inject via constructor if we manage them, but Phaser manages scenes.
        // Better way: pass data to scene.start, but BootScene starts first.
        // We can use the registry or data manager.
        // Or we can modify MainScene to look up from registry?
        // In MainScene.ts I wrote `init(data)`.
        // I need to pass data when starting MainScene.
        // BootScene starts MainScene. I should pass data there?
        // Or just use a singleton/service pattern.
        // Actually, in `MainScene.ts` I wrote: `init(data: { socketService: SocketService })`.
        // So BootScene needs to pass it.
    }

    ngOnDestroy() {
        if (this.game) {
            this.game.destroy(true);
        }
        this.socketService.disconnect();
    }
}
