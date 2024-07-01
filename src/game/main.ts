import { Menu } from "./scenes/Menu";
import { Game } from "phaser";
import PlayScene from "./scenes/PlayScene";
import PreloadScene from "./scenes/PreloadScene";

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
    // height: 440,
    pixelArt: true,
    transparent: true,
    parent: "game-container",
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        },
    },
    // scene: [PreloadScene, Menu, PlayScene],
    scene: [PreloadScene, PlayScene],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;

