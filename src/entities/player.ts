import * as me from 'melonjs';
import ActorBounds from './actorBounds';
import PigEntity from './pig';

interface Directions {
    LEFT,
    RIGHT,
    UP,
    DOWN,
    KICK,
};



export default class PlayerEntity extends me.Entity {

    private directions: Directions;

    constructor(x: number, y: number, sprite: me.Sprite, directions: Directions) {
        super(x, y, { 
            width: 32,
            height: 32,
        });

        this.directions = directions;

        this.anchorPoint.set(0.5, 0.5);


        const bounds = new ActorBounds(this.body.getBounds());
        this.body = new me.Body(this);
        this.body.bounds = bounds;
        this.body.ignoreGravity = true;
        this.body.addShape(new me.Rect(0, 0, sprite.width, sprite.height));

        this.body.setMaxVelocity(5, 5);
        this.body.setFriction(0.1, 0.1);

        this.body.collisionType = me.collision.types.PLAYER_OBJECT;


        sprite.addAnimation("down", [0, 1, 2, 3].reverse());
        sprite.addAnimation("side", [4, 5, 6, 7]);
        sprite.addAnimation("up", [12, 13, 14, 15]);

        sprite.setCurrentAnimation("up");
        this.renderable = sprite;
    }

    update(dt): boolean {
        const sprite = this.renderable as me.Sprite;
        const body = this.body as me.Body;
        if (me.input.isKeyPressed(this.directions.LEFT))    {
            body.force.x = -(body as me.Body).friction.x * 2;
        } else if (me.input.isKeyPressed(this.directions.RIGHT)) {
            body.force.x = (body as me.Body).friction.x * 2;
        }
        
        if (me.input.isKeyPressed(this.directions.UP))    {
            body.force.y = -(body as me.Body).friction.y * 2;
        } else if (me.input.isKeyPressed(this.directions.DOWN)) {
            body.force.y = (body as me.Body).friction.y * 2;
        }


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

        if(body.vel.x == 0 && body.vel.y == 0) {
            sprite.setAnimationFrame(0);
            sprite.animationpause = true;
        }
        else sprite.animationpause = false;

        return super.update(dt);
    }

    onCollision(response: any, other: me.Renderable): boolean {
        if(other.body.collisionType == me.collision.types.PROJECTILE_OBJECT) return false;
        if(other.body.collisionType == me.collision.types.ENEMY_OBJECT) {
            response.a.pos.sub(response.overlapV);
            if(me.input.isKeyPressed(this.directions.KICK) && other instanceof PigEntity) other.kick();
            return false;
        };
        // the collision code must be called for only one of the two players
        if(other.body.collisionType == this.body.collisionType) return this !== response.b;
        return true;
    }
}