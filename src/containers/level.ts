import * as me from 'melonjs';

import generate from './../generator';

import game from '../game';

import TileEntity from '../entities/tile';

export default class LevelContainer extends me.Container {
    constructor() {
        super();

        this.body = new me.Body(this);
        this.body.ignoreGravity = true;
        this.body.setStatic(true);
        this.body.collisionType = me.collision.types.WORLD_SHAPE;

        const map = generate();

        for(let i = 0; i < map.length; i++) {
            for(let u = 0; u < map[i].length; u++) {
                const tile = game.textures?.createSpriteFromName(`Tileset-0${map[i][u]}`) as me.Sprite;
                tile.pos.set(i * 32, u * 32);
                tile.anchorPoint.set(0, 0);
                this.addChild(tile);
                this.body.bounds.add([new me.Vector2d(i * 32, u * 32, 32, 32)]);
            }
        }


        console.log(this.body.getBounds());

    }


    draw(renderer: me.CanvasRenderer | me.WebGLRenderer, viewport?: me.Camera2d | undefined): void {
        renderer.setColor("#282d44");
        renderer.fillRect(0, 0, viewport?.width as number, viewport?.height as number);
        super.draw(renderer, viewport);
    }
}