import Phaser from "phaser";

/** Контейнер с кнопками игрового меню */
export default class GameMenuContainer extends Phaser.GameObjects.Container {
    constructor(
        scene: Phaser.Scene,
        x: number | undefined,
        y: number | undefined,
        children: Phaser.GameObjects.GameObject[] | undefined
    ) {
        super(scene, x, y, children);

        this.buttonBoosts = this.add.image(0, 0, "boosts").setInteractive();
        this.buttonProfile = this.add.image(0, 0, "profile").setInteractive();
        this.buttonQuests = this.add.image(0, 0, "quests").setInteractive();

        this.buttonsTotalWidth =
            (this.buttonWidth + this.buttonSpacing) * 3 - this.buttonSpacing;
        this.startX = (width - this.buttonsTotalWidth) / 2;

        this.buttonBoosts.setPosition(
            this.startX + this.buttonWidth / 2 - 200,
            height - 310
        );
        this.buttonQuests.setPosition(
            this.startX +
                this.buttonWidth / 2 +
                this.buttonWidth +
                this.buttonSpacing -
                200,
            height - 310
        );
        this.buttonProfile.setPosition(
            this.startX +
                this.buttonWidth / 2 +
                (this.buttonWidth + this.buttonSpacing) * 2 -
                200,
            height - 310
        );

        this.buttonBoosts.on("pointerover", () =>
            this.buttonBoosts.setTint(0x44ff44)
        );
        this.buttonBoosts.on("pointerout", () => this.buttonBoosts.clearTint());
        this.buttonQuests.on("pointerover", () =>
            this.buttonQuests.setTint(0x44ff44)
        );
        this.buttonQuests.on("pointerout", () => this.buttonQuests.clearTint());
        this.buttonProfile.on("pointerover", () =>
            this.buttonProfile.setTint(0x44ff44)
        );
        this.buttonProfile.on("pointerout", () =>
            this.buttonProfile.clearTint()
        );

        this.buttonBoosts.on("pointerdown", this.handleBoosts, this);
        this.buttonQuests.on("pointerdown", this.handleQuests, this);
        this.buttonProfile.on("pointerdown", this.handleProfile, this);

        scene.add.existing(this);
        this.scene = scene;
    }

    handleBoosts() {
        console.log("Boosts button clicked - Coming soon!");
    }

    handleQuests() {
        console.log("Quests button clicked");
    }

    handleProfile() {
        console.log("Profile button clicked");
    }
}
