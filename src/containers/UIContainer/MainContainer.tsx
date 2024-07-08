import React, { useEffect, useRef } from "react";
import {
    Outlet,
    RouterProvider,
    createBrowserRouter,
    useLocation,
} from "react-router-dom";
import { GameUI } from "./GameUI";
import { UIContainerBottom } from "./UIContainerBottom";
import { Boosts } from "../../modules/Boosts";
import { Friends } from "../../modules/Friends";
import { Earn } from "../../modules/Earn";
import { IRefPhaserGame, PhaserGame } from "../../game/PhaserGame";
import { EventBus } from "../../game/EventBus";
import { GAME_EVENTS } from "../../game/constants";

// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: (
//             <>
//                 <GameUI />
//                 <UIContainerBottom />
//             </>
//         ),
//     },
//     {
//         path: "/main",
//         element: (
//             <>
//                 <GameUI />
//                 <UIContainerBottom />
//             </>
//         ),
//     },
//     {
//         path: "/boosts",
//         element: (
//             <>
//                 <Boosts />
//                 <UIContainerBottom />
//             </>
//         ),
//     },
//     {
//         path: "/friends",
//         element: (
//             <>
//                 <Friends />
//                 <UIContainerBottom />
//             </>
//         ),
//     },
//     {
//         path: "/earn",
//         element: (
//             <>
//                 <Earn />
//                 <UIContainerBottom />
//             </>
//         ),
//     },
// ]);

export const MainContainer: React.FC = ({ phaserRef }) => {
    // const phaserRef = useRef<IRefPhaserGame | null>(null);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/") {
            EventBus.emit(GAME_EVENTS.RESUME);
        }
    }, [location.pathname]);

    const currentScene = (scene: Phaser.Scene) => {
        // setCanMoveSprite(scene.scene.key !== "MainMenu");
        // console.log(scene.scene.key);
    };

    // console.log("MainContainer Ref", phaserRef);

    // useEffect(() => {
    //     EventBus.emit(GAME_EVENTS.CURRENT_SCENE_READY);
    //     console.log("emit ---");
    // }, []);

    return (
        <>
            {/* <PhaserGame
                key="phaser"
                ref={phaserRef}
                currentActiveScene={currentScene}
            /> */}
            <GameUI phaserRef={phaserRef} />
            <UIContainerBottom />
            <Outlet />
        </>
    );
};
