import * as me from "melonjs";

import Player1Bitmap from './../res/animations/Player1.png';
import Player1JSON from './../res/animations/Player1.json';

import TilesetBitmap from './../res/animations/Tileset.png';
import TilesetJSON from './../res/animations/Tileset.json';


const ressources = [
    { name: "Player1", type: "image", src: Player1Bitmap },
    { name: "Tileset", type: "image", src: TilesetBitmap },
];

const createTextures = () => new me.TextureAtlas([
    Player1JSON,
    TilesetJSON,
]);

export {
    ressources,
    createTextures,
}