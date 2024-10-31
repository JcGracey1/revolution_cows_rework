class Player {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        // Use physics.add.sprite to include physics behaviors from the start
        this.sprite = this.scene.physics.add.sprite(x, y, texture).setScale(0.7).setDepth(1);
        this.sprite.setCollideWorldBounds(true); // Ensures player doesn't go off-screen

        this.health = 3;
        this.lastFired = 0; // Time when the last bullet was fired
        this.fireRate = 500; // Fire rate in milliseconds (1/2 second)

        this.keyboard = this.scene.input.keyboard.createCursorKeys(); // Default cursor keys
        this.createControls();
    }

    createControls() {
        this.scene.aKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.scene.dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.scene.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (this.scene.aKey.isDown) {
            this.sprite.x -= 5;
            if (this.sprite.x <= 40) this.sprite.x = 40;
        }
        if (this.scene.dKey.isDown) {
            this.sprite.x += 5;
            if (this.sprite.x >= 760) this.sprite.x = 760;
        }
        if (this.scene.spaceKey.isDown) {
            this.shoot();
        }
    }

    shoot() {
        const bulletSpeed = -300;
        const now = this.scene.time.now;
    
        // Check time passed since last bullet fired
        if (now - this.lastFired < this.fireRate) {
            return; // Exit if still within the cooldown period
        }
    
        // Obtain a bullet from the group pool
        const bullet = this.scene.playerBullets.get(this.sprite.x, this.sprite.y);
    
        // Ensure the bullet exists and is inactive (i.e., available for use)
        if (bullet) {
            bullet.setActive(true).setVisible(true);
            bullet.setVelocityY(bulletSpeed);
    
            // Ensure the bullet gets destroyed when it moves out of the world bounds
            bullet.body.onWorldBounds = true;
            bullet.body.world.on('worldbounds', (body) => {
                if (body.gameObject === bullet) {
                    bullet.setActive(false);
                    bullet.setVisible(false);
                    bullet.body.stop();
                }
            });
        }
    
        // Update lastFired time to current time
        this.lastFired = now;
    }

    onBulletHitPlayer(bullet) {
        bullet.destroy();
        this.health -= 1;

        // possible refactor here depending on how the scene interface is created
        if (this.health <= 0) {
            this.scene.scene.start('gameOverScene');
        } else {
            this.startInvulnerability();
        }
    }

    startInvulnerability() {
        this.sprite.invulnerable = true;
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: { from: 0.5, to: 1 },
            duration: 100,
            repeat: 5,
            yoyo: true,
            onComplete: () => {
                this.sprite.invulnerable = false;
                this.sprite.alpha = 1;
            }
        });
    }

    getPosition() {
        return {x: this.sprite.x, y: this.sprite.y};
    }
}

export default Player;