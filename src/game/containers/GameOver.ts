import Phaser from "phaser";
import { GAME_EVENTS, DEPTH_MAP } from "../constants";
import { EventBus } from "../EventBus";

export class GameOverContainer extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x, y, children) {
        super(scene, x, y, children);
        this.gameOverText = scene.add.image(0, 0, "game-over");
        this.restart = scene.add.image(0, 80, "restart").setInteractive();
        this.add([this.gameOverText, this.restart]);
        this.setVisible(false);
        this.setDepth(DEPTH_MAP.MODAL);

        this.restart.on("pointerdown", this.emitRestart);

        scene.add.existing(this);

        this.scene = scene;
    }

    emitRestart = () => {
        // EventBus.emit(GAME_EVENTS.RESTART);
        EventBus.emit(GAME_EVENTS.OPEN_MAIN);
    };
}

