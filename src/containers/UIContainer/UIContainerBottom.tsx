import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddTaskIcon from "@mui/icons-material/AddTask";
import "./styles.scss";
import { EventBus } from "../../game/EventBus";
import { GAME_EVENTS } from "../../game/constants";

export const UIContainerBottom: React.FC = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setOpenMenu] = useState(true);

    const pauseGame = () => {
        EventBus.emit(GAME_EVENTS.PAUSE);
    };

    const getBoosts = () => {
        pauseGame();

        navigate("/boosts");
    };

    const getFriends = () => {
        pauseGame();

        navigate("/friends");
    };

    const getEarn = () => {
        pauseGame();

        navigate("/earn");
    };

    const onStart = () => {
        setOpenMenu(false);
    };

    const openMenu = () => {
        setOpenMenu(true);
    };

    const onOpenMain = () => {
        console.log("onOpenMain!");

        setOpenMenu(true);
    };

    const onGameOver = () => {
        navigate("/main");
    };

    useEffect(() => {
        EventBus.on(GAME_EVENTS.START_GAME, onStart);

        return () => {
            EventBus.removeListener(GAME_EVENTS.START_GAME, onStart);
        };
    }, []);

    // useEffect(() => {
    //     EventBus.on(GAME_EVENTS.GAME_OVER, onGameOver);

    //     return () => EventBus.off(GAME_EVENTS.GAME_OVER, onGameOver);
    // }, []);

    // useEffect(() => {
    //     EventBus.on(GAME_EVENTS.OPEN_MENU, openMenu);

    //     return () => EventBus.off(GAME_EVENTS.OPEN_MENU, openMenu);
    // }, []);

    useEffect(() => {
        EventBus.on(GAME_EVENTS.OPEN_MAIN, onOpenMain);

        return () => {
            EventBus.removeListener(GAME_EVENTS.OPEN_MAIN, onOpenMain);
        };
    }, []);

    return (
        <div
            id="ui-bottom"
            className={cn("container", {
                active: isMenuOpen,
            })}
        >
            <div className={cn("buttons-box")}>
                <Button
                    color="primary"
                    size="medium"
                    onClick={getBoosts}
                    startIcon={<ShoppingCartIcon />}
                >
                    Boosts
                </Button>
                <Button
                    color="primary"
                    size="medium"
                    onClick={getFriends}
                    startIcon={<GroupAddIcon />}
                >
                    Friends
                </Button>
                <Button
                    color="primary"
                    size="medium"
                    onClick={getEarn}
                    startIcon={<AddTaskIcon />}
                >
                    Earn
                </Button>
            </div>
        </div>
    );
};

