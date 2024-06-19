import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddTaskIcon from "@mui/icons-material/AddTask";
import "./styles.scss";
import { EventBus } from "../../game/EventBus";
import { GAME_EVENTS } from "../../game/constants";

export const UIContainerBottom: React.FC = () => {
    const navigate = useNavigate();

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

    return (
        <div id="ui-bottom" className="container">
            <div className="buttons-box">
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
                    size="large"
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

