import Player from './Player.js';
import Enemy from './Enemy.js';
import HUD from './HUD.js';

export default class MainGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'mainGameScene' });
        this.myScore = 0;
        this.difficulty = 1;
        this.activeEnemies = 0;
    }

    resetGame() {
        this.scene.restart(); // Restart the scene
        this.myScore = 0;
        this.difficulty = 1;
        this.activeEnemies = 0;
        
        this.player.health = 3; 
        this.hud.updateScore(this.myScore);
        this.hud.updateHealth(this.player.health);
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
        this.enemyBullets = this.physics.add.group({
            defaultKey: 'enemyFire'
        });
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
        this.hud.updateScore(this.myScore);
    }

    checkCollisions() {
        // Collision between player bullets and enemies
        this.physics.world.overlap(this.playerBullets, this.enemies, (bullet, enemySprite) => {
            const enemy = enemySprite.getData('instance');
            if (enemy) {
                this.activeEnemies--;
                enemy.onDestroy();
                enemySprite.destroy();
                this.updateScore(enemy.sprite.scorePoints);
                bullet.destroy();
                
                // Check if we've destroyed all enemies in the wave
                if (this.activeEnemies === 0) {
                    this.time.delayedCall(1000, () => this.spawnNextWave(), [], this);
                }
            }
        });
    
        // Collision between enemy bullets and player
        this.physics.world.overlap(this.player.sprite, this.enemyBullets, (playerSprite, enemyBullet) => {
            this.player.onBulletHit(enemyBullet, playerSprite);
        });
    }


    // Increases the difficulty each wave
    spawnNextWave() {
        const numberOfEnemies = Phaser.Math.Between(3, 5) * this.difficulty;
        const x = Phaser.Math.Between(0, this.sys.game.config.width);
        const y = Phaser.Math.Between(50, 150);
        const sharedOffset = Phaser.Math.Between(1, 1000);
        for (let i = 0; i < numberOfEnemies; i++) {
            this.time.addEvent({
                delay: 1000 * i, 
                callback: () => {
                    this.spawnEnemy(x, y, sharedOffset + i*1000);
                }});
        }
        this.difficulty += 0.1;
    }

    spawnEnemy(x, y, offset) {
        const enemy = new Enemy(this, x, y, 'enemy1', offset); 
        console.log(`Spawning wave at x: ${x}, y: ${y}`);

        this.enemies.add(enemy.sprite);
        this.activeEnemies++;
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

}