class HUD {
    constructor(scene) {
        this.scene = scene;
        this.scoreText = this.scene.add.bitmapText(580, 570, "rocketSquare", "Score 0");
        this.scoreText.setDepth(10); // Ensure score is above other elements
        this.healthText = this.scene.add.bitmapText(10, 570, "rocketSquare", "Health 3");
        this.healthText.setDepth(10);

        // Assume starting values, update based on actual game state
        this.score = 0;
        this.health = 3;
    }

    updateScore(newScore) {
        this.score = newScore;
        this.scoreText.setText("Score " + this.score);

        const textWidth = this.scoreText.width; 
        const maxScreenWidth = this.scene.sys.game.config.width; 
    
        // Move the text left if it exceeds the right edge
        if (this.scoreText.x + textWidth > maxScreenWidth - 10) { 
            this.scoreText.x = maxScreenWidth - textWidth - 10;
        }
    }

    updateHealth(newHealth) {
        this.health = newHealth;
        this.healthText.setText("Health " + this.health);
    }
    
}

export default HUD;