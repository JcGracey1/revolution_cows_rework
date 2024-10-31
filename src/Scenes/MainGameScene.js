import Player from './Player.js';
import Enemy from './Enemy.js';
import HUD from './HUD.js';

export default class MainGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'mainGameScene' });
        this.difficulty = 1;
        this.activeEnemies = 0;
    }

    preload() {
        // Preload all necessary assets
        this.load.setPath("./assets/");
        this.load.image("background", "background.png");
        this.load.image("cowMain", "cow.png");
        this.load.image("bullet", "grass_shoot.png");
        this.load.image("enemy1", "shipGreen_manned.png");
        this.load.image("blueShip", "shipBlue_manned.png");
        //explosion:
        this.load.image("explosion", "laserYellow_burst.png");
        //enemy bullet:
        this.load.image("enemyFire", "laserYellow3.png");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        this.initializePlayer();
        this.initializeHUD();
        this.initializeGroups();
        this.addBackground();
        this.setTimers();
        this.spawnNextWave();
    }

    initializePlayer() {
        this.player = new Player(this, 400, 515, "cowMain");
    }

    initializeHUD() {
        this.hud = new HUD(this);
    }

    initializeGroups() {
        this.enemies = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        this.playerBullets = this.physics.add.group({
            defaultKey: 'bullet'
        });
    }

    addBackground() {
        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;
    }

    setTimers() {
        this.time.addEvent({
            delay: 1200,
            callback: this.enemyFire,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        this.player.update();
        this.enemies.children.iterate((sprite) => {
            const enemy = sprite.getData('instance');
            if (enemy) {
                enemy.move();
            }
        });
        this.checkCollisions();
    }

    updateScore(points) {
        this.myScore = (this.myScore || 0) + points; // Initialize score if undefined, then add points
        this.hud.updateScore(this.myScore); // Assuming your HUD has a function to update the displayed score
    }

    checkCollisions() {
        this.physics.world.overlap(this.playerBullets, this.enemies, (bullet, sprite) => {
            const enemy = sprite.getData('instance');
            if (enemy) {
                enemy.onDestroy();
                sprite.destroy();
                //bullet.setActive(false).setVisible(false);
                bullet.destroy();
            }
        });
    }

    createExplosion(x, y) {
        let explosion = this.add.sprite(x, y, "explosion").setScale(0.1).setAlpha(1);
        this.tweens.add({
            targets: explosion,
            scale: { from: 0.1, to: 1 },
            alpha: { from: 1, to: 0 },
            angle: 360,
            duration: 500,
            ease: "Cubic.easeOut",
            onComplete: () => {
                explosion.destroy();
            }
        });
    }

    spawnNextWave() {
        const numberOfEnemies = Phaser.Math.Between(3, 5) * this.difficulty;
        for (let i = 0; i < numberOfEnemies; i++) {
            const x = Phaser.Math.Between(0, this.sys.game.config.width);
            const y = Phaser.Math.Between(50, 150);
            this.spawnEnemy(x, y);
        }
        this.difficulty += 0.1;
    }

    spawnEnemy(x, y) {
        const enemy = new Enemy(this, x, y, 'enemy1');
        this.enemies.add(enemy.sprite);
        this.activeEnemies++;
    }

    onBulletHitPlayer(bullet, player) {
        bullet.destroy();
        this.hud.updateHealth(--this.player.health);
        if (this.player.health <= 0) {
            this.scene.start('gameOverScene');
        }
    }
}