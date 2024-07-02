import { useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { MainMenu } from "./game/scenes/MainMenu";
import cn from "classnames";
import { MainContainer, UIContainerBottom } from "./containers/UIContainer";
import {
    RouterProvider,
    createBrowserRouter,
    Outlet,
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";
import { Boosts } from "./modules/Boosts";
import { Friends } from "./modules/Friends";
import { Earn } from "./modules/Earn";
import { GameUI } from "./containers/UIContainer";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainContainer />,
    },
    {
        path: "/main",
        element: <></>,
    },
    {
        path: "/boosts",
        element: (
            <>
                <Boosts />
            </>
        ),
    },
    {
        path: "/friends",
        element: (
            <>
                <Friends />
            </>
        ),
    },
    {
        path: "/earn",
        element: (
            <>
                <Earn />
            </>
        ),
    },
]);

function App() {
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

    // const changeScene = () => {
    //     if (phaserRef.current) {
    //         const scene = phaserRef.current.scene as MainMenu;

    //         if (scene) {
    //             scene.changeScene();
    //         }
    //     }
    // };

    // const moveSprite = () => {
    //     if (phaserRef.current) {
    //         const scene = phaserRef.current.scene as MainMenu;

    //         if (scene && scene.scene.key === "MainMenu") {
    //             // Get the update logo position
    //             scene.moveLogo(({ x, y }) => {
    //                 setSpritePosition({ x, y });
    //             });
    //         }
    //     }
    // };

    // const addSprite = () => {
    //     if (phaserRef.current) {
    //         const scene = phaserRef.current.scene;

    //         if (scene) {
    //             // Add more stars
    //             const x = Phaser.Math.Between(64, scene.scale.width - 64);
    //             const y = Phaser.Math.Between(64, scene.scale.height - 64);

    //             //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
    //             const star = scene.add.sprite(x, y, "star");

    //             //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
    //             //  You could, of course, do this from within the Phaser Scene code, but this is just an example
    //             //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
    //             scene.add.tween({
    //                 targets: star,
    //                 duration: 500 + Math.random() * 1000,
    //                 alpha: 0,
    //                 yoyo: true,
    //                 repeat: -1,
    //             });
    //         }
    //     }
    // };

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        // setCanMoveSprite(scene.scene.key !== "MainMenu");
    };

    console.log("App Ref", phaserRef.current);

    return (
        <div id="app" className={cn("app")}>
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            {/* <RouterProvider router={router} /> */}

            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<MainContainer phaserRef={phaserRef} />}
                    >
                        <Route path="boosts" element={<Boosts />} />
                        <Route path="friends" element={<Friends />} />
                        <Route path="earn" element={<Earn />} />
                    </Route>
                </Routes>
            </BrowserRouter>

            {/* <div>
                <div>
                    <button className="button" onClick={addSprite}>
                        Add New Sprite
                    </button>
                </div>
            </div> */}
        </div>
    );
}

export default App;

