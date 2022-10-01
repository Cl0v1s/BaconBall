import * as me from 'melonjs';
import game from './../game';
import Player1 from './../../res/animations/Player1.json';


class PlayerBounds extends me.Bounds {
    constructor(bounds: me.Bounds) {
        super(undefined);
        this.addBounds(bounds, true);
    }

    overlaps(bounds: me.Bounds | me.Rect): boolean {
        if(!(bounds as any).isMap) return super.overlaps(bounds);
        return true;
    }
}

export default class Player1Entity extends me.Entity {
    constructor(x: number, y: number) {
        super(x, y, { 
            width: 32,
            height: 32,
        });

        this.anchorPoint.set(0.5, 0.5);

        const bounds = new PlayerBounds(this.body.getBounds());
        this.body = new me.Body(this);
        this.body.bounds = bounds;
        this.body.ignoreGravity = true;
        this.body.addShape(this.body.getBounds());
        
        this.body.setMaxVelocity(5, 5);
        this.body.setFriction(0.1, 0.1);
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;
        this.body.setCollisionMask(me.collision.types.WORLD_SHAPE);

        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.DOWN,  "down");
        me.input.bindKey(me.input.KEY.UP,  "up");


        const sprite = (game.textures as me.TextureAtlas).createAnimationFromName(
            Player1.frames.map((f) => f.filename)
        );

        sprite.addAnimation("down", [0, 1, 2, 3].reverse());
        sprite.addAnimation("side", [4, 5, 6, 7]);
        sprite.addAnimation("up", [12, 13, 14, 15]);

        sprite.setCurrentAnimation("up");
        this.renderable = sprite;
    }

    update(dt): boolean {
        const sprite = this.renderable as me.Sprite;
        const body = this.body as me.Body;
        if (me.input.isKeyPressed("left"))    {
            body.force.x = -(body as me.Body).friction.x * 2;
            if(!sprite.isCurrentAnimation("side")) sprite.setCurrentAnimation("side");
        } else if (me.input.isKeyPressed("right")) {
            body.force.x = (body as me.Body).friction.x * 2;
            if(!sprite.isCurrentAnimation("side")) sprite.setCurrentAnimation("side");
        }
        else if (me.input.isKeyPressed("up"))    {
            body.force.y = -(body as me.Body).friction.y * 2;
            if(!sprite.isCurrentAnimation("up")) sprite.setCurrentAnimation("up");
        } else if (me.input.isKeyPressed("down")) {
            body.force.y = (body as me.Body).friction.y * 2;
            if(!sprite.isCurrentAnimation("down")) sprite.setCurrentAnimation("down");
        }
        if(body.vel.x == 0 && body.vel.y == 0) {
            sprite.setAnimationFrame(0);
            sprite.animationpause = true;
        }
        else sprite.animationpause = false;

        return super.update(dt);
    }

    onCollision(response: any, other: me.Renderable): boolean {
        return true;
    }
}