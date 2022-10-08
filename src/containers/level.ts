import * as me from 'melonjs';

import generate, { SOLID } from './../generator';

import game from '../game';

export default class LevelContainer extends me.Container {
    constructor() {
        super();

        this.body = new me.Body(this);
        this.body.ignoreGravity = true;
        this.body.setStatic(true);
        this.body.collisionType = me.collision.types.WORLD_SHAPE;
        (this.body.bounds as any).isMap = true;
        this.body.setFriction(100, 100);

        const map = generate();

        for(let i = 0; i < map.length; i++) {
            for(let u = 0; u < map[i].length; u++) {
                if(map[i][u] == 0) continue;
                const tile = game.textures?.createSpriteFromName(`Tileset-${String(map[i][u]).padStart(2, "0")}`) as me.Sprite;
                // handle middle field
                if(u * 32 > me.game.viewport.height / 2) tile.flipY(true);
                tile.pos.set(i * 32, u * 32);
                tile.anchorPoint.set(0, 0);
                this.addChild(tile);
                if(SOLID[map[i][u]]) this.body.addShape(new me.Rect(i * 32, u * 32, 32, 32));
            }
        }

    }

    draw(renderer: me.CanvasRenderer | me.WebGLRenderer, viewport?: me.Camera2d | undefined): void {
        renderer.setColor("#282d44");
        renderer.fillRect(0, 0, viewport?.width as number, viewport?.height as number);
        super.draw(renderer, viewport);
    }
}