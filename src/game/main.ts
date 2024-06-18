// import { Boot } from "./scenes/Boot";
// import { GameOver } from "./scenes/GameOver";
// import { Game as MainGame } from "./scenes/Game";
// import { MainMenu } from "./scenes/MainMenu";
import { Menu } from "./scenes/Menu";
import { Game } from "phaser";
import PlayScene from "./scenes/PlayScene";
import PreloadScene from "./scenes/PreloadScene";
// import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const scrennWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width:
        scrennWidth > 1000
            ? 1000
            : scrennWidth > 800
            ? 800
            : scrennWidth > 600
            ? 600
            : 400,
    height: 340,
    pixelArt: true,
    transparent: true,
    parent: "game-container",
    // backgroundColor: "#028af8",
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    scene: [
        PreloadScene,
        Menu,
        PlayScene,
        // Boot,
        // Preloader,
        // MainMenu,
        // MainGame,
        // GameOver
    ],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
