import * as me from 'melonjs';

import Pig from './../../res/animations/Pig.json';
import ActorBounds from './actorBounds';

import game from './../game';

export default class PigEntity extends me.Entity {
    constructor(x, y) {
        super(x, y, { width: 32, height: 32});

        const sprite = (game.textures as me.TextureAtlas).createAnimationFromName(
            Pig.frames.map((f) => f.filename)
        );

        this.anchorPoint.set(0.5, 0.5);

        const bounds = new ActorBounds(this.body.getBounds());
        const body = new me.Body(this);
        body.bounds = bounds;
        body.ignoreGravity = true;
        body.addShape(new me.Rect(0, 0, 32, 32));
        body.collisionType = me.collision.types.ENEMY_OBJECT;
        body.setMaxVelocity(10, 10);
        body.setFriction(0.05, 0.05);

        this.body = body;



        sprite.addAnimation("down", [3, 2, 1, 0].reverse());
        sprite.addAnimation("side", [4, 5, 6, 7]);
        sprite.addAnimation("up", [8, 9, 10, 11]);

        sprite.setCurrentAnimation("down");

        this.renderable = sprite;
    }

    update(dt): boolean {
        const sprite = this.renderable as me.Sprite;
        const body = this.body as me.Body;
        if (this.body.vel.x > 0)    {
            if(!sprite.isCurrentAnimation("side") || sprite.isFlippedX) {
                sprite.setCurrentAnimation("side");
                sprite.flipX(false);
            }
        } else if (this.body.vel.x < 0) {
            if(!sprite.isCurrentAnimation("side") || sprite.isFlippedX == false) {
                sprite.setCurrentAnimation("side");
                sprite.flipX(true);
            }
        }
        else if (this.body.vel.y < 0)    {
            if(!sprite.isCurrentAnimation("up")) sprite.setCurrentAnimation("up");
        } else if (this.body.vel.y > 0) {
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
        if(other.body.collisionType === me.collision.types.PLAYER_OBJECT) return false;
        return true;
    }

}