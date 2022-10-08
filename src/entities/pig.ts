import * as me from 'melonjs';

import Pig from './../../res/animations/Pig.json';
import ActorBounds from './actorBounds';

import game from './../game';

import { Directions as P1Directions } from './player1';
import { Directions as P2Directions } from './player2';

const z = (x) => -(1/300) * x * x + 0.2 * x + 1;

export default class PigEntity extends me.Entity {

    // movement
    private target: me.Vector2d | null;
    private timer: number;


    private jumping: number;

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

        this.target = null;
        this.timer = 0;

        this.jumping = -1;
    }

    /**
     * Set a new target for the pig to follow
     */
    setTarget(): void {
        this.timer = 0;
        const position = new me.Vector2d(this.pos.x, this.pos.y);
        const v = new me.Vector2d(
            Math.floor(Math.random() * 100) * (Math.random() < 0.5 ? -1 : 1),
            Math.floor(Math.random() * 100) * (Math.random() < 0.5 ? -1 : 1),
        );
        this.target = position.sub(v);
    }

    /**
     * Update movement IA
     */
    updateTarget(): void {
        if(this.body.vel.x  == 0 && this.body.vel.y == 0 && this.target == null && this.timer == 0) {
            this.timer = setTimeout(() => this.setTarget(), 1000);
        }
        if(this.target && this.target.x !== this.pos.x && this.target.y !== this.pos.y) {
            this.body.vel.x = (this.target.x - this.pos.x);
            this.body.vel.y = (this.target.y - this.pos.y);
            this.body.vel = this.body.vel.normalize();
        }

        if(this.target && this.pos.distance(this.target) < 5) {
            this.target = null;
            this.timer = 0;
        }
    }


    kick(): void {
        if(this.jumping < 0) {
            this.jumping = 0;
        }
    }

    updateJump(): void {
        if(this.jumping < 0) return;
        this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
        const lasty = z(this.jumping)
        this.jumping += 1;
        const y = z(this.jumping);
        if(y < 1) {
            this.jumping = -1;
            this.body.collisionType = me.collision.types.ENEMY_OBJECT;
            this.renderable.currentTransform.identity();
            return;
        }
        this.renderable.scale(y / lasty);
    }

    update(dt): boolean {
        const sprite = this.renderable as me.Sprite;
        const body = this.body as me.Body;

        this.updateTarget();
        this.updateJump();
        
        if(Math.abs(this.body.vel.y) >= Math.abs(this.body.vel.x)) {
            if (this.body.vel.y < 0)    {
                if(!sprite.isCurrentAnimation("up")) sprite.setCurrentAnimation("up");
            } else if (this.body.vel.y > 0) {
                if(!sprite.isCurrentAnimation("down")) sprite.setCurrentAnimation("down");
            } 
        } else {
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
        }

        if((body.vel.x == 0 && body.vel.y == 0) || this.jumping > 0) {
            sprite.setAnimationFrame(0);
            sprite.animationpause = true;
        }
        else sprite.animationpause = false;

        return super.update(dt);
    }

    onBounce(response: any, other: me.Renderable): boolean {
        response.a.pos.sub(response.overlapV);
        if(response.overlapV.x !== 0) this.body.vel.x *= -0.75;
        if(response.overlapV.y !== 0) this.body.vel.y *= -0.75;
        return false;
    }

    onShoot(response: any, other: me.Renderable): boolean {
        response.a.pos.sub(response.overlapV);
        const angle = other.angleTo(this);
        this.body.vel = new me.Vector2d(Math.cos(angle) * other.body.vel.length() * 2, Math.sin(angle) * other.body.vel.length() * 2);
        other.body.vel.setZero();
        return false;
    }

    onCollision(response: any, other: me.Renderable): boolean {
        this.target = null;
        if(this.timer != 0) {
            clearTimeout(this.timer);
            this.timer = 0;
        }
        if(other.body.collisionType === me.collision.types.WORLD_SHAPE) {
            return this.onBounce(response, other);
        }

        if(this.body.collisionType == me.collision.types.PROJECTILE_OBJECT) return false;

        if(other.body.collisionType === me.collision.types.PLAYER_OBJECT) {
            if(other.body.vel.x === 0 && other.body.vel.y === 0) return this.onBounce(response, other);
            return this.onShoot(response, other);
        }
        return false;
    }

}