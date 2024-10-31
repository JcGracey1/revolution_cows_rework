export default class GameWon extends Phaser.Scene {
    constructor() {
        super({ key: 'gameWonScene' });
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("gamewonBG", "cowsChillin.png");
    }

    create() {
        const bg = this.add.image(0, 0, 'gamewonBG').setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;

        const youWon = this.add.text(400, 300, 'YOU WON', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        
        const finalScore = this.scene.get("mainGameScene")?.myScore || 0; // Gracefully handle null
        this.add.text(400, 200, 'Score: ' + finalScore, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        this.add.text(400, 450, 'You have successfully warded off the alien enemies.\nYou and your cow comrades will live to chew another day!', 
            { fontSize: '22px', fill: '#fff' }).setOrigin(0.5);

        const playAgain = this.add.text(400, 500, 'Play Again', { fontSize: '32px', fill: '#0f0' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        playAgain.on('pointerdown', () => {
            this.scene.stop();
            this.scene.get("mainGameScene").resetGame();
        });

        this.tweens.add({
            targets: [playAgain, youWon],
            scaleX: 1.2,
            scaleY: 1.2,
            ease: 'Sine.easeInOut',
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }
}