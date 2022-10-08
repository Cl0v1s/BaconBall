import * as me from 'melonjs';
import game from './../game';
import PlayerEntity from './player';
import Player1 from './../../res/animations/Player1.json';


export const Directions = {
    LEFT: "p1left",
    RIGHT: "p1right",
    DOWN: "p1down",
    UP: "p1up",
    KICK: "p1kick",
}

export default class Player1Entity extends PlayerEntity {
    constructor(x: number, y: number) {
        const sprite = (game.textures as me.TextureAtlas).createAnimationFromName(
            Player1.frames.map((f) => f.filename)
        );
        super(x, y, sprite, Directions);

        me.input.bindKey(me.input.KEY.LEFT,  Directions.LEFT);
        me.input.bindKey(me.input.KEY.RIGHT, Directions.RIGHT);
        me.input.bindKey(me.input.KEY.DOWN,  Directions.DOWN);
        me.input.bindKey(me.input.KEY.UP,  Directions.UP);
        me.input.bindKey(me.input.KEY.NUMPAD0,  Directions.KICK);
    }
}