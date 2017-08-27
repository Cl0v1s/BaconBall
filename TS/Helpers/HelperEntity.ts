class Vector2
{
    public x : number;
    public y : number;

    public static min(v1 : Vector2, v2 : Vector2) : Vector2
    {
        if(v1.scalar() < v2.scalar())
            return v1;
        return v2;
    }

    constructor(x? : number, y? : number)
    {
        this.x = x;
        this.y = y;
    }

    public add(other : Vector2) : Vector2
    {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    public substract(other : Vector2) : Vector2
    {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    public multiply(other : Vector2) : Vector2
    {
        return new Vector2(this.x * other.x, this.y * other.y);
    }

    public dotproduct(other : Vector2) : number
    {
        return this.x * other.x + this.y * other.y;
    }

    public scalar() : number
    {
        return this.x + this.y;
    }
}

class Rectangle
{
    public x : number;
    public y :number;
    public width : number;
    public height : number;

    constructor(x?, y?, width?, height?)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public translate(vec : Vector2) : Rectangle
    {
        return new Rectangle(this.x + vec.x, this.y + vec.y, this.width, this.height);
    }

    public intersect(rec : Rectangle) : Rectangle
    {
        if (!(this.x < rec.x + rec.width &&
            this.x + this.width > rec.x &&
            this.y < rec.y + rec.height &&
            this.height + this.y > rec.y)) {
            return null;
        }
        let result = new Rectangle();
        if(this.x < rec.x)
        {
            result.x = rec.x;
            result.width = this.x + this.width - rec.x;
        }
        else
        {
            result.x = this.x;
            result.width = rec.x + rec.width - this.x;
        }

        if(this.y < rec.y)
        {
            result.y = rec.y;
            result.height = this.y + this.height - rec.y;
        }
        else
        {
            result.y = this.y;
            result.height = rec.y + rec.height - this.y;
        }
        return result;
    }




}

class HelperEntity {




    /*
        Vérifie la collision entre deux entitées
     */
    public static checkCollisionWithMap(map : GameMap, entity : Entity) : Vector2
    {
        let results  = [];
        let rectangle1 = new Rectangle(
            entity.sprite.x + Config.AirDensity * entity.Vx(),
            entity.sprite.y + Config.AirDensity * entity.Vy(),
            entity.sprite.width,
            entity.sprite.height);

        let points = [];

        points.push(new Vector2(
            entity.sprite.x,
            entity.sprite.y
        ));

        points.push(new Vector2(
            entity.sprite.x + entity.sprite.width,
            entity.sprite.y + entity.sprite.height
        ));

        points.push(new Vector2(
            entity.sprite.x + entity.sprite.width,
            entity.sprite.y
        ));

        points.push(new Vector2(
            entity.sprite.x,
            entity.sprite.y + entity.sprite.height
        ));

        for(let i = 0; i < points.length; i++) {
            let point = points[i];
            if (Config.TilesWalkable(map.grid[Math.floor(point.x / Config.TileSize)][Math.floor(point.y / Config.TileSize)]))
            {
                continue;
            }
            let rectangle2 = new Rectangle(
                Math.floor(point.x / Config.TileSize) * Config.TileSize,
                Math.floor(point.y / Config.TileSize) * Config.TileSize,
                Config.TileSize,
                Config.TileSize
            );
            let result = HelperEntity.checkCollision(rectangle1, rectangle2);
            if(result != null)
                results.push(result);
        }
        if(results.length <= 0)
            return null;
        let result = new Vector2(0,0);
        results.forEach((r) => {
           result = result.add(r);
        });
        return result;
    }

    public static checkCollisionWithEntity(entity1 : Entity, entity2 : Entity)
    {
        let rectangle1 = new Rectangle(
            entity1.sprite.x + Config.AirDensity * entity1.Vx(),
            entity1.sprite.y + Config.AirDensity * entity1.Vy(),
            entity1.sprite.width,
            entity1.sprite.height);

        let rectangle2 = new Rectangle(
            entity2.sprite.x + Config.AirDensity * entity2.Vx(),
            entity2.sprite.y + Config.AirDensity * entity2.Vy(),
            entity2.sprite.width,
            entity2.sprite.height
        );
        return this.checkCollision(rectangle1, rectangle2);
    }


    public static checkCollision(rectangle1 : Rectangle, rectangle2 : Rectangle) : Vector2 {
        let intersection = rectangle1.intersect(rectangle2);
        if(intersection == null)
            return null;
        let normal = new Vector2(0,0);
        if(intersection.width < intersection.height)
            normal.x = intersection.width;
        else
            normal.y = intersection.height;

        if(rectangle1.x < rectangle2.x )
            normal.x = -normal.x;
        if(rectangle1.y < rectangle2.y)
            normal.y = -normal.y;

        return normal;
    }

    public static resolveCollision(normal : Vector2, entity1 : Entity, entity2? : Entity) : void
    {
        entity1.setVy(normal.y);
        entity1.setVx(normal.x);

        if(entity2 != null)
        {
            entity2.setVy(-normal.y);
            entity2.setVx(-normal.x);
        }
    }



}