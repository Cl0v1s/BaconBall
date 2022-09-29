import * as me from 'melonjs';

import generate from './../generator';

import game from '../game';

import TileEntity from '../entities/tile';

export default class LevelContainer extends me.Container {
    constructor() {
        super();
        const map = generate();

        for(let i = 0; i < map.length; i++) {
            for(let u = 0; u < map[i].length; u++) {
                const tile = game.textures?.createSpriteFromName(`Tileset-0${map[i][u]}`) as me.Sprite;
                tile.pos.set(i * 32, u * 32);
                tile.anchorPoint.set(0, 0);
                this.addChild(tile);
            }
        }
    }

    draw(renderer: me.CanvasRenderer | me.WebGLRenderer, viewport?: me.Camera2d | undefined): void {
        renderer.setColor("#282d44");
        renderer.fillRect(0, 0, viewport?.width as number, viewport?.height as number);
        super.draw(renderer, viewport);
    }
}