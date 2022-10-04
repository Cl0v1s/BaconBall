import * as me from "melonjs";

import Player1Bitmap from './../res/animations/Player1.png';
import Player2Bitmap from './../res/animations/Player2.png';
import Player1JSON from './../res/animations/Player1.json';
import Player2JSON from './../res/animations/Player2.json';

import PigBitmap from './../res/animations/Pig.png';
import PigJSON from './../res/animations/Pig.json';

import TilesetBitmap from './../res/animations/Tileset.png';
import TilesetJSON from './../res/animations/Tileset.json';


const ressources = [
    { name: "Player1", type: "image", src: Player1Bitmap },
    { name: "Player2", type: "image", src: Player2Bitmap },
    { name: "Tileset", type: "image", src: TilesetBitmap },
    { name: "Pig", type: "image", src: PigBitmap },
];

const createTextures = () => new me.TextureAtlas([
    Player1JSON,
    Player2JSON,
    TilesetJSON,
    PigJSON,
]);

export {
    ressources,
    createTextures,
}