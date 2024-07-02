import Phaser from "phaser";

import { GameOverContainer } from "../containers/GameOver";
import { GAME_EVENTS } from "../constants";
import { EventBus } from "../EventBus";

class PlayScene extends Phaser.Scene {
    gameOverContainer;
    eventEmitter;
    dino!: Phaser.Physics.Arcade.Sprite;
    isDinoBendDown: boolean = false;
    isGameOver: boolean = false;
    isGameRunning: boolean = false;

    constructor() {
        super("PlayScene");
    }

    create() {
        this.isGameRunning = false;
        this.isGameOver = false;
        // this.gameSpeed = 10;
        this.gameSpeed = 2;
        this.respawnTime = 0;
        this.score = 0;
        this.totalCoins = 0;
        this.buttonWidth = 50;
        this.buttonHeight = 50;
        this.buttonSpacing = 20;

        this.coinText = this.add
            .text(30, 30, "coins: 0", {
                fill: "#535353",
                font: "900 35px Courier",
                resolution: 5,
            })
            .setScrollFactor(0, 0)
            .setOrigin(0, 0);

        // const { height, width } = this.game.config;
        const { width, height } = this.scale;

        this.startTrigger = this.physics.add
            .sprite(0, 60)
            .setOrigin(0, 1)
            .setImmovable();
        this.ground = this.add
            .tileSprite(0, height, 88, 26, "ground")
            .setOrigin(0, 1);
        this.dino = this.physics.add
            .sprite(0, height, "dino-idle")
            .setDepth(10)
            .setCollideWorldBounds(true)
            .setGravityY(5000)
            .setScale(0.5);

        console.log(this.dino);

        this.scoreText = this.add
            .text(width, 0, "00000", {
                fill: "#535353",
                font: "900 35px Courier",
                resolution: 5,
            })
            .setOrigin(1, 0)
            .setAlpha(0);

        this.highScoreText = this.add
            .text(width, 0, "00000", {
                fill: "#535353",
                font: "900 35px Courier",
                resolution: 5,
            })
            .setOrigin(1, 0)
            .setAlpha(0);

        // this.gameOverScreen = this.add
        //   .container(width / 2, height / 2 - 50)
        //   .setAlpha(0);
        this.gameOverContainer = new GameOverContainer(
            this,
            width / 2,
            height / 2
        );
        // this.gameOverText = this.add.image(0, 0, "game-over");
        // this.restart = this.add.image(0, 80, "restart").setInteractive();

        this.environment = this.add.group();
        this.environment.addMultiple([
            this.add.image(width / 2, 170, "cloud"),
            this.add.image(width - 88, 80, "cloud"),
            this.add.image(width / 1.3, 100, "cloud"),
        ]);

        this.environment.setAlpha(0);

        // this.gameOverScreen.add([this.gameOverText, this.restart]);

        this.obsticles = this.physics.add.group();

        // Initialize methods
        this.initAnim();
        this.initColliders();
        this.handleInputs();
        this.initStartTrigger();
        this.handleScore();

        this.input.on("pointerdown", this.dinoStart);

        // Buttons
        // TODO: вынести кнопки в контейнер и сделать по аналогии с gameOverContainer
        // this.buttonBoosts = this.add.image(0, 0, "boosts").setInteractive();
        // this.buttonProfile = this.add.image(0, 0, "profile").setInteractive();
        // this.buttonQuests = this.add.image(0, 0, "quests").setInteractive();

        // this.buttonBoosts.setDisplaySize(this.buttonWidth, this.buttonHeight);
        // this.buttonQuests.setDisplaySize(this.buttonWidth, this.buttonHeight);
        // this.buttonProfile.setDisplaySize(this.buttonWidth, this.buttonHeight);

        // this.buttonsTotalWidth =
        //   (this.buttonWidth + this.buttonSpacing) * 3 - this.buttonSpacing;
        // this.startX = (width - this.buttonsTotalWidth) / 2;

        // this.buttonBoosts.setPosition(
        //   this.startX + this.buttonWidth / 2 - 200,
        //   height - 310
        // );
        // this.buttonQuests.setPosition(
        //   this.startX +
        //     this.buttonWidth / 2 +
        //     this.buttonWidth +
        //     this.buttonSpacing -
        //     200,
        //   height - 310
        // );
        // this.buttonProfile.setPosition(
        //   this.startX +
        //     this.buttonWidth / 2 +
        //     (this.buttonWidth + this.buttonSpacing) * 2 -
        //     200,
        //   height - 310
        // );

        // Добавление эффекта наведения и нажатия
        // this.buttonBoosts.on("pointerover", () =>
        //   this.buttonBoosts.setTint(0x44ff44)
        // );
        // this.buttonBoosts.on("pointerout", () => this.buttonBoosts.clearTint());
        // this.buttonQuests.on("pointerover", () =>
        //   this.buttonQuests.setTint(0x44ff44)
        // );
        // this.buttonQuests.on("pointerout", () => this.buttonQuests.clearTint());
        // this.buttonProfile.on("pointerover", () =>
        //   this.buttonProfile.setTint(0x44ff44)
        // );
        // this.buttonProfile.on("pointerout", () => this.buttonProfile.clearTint());

        // this.buttonBoosts.on("pointerdown", this.handleBoosts, this);
        // this.buttonQuests.on("pointerdown", this.handleQuests, this);
        // this.buttonProfile.on("pointerdown", this.handleProfile, this);

        // Coins
        this.coinGroup = this.add.group({
            defaultKey: "coin",
            maxSize: 100,
            createCallback: (coin) => {
                coin.setName(`coin${this.coinGroup.getLength()}`);
                coin.setScale(0.2);
                this.physics.add.existing(coin);
            },
            removeCallback: function (coin) {
                console.log("Removed", coin.name);
            },
        });

        this.physics.add.collider(this.coinGroup, this.dino, this.destroyCoin);

        this.time.addEvent({
            delay: 3000,
            loop: true,
            callback: () => this.addCoin(),
        });

        this.initEmitter();

        EventBus.emit(GAME_EVENTS.CURRENT_SCENE_READY, this);
    }

