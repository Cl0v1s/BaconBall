import * as me from 'melonjs';
import game from './../game';
import Player1 from './../../res/animations/Player1.json';

export default class Player1Entity extends me.Entity {
    constructor(x: number, y: number) {
        super(x, y, { 
            width: 32,
            height: 32,
        });

        this.renderable = (game.textures as me.TextureAtlas).createAnimationFromName(
            Player1.frames.map((f) => f.filename)
        );

        this.anchorPoint.set(0.5, 1.0);

        this.body.ignoreGravity = true;
    }
}