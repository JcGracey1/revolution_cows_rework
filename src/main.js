// Import the scene classes
import StartScreen from './Scenes/StartScreen.js';
import MainGameScene from './Scenes/MainGameScene.js';
import GameOver from './Scenes/GameOver.js';
import GameWon from './Scenes/GameWon.js';

// Define the Phaser game configuration
const config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS, // Use Canvas rendering
    render: {
        pixelArt: false, // Set to true for sharper pixel graphics
        antialias: true
    },
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // No gravity in any direction
            debug: true // Change to true for debugging physics
        }
    },
    scene: [StartScreen, MainGameScene, GameOver, GameWon], // Includes all scenes
    fps: { forceSetTimeOut: true, target: 60 } // Target 60 FPS
};

// Create a new Phaser game instance using the configuration
const game = new Phaser.Game(config);