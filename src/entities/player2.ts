import * as me from 'melonjs';
import game from '../game';
import PlayerEntity from './player';
import Player2 from '../../res/animations/Player2.json';

export const Directions = {
    LEFT: "p2left",
    RIGHT: "p2right",
    DOWN: "p2down",
    UP: "p2up",
    KICK: "p2kick",
}

export default class Player2Entity extends PlayerEntity {
    constructor(x: number, y: number) {
        const sprite = (game.textures as me.TextureAtlas).createAnimationFromName(
            Player2.frames.map((f) => f.filename)
        );
        super(x, y, sprite, Directions);

        me.input.bindKey(me.input.KEY.Q,  Directions.LEFT);
        me.input.bindKey(me.input.KEY.D, Directions.RIGHT);
        me.input.bindKey(me.input.KEY.S,  Directions.DOWN);
        me.input.bindKey(me.input.KEY.Z,  Directions.UP);
        me.input.bindKey(me.input.KEY.SPACE,  Directions.KICK);
    }
}