    destroyCoin = (coin) => {
        coin.destroy(true);
        this.totalCoins += 1;
    };

    addCoin() {
        if (this.coinGroup.children.size < 100 && this.isGameRunning) {
            const { height, width } = this.game.config;
            const x = Phaser.Math.Between(width, width);
            const y = Phaser.Math.Between(100, 32);

            const coin = this.coinGroup.get(x, y);

            if (!coin) {
                return;
            }

            coin.play("coin");
            this.activateCoin(coin);
        }
    }

    gameOver() {
        this.isGameOver = true;

        this.highScoreText.x = this.scoreText.x - this.scoreText.width - 20;

        const highScore = this.highScoreText.text.substring(
            this.highScoreText.text.length - 5
        );
        const newScore =
            Number(this.scoreText.text) > Number(highScore)
                ? this.scoreText.text
                : highScore;

        this.highScoreText.setText(`High Score: ${newScore}`);
        this.highScoreText.setAlpha(1);
        this.dino.setTexture("dino-hurt");

        this.physics.pause();

        this.isGameRunning = false;
        this.anims.pauseAll();
        this.respawnTime = 0;
        this.gameSpeed = 2;
        // this.gameOverContainer.setVisible(true);
        // this.buttonBoosts.setAlpha(1);
        // this.buttonQuests.setAlpha(1);
        // this.buttonProfile.setAlpha(1);
        this.score = 0;

        EventBus.emit(GAME_EVENTS.GAME_OVER);
    }

    activateCoin(coin) {
        coin.setActive(true).setVisible(true);
    }

    // handleBoosts() {
    //   console.log("Boosts button clicked - Coming soon!");
    // }

    // handleQuests() {
    //   console.log("Quests button clicked");
    // }

    // handleProfile() {
    //   console.log("Profile button clicked");
    // }

    initColliders() {
        this.physics.add.collider(
            this.dino,
            this.obsticles,
            this.gameOver,
            null,
            this
        );
    }

    onOverLap = () => {
        const { width, height } = this.game.config;

        if (this.startTrigger.y === 60) {
            this.startTrigger.body.reset(0, height);
            return;
        }

        this.startTrigger.disableBody(true, true);

        const startEvent = this.time.addEvent({
            delay: 1000 / 60,
            loop: true,
            callbackScope: this,
            callback: () => {
                this.dino.setVelocityX(80);
                this.dino.anims.play("dino-run", 1);

                if (this.ground.width < width) {
                    this.ground.width += 17 * 2;
                }

                if (this.ground.width >= width) {
                    this.ground.width = width;

                    this.isGameRunning = true;

                    // this.dinoStart();

                    this.dino.setVelocity(0);
                    this.scoreText.setAlpha(1);
                    this.environment.setAlpha(1);
                    // this.buttonBoosts.setAlpha(0);
                    // this.buttonQuests.setAlpha(0);
                    // this.buttonProfile.setAlpha(0);
                    startEvent.remove();
                }
            },
        });
    };

