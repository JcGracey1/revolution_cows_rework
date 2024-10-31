// Correct export statement in GameOver.js
export default class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'gameOverScene' });
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("gameoverBG", "gameover.png");
    }

    create() {
        const bg = this.add.image(0, 0, 'gameoverBG').setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;

        this.add.text(400, 300, 'GAME OVER', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        // Handle Score Display and Restart Logic
        const finalScore = this.scene.get("mainGameScene")?.myScore || 0;
        this.add.text(400, 200, 'Score: ' + finalScore, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        const playAgain = this.add.text(400, 400, 'Play Again', { fontSize: '32px', fill: '#0f0' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        playAgain.on('pointerdown', () => {
            this.scene.stop();
            this.scene.get("mainGameScene").resetGame();
        });

        this.tweens.add({
            targets: [playAgain],
            scaleX: 1.2,
            scaleY: 1.2,
            ease: 'Sine.easeInOut',
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }
}