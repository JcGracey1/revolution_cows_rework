class HUD {
    constructor(scene) {
        this.scene = scene;
        this.scoreText = this.scene.add.bitmapText(580, 570, "rocketSquare", "Score 0");
        this.healthText = this.scene.add.bitmapText(10, 570, "rocketSquare", "Health 3");

        // Assume starting values, update based on actual game state
        this.score = 0;
        this.health = 3;
    }

    updateScore(newScore) {
        this.score = newScore;
        this.scoreText.setText("Score " + this.score);
    }

    updateHealth(newHealth) {
        this.health = newHealth;
        this.healthText.setText("Health " + this.health);
    }
    
    // You might want to update the HUD position every frame if elements are dynamic
    update() {
        // Position or visibility logic if required
    }
}

export default HUD;