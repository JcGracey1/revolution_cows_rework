// Enemy.js
export default class Enemy {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, texture);
        this.sprite.active = true;
        this.sprite.setData('instance', this);
        
        this.sprite.offset = Phaser.Math.Between(1, 1000); // Random offset for unique paths
        this.sprite.pathSpeed = 0.0025 + this.scene.difficulty * 0.0005; // Adjust speed
        this.sprite.scorePoints = 25; // Example points, customize as needed

        this.sprite.on('destroy', this.onDestroy.bind(this));
    }

    
    enemyFire() {
        // Existing enemy fire logic or adapt as needed
    }

    move() {
        // Implement unique movement logic here
        const timeNow = this.scene.time.now;
        this.sprite.x += Math.sin((timeNow + this.sprite.offset) * this.sprite.pathSpeed) * 2;
        this.sprite.y += Math.cos((timeNow + this.sprite.offset) * this.sprite.pathSpeed) * 0.5;
    }

    onDestroy() {
        this.scene.createExplosion(this.sprite.x, this.sprite.y);
        this.scene.updateScore(this.sprite.scorePoints); // Or other scoring logic
    }
}