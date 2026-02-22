import { Scene } from 'phaser';
import { SocketService } from '../services/socket.service';

export class MainScene extends Scene {
    private socketService!: SocketService;
    // Store sprite, nametag AND bubble
    private players: Map<string, { sprite: Phaser.GameObjects.Sprite, nametag: Phaser.GameObjects.Text, bubble?: Phaser.GameObjects.Container }> = new Map();
    private myPlayer: { sprite: Phaser.GameObjects.Sprite, nametag: Phaser.GameObjects.Text, bubble?: Phaser.GameObjects.Container } | undefined;
    private restArea!: Phaser.Geom.Circle;
    private inRestArea = false;

    // Fixed world size — ALL clients share these coordinates regardless of screen size
    private readonly WORLD_W = 1280;
    private readonly WORLD_H = 720;
    // Rest Area position in world coordinates (consistent for every client)
    private readonly REST_X = 1280 * 0.81;
    private readonly REST_Y = 720 * 0.75;

    // Native key tracking — no Phaser keyboard, no blanket preventDefault
    private keysDown = new Set<string>();
    private readonly MOVEMENT_KEYS = new Set(['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a', 's', 'd', 'w']);

    private onKeyDown = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase();
        this.keysDown.add(key);
        // Prevent page scroll for movement keys, but only when not typing in a field
        const active = document.activeElement;
        const isTyping = active instanceof HTMLTextAreaElement || active instanceof HTMLInputElement;
        if (!isTyping && this.MOVEMENT_KEYS.has(key)) e.preventDefault();
    };
    private onKeyUp = (e: KeyboardEvent) => this.keysDown.delete(e.key.toLowerCase());

    constructor() {
        super({ key: 'MainScene' });
    }

    init(data: { socketService: SocketService }) {
        this.socketService = data.socketService;
    }

    create() {
        // Background fills the fixed world (1280x720 — same for all clients)
        this.add.image(this.WORLD_W / 2, this.WORLD_H / 2, 'forest-bg')
            .setDisplaySize(this.WORLD_W, this.WORLD_H);

        // Use native DOM listeners — no Phaser keyboard capture
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);

        // Rest Area in WORLD coordinates — identical position on every client
        this.restArea = new Phaser.Geom.Circle(this.REST_X, this.REST_Y, 60);

        const restGfx = this.add.graphics();
        restGfx.fillStyle(0x00ff00, 0.2);
        restGfx.fillCircle(this.REST_X, this.REST_Y, 60);
        restGfx.lineStyle(2, 0x00ff00, 0.5);
        restGfx.strokeCircle(this.REST_X, this.REST_Y, 60);

        this.add.text(this.REST_X, this.REST_Y, '💤 Rest Area', {
            fontSize: '12px',
            color: '#aaffaa'
        }).setOrigin(0.5);

        // Listen for state updates (initial join snapshot)
        this.socketService.state$.subscribe((state: any) => {
            this.updatePlayers(state.players);
        });

        // Listen for new players joining AFTER you're already connected
        this.socketService.playerJoined$.subscribe(p => {
            if (!this.players.has(p.id)) {
                this.createPlayerSprite(p.id, p.x, p.y, p.username);
            }
        });

        // Listen for individual player movement updates
        this.socketService.playerMoved$.subscribe(data => {
            const playerObj = this.players.get(data.id);
            if (playerObj && data.id !== this.socketService.socketId) {
                playerObj.sprite.setPosition(data.x, data.y);
                playerObj.nametag.setPosition(data.x, data.y - 40);
                playerObj.bubble?.setPosition(data.x, data.y - 50);
            }
        });

        // Listen for players leaving
        this.socketService.playerLeft$.subscribe(data => {
            const playerObj = this.players.get(data.id);
            if (playerObj) {
                playerObj.sprite.destroy();
                playerObj.nametag.destroy();
                playerObj.bubble?.destroy();
                this.players.delete(data.id);
            }
        });

        // Listen for chat messages to spawn bubbles
        this.socketService.messages$.subscribe(msg => {
            if (this.players.has(msg.id)) {
                this.showSpeechBubble(msg.id, msg.message);
            }
        });

        // Listen for emotes
        this.socketService.emotes$.subscribe(data => {
            if (this.players.has(data.id)) {
                this.showEmote(data.id, data.emote);
            }
        });

        // Send initial join with username from registry
        const username = this.registry.get('username');
        this.socketService.emit('join', { username });
    }

    private showSpeechBubble(playerId: string, text: string) {
        const playerObj = this.players.get(playerId);
        if (!playerObj) return;

        const { sprite } = playerObj;

        // Destroy existing bubble if any
        if (playerObj.bubble) {
            playerObj.bubble.destroy();
            playerObj.bubble = undefined;
        }

        const bubble = this.add.container(sprite.x, sprite.y - 50); // Just above nametag
        playerObj.bubble = bubble;

        const content = this.add.text(0, 0, text, {
            fontFamily: 'Arial',
            fontSize: 14,
            color: '#000000',
            align: 'center',
            wordWrap: { width: 150 }
        }).setOrigin(0.5);

        const bounds = content.getBounds();
        const padding = 10;
        const bg = this.add.graphics();

        bg.fillStyle(0xffffff, 1);
        bg.lineStyle(2, 0x000000, 1);

        // Draw rounded rectangle
        bg.fillRoundedRect(
            -(bounds.width / 2) - padding,
            -(bounds.height / 2) - padding,
            bounds.width + (padding * 2),
            bounds.height + (padding * 2),
            10
        );
        bg.strokeRoundedRect(
            -(bounds.width / 2) - padding,
            -(bounds.height / 2) - padding,
            bounds.width + (padding * 2),
            bounds.height + (padding * 2),
            10
        );

        // Add a little tail
        bg.fillTriangle(
            0, (bounds.height / 2) + padding,
            -10, (bounds.height / 2) + padding,
            0, (bounds.height / 2) + padding + 10
        );
        bg.strokeTriangle(
            0, (bounds.height / 2) + padding,
            -10, (bounds.height / 2) + padding,
            0, (bounds.height / 2) + padding + 10
        );

        bubble.add([bg, content]);

        // Animate pop in
        bubble.setScale(0);
        this.tweens.add({
            targets: bubble,
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Back.out'
        });

        // Destroy after 5 seconds
        this.time.delayedCall(5000, () => {
            if (playerObj.bubble === bubble) { // Only destroy if it's still the same bubble
                this.tweens.add({
                    targets: bubble,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        bubble.destroy();
                        if (playerObj.bubble === bubble) {
                            playerObj.bubble = undefined;
                        }
                    }
                });
            }
        });
    }

    private showEmote(playerId: string, emote: string) {
        const playerObj = this.players.get(playerId);
        if (!playerObj) return;

        const { sprite } = playerObj;

        const emoteText = this.add.text(sprite.x, sprite.y - 80, emote, {
            fontSize: '32px',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Animation: Pop in and float up
        emoteText.setScale(0);
        this.tweens.add({
            targets: emoteText,
            scaleX: 1.2,
            scaleY: 1.2,
            y: sprite.y - 100,
            duration: 400,
            ease: 'Back.out',
            onComplete: () => {
                this.tweens.add({
                    targets: emoteText,
                    scaleX: 1,
                    scaleY: 1,
                    y: sprite.y - 120,
                    alpha: 0,
                    duration: 1000,
                    delay: 500,
                    onComplete: () => emoteText.destroy()
                });
            }
        });
    }

    override update() {
        // Block game input when user is typing in chat or any text field
        const active = document.activeElement;
        if (active instanceof HTMLTextAreaElement || active instanceof HTMLInputElement) return;

        if (!this.myPlayer) return;

        const player = this.myPlayer.sprite;
        const prevX = player.x;
        const prevY = player.y;

        let x = player.x;
        let y = player.y;

        const speed = 4;
        const left = this.keysDown.has('arrowleft') || this.keysDown.has('a');
        const right = this.keysDown.has('arrowright') || this.keysDown.has('d');
        const up = this.keysDown.has('arrowup') || this.keysDown.has('w');
        const down = this.keysDown.has('arrowdown') || this.keysDown.has('s');

        if (left) x -= speed;
        else if (right) x += speed;
        if (up) y -= speed;
        else if (down) y += speed;

        // Check Rest Area
        const currentlyInRestArea = Phaser.Geom.Circle.Contains(this.restArea, x, y);
        if (currentlyInRestArea && !this.inRestArea) {
            this.inRestArea = true;
            this.socketService.sendEmote('💤');
        } else if (!currentlyInRestArea && this.inRestArea) {
            this.inRestArea = false;
        }

        player.setPosition(
            Phaser.Math.Clamp(x, 25, this.WORLD_W - 25),
            Phaser.Math.Clamp(y, 25, this.WORLD_H - 25)
        );
        this.myPlayer.nametag.setPosition(x, y - 40);
        this.myPlayer.bubble?.setPosition(x, y - 50);

        if (x !== prevX || y !== prevY) {
            this.socketService.emit('move', { x, y });
        }
    }

    shutdown() {
        // Clean up native listeners when scene is destroyed
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }

    private createPlayerSprite(id: string, x: number, y: number, username: string) {
        const sprite = this.add.sprite(x, y, 'wolf').setDisplaySize(50, 50);
        const nametag = this.add.text(x, y - 40, username || 'Wolf', {
            fontSize: '14px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5);

        const playerObj = { sprite, nametag };
        this.players.set(id, playerObj);

        // Check if this is me
        if (id === this.socketService.socketId) {
            this.myPlayer = playerObj;
        }

        return playerObj;
    }

    private updatePlayers(serverPlayers: any) {
        Object.keys(serverPlayers).forEach(id => {
            const p = serverPlayers[id];
            if (!this.players.has(id)) {
                this.createPlayerSprite(id, p.x, p.y, p.username);
            } else {
                const playerObj = this.players.get(id);
                // Only update others, not myself (prevent jitter from server lag)
                if (id !== this.socketService.socketId) {
                    playerObj?.sprite.setPosition(p.x, p.y);
                    playerObj?.nametag.setPosition(p.x, p.y - 40);
                    playerObj?.bubble?.setPosition(p.x, p.y - 50);
                }
            }
        });
    }
}
