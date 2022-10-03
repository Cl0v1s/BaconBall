import * as me from 'melonjs';


interface Directions {
    LEFT,
    RIGHT,
    UP,
    DOWN,
};

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

export default class PlayerEntity extends me.Entity {

    private directions: Directions;

    constructor(x: number, y: number, sprite: me.Sprite, directions: Directions) {
        super(x, y, { 
            width: 32,
            height: 32,
        });

        this.directions = directions;

        this.anchorPoint.set(0.5, 0.5);


        const bounds = new PlayerBounds(this.body.getBounds());
        this.body = new me.Body(this);
        this.body.bounds = bounds;
        this.body.ignoreGravity = true;
        this.body.addShape(new me.Rect(0, 0, sprite.width, sprite.height));

        this.body.mass = 400;

        
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
            if(!sprite.isCurrentAnimation("side")) sprite.setCurrentAnimation("side");
        } else if (me.input.isKeyPressed(this.directions.RIGHT)) {
            body.force.x = (body as me.Body).friction.x * 2;
            if(!sprite.isCurrentAnimation("side")) sprite.setCurrentAnimation("side");
        }
        else if (me.input.isKeyPressed(this.directions.UP))    {
            body.force.y = -(body as me.Body).friction.y * 2;
            if(!sprite.isCurrentAnimation("up")) sprite.setCurrentAnimation("up");
        } else if (me.input.isKeyPressed(this.directions.DOWN)) {
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
        if(other.body.collisionType == me.collision.types.PLAYER_OBJECT) {
            response.a.pos.sub(response.overlapV);
            this.body.vel.y *= -1;
            this.body.vel.x *= -1;
            return true;
        }


        return true;
    }
}