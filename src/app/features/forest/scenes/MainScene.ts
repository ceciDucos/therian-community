import { Scene } from 'phaser';
import { SocketService } from '../services/socket.service';

export class MainScene extends Scene {
    private socketService!: SocketService;
    // Store sprite, nametag AND bubble
    private players: Map<string, { sprite: Phaser.GameObjects.Sprite, nametag: Phaser.GameObjects.Text, bubble?: Phaser.GameObjects.Container }> = new Map();
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private myPlayer: { sprite: Phaser.GameObjects.Sprite, nametag: Phaser.GameObjects.Text, bubble?: Phaser.GameObjects.Container } | undefined;

    constructor() {
        super({ key: 'MainScene' });
    }

    init(data: { socketService: SocketService }) {
        this.socketService = data.socketService;
    }

    create() {
        this.add.image(400, 300, 'forest-bg').setDisplaySize(800, 600);

        // Setup input
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }

        // Listen for state updates
        this.socketService.state$.subscribe((state: any) => {
            this.updatePlayers(state.players);
        });

        // Listen for chat messages to spawn bubbles
        this.socketService.messages$.subscribe(msg => {
            if (this.players.has(msg.id)) {
                this.showSpeechBubble(msg.id, msg.message);
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

    override update() {
        if (!this.cursors || !this.myPlayer) return;

        const player = this.myPlayer.sprite;
        const prevX = player.x;
        const prevY = player.y;

        // reset velocity logic if using physics, or just update position for MVP
        let x = player.x;
        let y = player.y;

        // Simple movement
        const speed = 4;
        if (this.cursors.left.isDown) x -= speed;
        else if (this.cursors.right.isDown) x += speed;

        if (this.cursors.up.isDown) y -= speed;
        else if (this.cursors.down.isDown) y += speed;

        // Update local visual immediately (prediction)
        player.setPosition(x, y);
        this.myPlayer.nametag.setPosition(x, y - 40); // Nametag follows
        this.myPlayer.bubble?.setPosition(x, y - 50); // Bubble follows

        // Send update if changed
        if (x !== prevX || y !== prevY) {
            this.socketService.emit('move', { x, y });
        }
    }

    private updatePlayers(serverPlayers: any) {
        Object.keys(serverPlayers).forEach(id => {
            const p = serverPlayers[id];
            if (!this.players.has(id)) {
                // Create sprite
                const sprite = this.add.sprite(p.x, p.y, 'wolf').setDisplaySize(50, 50);

                // Create Nametag
                const nametag = this.add.text(p.x, p.y - 40, p.username || 'Wolf', {
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
