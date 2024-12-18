// Enemy.js
export default class Enemy {
    constructor(scene, x, y, texture, offset) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, texture);
        this.sprite.active = true;
        this.sprite.setData('instance', this);

        this.sprite.offset = offset || 0;
        this.sprite.pathSpeed = 0.001 + this.scene.difficulty * 0.0003;
        this.sprite.scorePoints = 25; 
        
        this.sprite.on('destroy', this.onDestroy.bind(this));

        // Initialize fire timer
        this.initializeFireTimer();
    }

    initializeFireTimer() {
        this.fireTimer = this.scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 3500), 
            callback: this.enemyFire, 
            callbackScope: this, 
            loop: true
        });
    }

    enemyFire() {
        if (!this.sprite.active) {
            return; 
        }

        const bullet = this.scene.enemyBullets.get(this.sprite.x, this.sprite.y);
        if (bullet) {
            bullet.setActive(true).setVisible(true); 
            bullet.setVelocityY(200);  
        }
    }

    move() {
        const timeNow = this.scene.time.now;
    
        const playAreaWidth = this.scene.sys.game.config.width; // Game's width
        const maxMovementRange = playAreaWidth / 2 - this.sprite.displayWidth / 2; // Limit to half the width minus sprite size
    
        // Update movement with constrained range
        const xOffset = Math.sin((timeNow + this.sprite.offset) * this.sprite.pathSpeed) * maxMovementRange;
        const yOffset = Math.cos((timeNow + this.sprite.offset) * this.sprite.pathSpeed) * 0.5;
    
        this.sprite.x = this.scene.sys.game.config.width / 2 + xOffset;
        this.sprite.y += yOffset;
    }
    

    onDestroy() {
        this.scene.createExplosion(this.sprite.x, this.sprite.y);
        this.scene.updateScore(this.sprite.scorePoints); 
        this.fireTimer.remove();
    }

}