import * as me from 'melonjs';
import game from '../game';

export default class TileEntity extends me.Entity {
    constructor(x, y, tile) {
        super(x, y, {
            width: 32,
            height: 32,
        });

        this.anchorPoint.set(0, 0);
        this.body.ignoreGravity = true;


        this.renderable = game.textures?.createSpriteFromName(`Tileset-0${tile}`) as me.Renderable;
    }
}