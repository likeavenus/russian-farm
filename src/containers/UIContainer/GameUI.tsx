import React, { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import cn from "classnames";
import RestartImg from "/assets/game/restart.png";
import GameOverImg from "/assets/game/game-over.png";

import PauseIcon from "@mui/icons-material/Pause";
import HomeIcon from "@mui/icons-material/Home";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { EventBus } from "../../game/EventBus";
import { GAME_EVENTS } from "../../game/constants";
import { useNavigate } from "react-router-dom";

export const GameUI: React.FC = () => {
    const [isPaused, setPauseMenu] = useState(false);
    const [isStarted, setStart] = useState(false);
    const [isGameOver, setGameOver] = useState(false);

    const navigate = useNavigate();

    const checkGameStatus = () => {
        console.log("Ready!");
    };

    const pause = () => {
        EventBus.emit(GAME_EVENTS.PAUSE);
        setPauseMenu(true);
    };

    const resume = () => {
        EventBus.emit(GAME_EVENTS.RESUME);
        setPauseMenu(false);
    };

    const goToMain = () => {
        setPauseMenu(false);
        setStart(false);
        setGameOver(false);
        // navigate("/main");
        EventBus.emit(GAME_EVENTS.OPEN_MAIN);
        navigate("/");
    };

    const onStart = () => {
        setStart(true);
    };
    const onOpenMenu = () => {
        setPauseMenu(false);
    };

    const dinoJump = () => {
        EventBus.emit(GAME_EVENTS.DINO_JUMP);
    };

    const dinoBendDown = () => {
        EventBus.emit(GAME_EVENTS.DINO_BEND_DOWN);
    };

    const onGameOver = () => {
        setGameOver(true);
    };

    // useEffect(() => {
    //     EventBus.on(GAME_EVENTS.CURRENT_SCENE_READY, checkGameStatus);

    //     return () =>
    //         EventBus.off(GAME_EVENTS.CURRENT_SCENE_READY, checkGameStatus);
    // }, []);

    useEffect(() => {
        EventBus.on(GAME_EVENTS.START_GAME, onStart);

        return () => {
            EventBus.removeListener(GAME_EVENTS.START_GAME, onStart);
        };
    }, []);

    useEffect(() => {
        EventBus.on(GAME_EVENTS.GAME_OVER, onGameOver);

        return () => {
            EventBus.removeListener(GAME_EVENTS.START_GAME, onStart);
        };
    }, []);

    // useEffect(() => {
    //     EventBus.on(GAME_EVENTS.OPEN_MENU, onOpenMenu);

    //     return () => EventBus.off(GAME_EVENTS.OPEN_MENU, onOpenMenu);
    // }, []);

    return (
        <>
            {isStarted && (
                <div
                    className={cn("game-ui", {
                        paused: isStarted,
                    })}
                >
                    <IconButton color="primary" size="medium" onClick={pause}>
                        <PauseIcon />
                    </IconButton>
                </div>
            )}

            <div
                className={cn("pause-menu", {
                    active: isPaused,
                })}
            >
                <div className={cn("pause-btns")}>
                    <Button
                        onClick={goToMain}
                        size="medium"
                        startIcon={<HomeIcon />}
                    >
                        Menu
                    </Button>
                    <Button
                        onClick={resume}
                        size="medium"
                        startIcon={<PlayArrowIcon />}
                    >
                        Resume
                    </Button>
                </div>
            </div>
            <div
                className={cn("play-btns", {
                    active: isStarted,
                })}
            >
                <IconButton
                    className={cn("play-btn")}
                    color="primary"
                    size="large"
                    onClick={dinoJump}
                >
                    <KeyboardArrowUpIcon fontSize="large" />
                </IconButton>
                <IconButton
                    className={cn("play-btn")}
                    color="primary"
                    size="large"
                    onClick={dinoBendDown}
                >
                    <KeyboardArrowDownIcon fontSize="large" />
                </IconButton>
            </div>
            <div
                className={cn("game-over", {
                    active: isGameOver,
                })}
            >
                <div>
                    <img src={GameOverImg} alt="game-over" />
                </div>
                <button className={cn("button menu-btn")} onClick={goToMain}>
                    <img src={RestartImg} alt="restart" />
                </button>
            </div>
        </>
    );
};

