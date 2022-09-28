import * as me from "melonjs";

import Player1Bitmap from './../res/animations/Player1.png';
import Player1JSON from './../res/animations/Player1.json';

const ressources = [
    { name: "Player1", type: "image", src: Player1Bitmap },
];

const createTextures = () => new me.TextureAtlas(
    Player1JSON,
    me.loader.getImage("Player1"),
);

export {
    ressources,
    createTextures,
}