    initStartTrigger() {
        this.physics.add.overlap(
            this.startTrigger,
            this.dino,
            this.onOverLap,
            null,
            this
        );
    }

    initAnim() {
        if (this.anims.exists("dino-run")) {
            this.anims.remove("dino-run");
            this.anims.remove("dino-down-anim");
            this.anims.remove("enemy-dino-fly");
            this.anims.remove("coin");
        }

        this.anims.create({
            key: "dino-run",
            frames: this.anims.generateFrameNumbers("dino", {
                start: 2,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "dino-down-anim",
            frames: this.anims.generateFrameNumbers("dino-down", {
                start: 0,
                end: 1,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "enemy-dino-fly",
            frames: this.anims.generateFrameNumbers("enemy-bird", {
                start: 0,
                end: 1,
            }),
            frameRate: 6,
            repeat: -1,
        });

        this.anims.create({
            key: "coin",
            frames: this.anims.generateFrameNames("coin", {
                start: 1,
                end: 3,
                suffix: ".png",
            }),
            repeat: -1,
            frameRate: 12,
        });
    }

    handleScore() {
        this.time.addEvent({
            delay: 1000 / 60,
            loop: true,
            callbackScope: this,
            callback: () => {
                if (!this.isGameRunning) {
                    return;
                }

                this.score++;
                this.gameSpeed += 0.005;

                const score = this.score.toString();
                this.scoreText.setText(score.padStart(5, "0"));
            },
        });
    }

    restart = () => {
        /** NEW LOGIC */
        /** OLD LOGIC */
        this.dino.setVelocityY(0);
        // this.dino.body.height = 92;
        // this.dino.body.offset.y = 0;
        this.physics.resume();
        this.obsticles.clear(true, true);
        this.coinGroup.clear(true, true);
        this.isGameRunning = true;
        this.gameOverContainer.setVisible(false);
        // this.buttonBoosts.setAlpha(0);
        // this.buttonQuests.setAlpha(0);
        // this.buttonProfile.setAlpha(0);
        this.anims.resumeAll();
    };

    pauseScene = () => {
        if (!this.scene.isPaused()) {
            this.scene.pause();
        }
    };

    resumeScene = () => {
        this.scene.resume();
    };

    onOpenMenu = () => {
        this.removeEvents();

        this.scene.restart({});
    };

    onRestart = () => {
        this.onOpenMenu();
    };

    initEmitter = () => {
        // EventBus.on(GAME_EVENTS.RESTART, this.onRestart);

        EventBus.on(GAME_EVENTS.PAUSE, this.pauseScene);

        EventBus.on(GAME_EVENTS.RESUME, this.resumeScene);

        EventBus.on(GAME_EVENTS.OPEN_MAIN, this.onOpenMenu);

        EventBus.on(GAME_EVENTS.DINO_JUMP, this.dinoJump);

        EventBus.on(GAME_EVENTS.DINO_BEND_DOWN, this.dinoBendDown);

        // EventBus.on(GAME_EVENTS.GAME_OVER, this.gameOver);
    };

    removeEvents = () => {
        EventBus.removeListener(GAME_EVENTS.RESTART, this.restart);

        EventBus.removeListener(GAME_EVENTS.PAUSE, this.pauseScene);

        EventBus.removeListener(GAME_EVENTS.RESUME, this.resumeScene);

        EventBus.removeListener(GAME_EVENTS.OPEN_MENU, this.onOpenMenu);

        EventBus.removeListener(GAME_EVENTS.OPEN_MAIN, this.onOpenMenu);

        EventBus.removeListener(GAME_EVENTS.DINO_JUMP, this.dinoJump);

        EventBus.removeListener(GAME_EVENTS.DINO_BEND_DOWN, this.dinoBendDown);

        // this.input.keyboard.off("keydown-SPACE", this.dinoJump);
        // this.input.keyboard.off("keydown-SPACE", this.dinoStart);
    };

    dinoJump = () => {
        if (!this.dino.body.onFloor()) {
            return;
        }

        // this.dino.body.height = 92;
        // this.dino.body.offset.y = 0;
        this.dino.setVelocityY(-1600);
    };

    dinoBendDown = () => {
        const startHeight = this.dino.body!.height;
        const startOffsetY = this.dino.body!.offset.y;

        this.dino.setSize(135, 44);
        this.dino.setOffset(0.5, 50);

        this.isDinoBendDown = true;

        // this.dino.setOffset(this.dino.body?.offset.x, 10);

        // this.dino.body!.height = 32;
        // this.dino.body!.offset.y = 0;
        // this.dino.anims.play("dino-down-anim");
        // this.dino.

        this.time.delayedCall(1000, () => {
            // this.dino.body!.height = startHeight;
            // this.dino.body!.offset.y = startOffsetY;
            // this.dino.setSize(88, 92);
            this.dino.setSize(100, 100, true);

            // this.dino.setPosition(this.dino.x, this.dino.y - 10);
            // this.dino.setOffset(this.dino.body?.offset.x, startOffsetY);

            this.isDinoBendDown = false;
        });
    };

    dinoStart = () => {
        console.log("dinoStart");

        if (this.scene.isPaused()) {
            this.scene.resume();
        }
        EventBus.emit(GAME_EVENTS.START_GAME);
    };

    handleInputs = () => {
        // this.input.keyboard?.once("keydown-SPACE", this.dinoStart);
        // this.input.keyboard.on("keydown-SPACE", this.dinoJump);
        // this.input.keyboard.on("keydown-DOWN", () => {
        //     if (!this.dino.body.onFloor() || !this.isGameRunning) {
        //         return;
        //     }
        //     // this.dino.body.height = 58;
        //     // this.dino.body.offset.y = 34;
        // });
        // this.input.keyboard.on("keyup-DOWN", () => {
        //     if (!this.dino.body.onFloor()) {
        //         return;
        //     }
        //     // this.dino.body.height = 92;
        //     // this.dino.body.offset.y = 0;
        // });
    };

    placeObsticle() {
        const { width, height } = this.game.config;

        const obsticleNum = Math.floor(Math.random() * 7) + 1;
        const distance = Phaser.Math.Between(600, 900);

        let obsticle;

        if (obsticleNum > 1) {
            const enemyHeight = [15, 20];
            obsticle = this.obsticles.create(
                width + distance,
                height - enemyHeight[Math.floor(Math.random() * 2)],
                "enemy-bird"
            );
            obsticle.play("enemy-dino-fly", true);
            obsticle.body.height /= 1.5;
        } else {
            obsticle = this.obsticles.create(
                width + distance,
                height,
                `obsticle-${obsticleNum}`
            );
            obsticle.body.offset.y = +10;
        }

        obsticle.setOrigin(0, 1);
        obsticle.setImmovable();
    }

    update(time, delta) {
        // if (Math.random() > 0.95) {
        //     console.log("update: ", this.isGameRunning);
        // }
        if (this.isGameOver) {
            this.dino.setTexture("dino-hurt");
            this.dino.anims.pause();
        }

        if (!this.isGameRunning) return;

        // this.scale.resize(window.innerWidth, window.innerHeight);

        this.ground.tilePositionX += this.gameSpeed;

        Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);
        Phaser.Actions.IncX(this.environment.getChildren(), -0.5);

        this.respawnTime += delta * this.gameSpeed * 0.08;

        if (this.respawnTime >= 1500) {
            this.placeObsticle();
            this.respawnTime = 0;
        }

        this.obsticles.getChildren().forEach((obsticle) => {
            if (obsticle.getBounds().right < 0) {
                obsticle.destroy();
            }
        });

        this.coinGroup.getChildren().forEach((coin) => {
            if (coin.getBounds().right < 0) {
                coin.destroy();
            }
        });

        this.environment.getChildren().forEach((env) => {
            if (env.getBounds().right < 0) {
                env.x = this.game.config.width + 30;
            }
        });

        if (this.dino.body.velocity.y !== 0) {
            this.dino.anims.play("dino-run", true);
            this.dino.anims.pause();
            // this.dino.setTexture("dino");
        } else {
            if (this.isDinoBendDown) {
                this.dino.anims.play("dino-down-anim", true);
            } else if (this.isGameRunning && !this.isGameOver) {
                this.dino.anims.play("dino-run", true);
            } else if (this.isGameOver) {
                this.dino.anims.pause();

                this.dino.setTexture("dino-hurt");
            }
            // this.dino.anims.play("dino-run", true);
            // this.dino.body.height < 45
            //     ? this.dino.anims.play("dino-down-anim", true)
            //     : this.dino.anims.play("dino-run", true);
        }

        this.coinText.setText(`coins: ${this.totalCoins}`);

        this.coinGroup.children.iterate((coin) => {
            coin.x -= 1;
            if (coin.y > 600) {
                this.coinGroup.killAndHide(coin);
            }
        });
    }
}

export default PlayScene;

