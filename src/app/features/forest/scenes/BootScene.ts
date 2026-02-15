import { Scene } from 'phaser';

export class BootScene extends Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load placeholder assets
        // Load local assets
        this.load.image('forest-bg', 'assets/forest-bg.png');
        this.load.image('wolf', 'assets/masks/wolf.png');
    }

    create() {
        const socketService = this.game.registry.get('socketService');
        this.scene.start('MainScene', { socketService });
    }
}
