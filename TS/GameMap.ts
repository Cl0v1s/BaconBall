class GameMap
{
    private container : PIXI.Container;
    public grid  : Array<Array<number>> = [];
    private width : number;
    private height : number;

    private scene : SceneGame;
    constructor(scene : SceneGame)
    {
        this.scene = scene;

        this.container = new PIXI.Container();
        Program.GetInstance().App().stage.addChild(this.container);

        this.width = Math.floor(Program.GetInstance().App().renderer.width / Config.TileSize);
        this.height = Math.floor(Program.GetInstance().App().renderer.height / Config.TileSize);

        for(let i = 0; i < this.width ; i++)
        {
            let row : Array<number> = [];
            for(let u = 0; u < this.height; u++)
            {
                row.push(Config.Tiles.Ground);
            }
            this.grid.push(row);
        }


        this.generate();
    }

    private generate() : void
    {
        this.generateWalls();
        this.generateObstacles();
        let lava = this.generateLava();
        this.generateWater(lava);

        this.generateSprites();
    }

    private generateSprites() : void
    {
        let sprite : PIXI.Sprite;
        for(let i = 0; i < this.width ; i++)
        {
            let row : Array<number> = [];
            for(let u = 0; u < this.height; u++)
            {
                let tile = (this.grid[i][u]);

                // Adoucissement des murs
                tile = this.polishWalls(tile, i, u);


                // Adoucissement de la lave
                tile = this.polishLava(tile, i ,u);
                // Adoucissement de l'eau
                tile = this.polishWater(tile, i ,u);
                // Variation du sol
                tile = this.randomizeGround(tile, i ,u);

                if(tile == Config.Tiles.Ground)
                    continue;
                this.createEmitter(tile, i, u);
                sprite = PIXI.Sprite.fromFrame("tile"+(tile+1)+".png");
                sprite.x = i * Config.TileSize;
                sprite.y = u * Config.TileSize;
                this.container.addChild(sprite);
            }
            this.grid.push(row);
        }
    }

    private createEmitter(tile, x,y) : void 
    {
        if(tile == Config.Tiles.Lava)
        {
            ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame("particle3.png"), {
                x : x * Config.TileSize,
                y : y * Config.TileSize,
                life : Infinity,
                particleLife : 30,
                particleSpeed : 0.1,
                angleMax : 0,
                sizeRandom: true,
                sizeMax: 3,
                frequency : 20,
                zone : new PIXI.Rectangle(0,0,Config.TileSize, Config.TileSize)
            });
        }
    }

    private randomizeGround(tile, x,y) : number
    {
        if(tile != Config.Tiles.Ground)
            return tile;

        if(Math.random() * 100 <= 10)
            tile = Config.Tiles.Weed;
        else if(Math.random() * 100 <= 30)
            tile = Config.Tiles.Rock;

        return tile;
    }

    private polishWalls(tile, x, y) : number
    {
        if(tile == Config.Tiles.WallH &&
            (this.grid[x+1] != null && (this.grid[x+1][y] != Config.Tiles.WallH && this.grid[x+1][y] != Config.Tiles.WallV  )||
            this.grid[x-1] != null && (this.grid[x-1][y] != Config.Tiles.WallH && this.grid[x-1][y] != Config.Tiles.WallV  ))
        )
        {
            tile = Config.Tiles.Wall;
        }
        return tile;
    }

    private polishWater(tile, x , y) : number
    {

        if(tile != Config.Tiles.Ground)
            return tile;

        if(this.grid[x] != null && this.grid[x][y+1] == Config.Tiles.Water)
            return Config.Tiles.WaterT;
        if(this.grid[x - 1] != null && this.grid[x - 1][y+1] == Config.Tiles.Water)
        {
            if(this.grid[x-1][y] != Config.Tiles.Water)
                return Config.Tiles.WaterTR;
            else
                return Config.Tiles.WaterR;
        }
        if(this.grid[x+1] != null && this.grid[x+1][y+1] == Config.Tiles.Water)
        {
            if(this.grid[x+1][y] != Config.Tiles.Water)
                return Config.Tiles.WaterTL;
            else
                return Config.Tiles.WaterL;
        }
        if(this.grid[x-1] != null && this.grid[x-1][y] == Config.Tiles.Water)
            return Config.Tiles.WaterR;
        if(this.grid[x+1] != null && this.grid[x+1][y] == Config.Tiles.Water)
            return Config.Tiles.WaterL;
        if(this.grid[x] != null && this.grid[x][y-1] == Config.Tiles.Water)
            return Config.Tiles.WaterB;
        if(this.grid[x-1] != null && this.grid[x-1][y-1] == Config.Tiles.Water)
            return Config.Tiles.WaterBR;
        if(this.grid[x+1] != null && this.grid[x+1][y-1] == Config.Tiles.Water)
            return Config.Tiles.WaterBL;

        return tile;
    }

    private polishLava(tile, x , y) : number
    {

        if(tile != Config.Tiles.Ground)
            return tile;

        if(this.grid[x] != null && this.grid[x][y+1] == Config.Tiles.Lava)
            return Config.Tiles.LavaT;
        if(this.grid[x - 1] != null && this.grid[x - 1][y+1] == Config.Tiles.Lava)
        {
            if(this.grid[x-1][y] != Config.Tiles.Lava)
                return Config.Tiles.LavaTR;
            else
                return Config.Tiles.LavaR;
        }
        if(this.grid[x+1] != null && this.grid[x+1][y+1] == Config.Tiles.Lava)
        {
            if(this.grid[x+1][y] != Config.Tiles.Lava)
                return Config.Tiles.LavaTL;
            else
                return Config.Tiles.LavaL;
        }
        if(this.grid[x-1] != null && this.grid[x-1][y] == Config.Tiles.Lava)
            return Config.Tiles.LavaR;
        if(this.grid[x+1] != null && this.grid[x+1][y] == Config.Tiles.Lava)
            return Config.Tiles.LavaL;
        if(this.grid[x] != null && this.grid[x][y-1] == Config.Tiles.Lava)
            return Config.Tiles.LavaB;
        if(this.grid[x-1] != null && this.grid[x-1][y-1] == Config.Tiles.Lava)
            return Config.Tiles.LavaBR;
        if(this.grid[x+1] != null && this.grid[x+1][y-1] == Config.Tiles.Lava)
            return Config.Tiles.LavaBL;

        return tile;
    }

    private generateWalls() : void
    {
        for(let i = 0; i < this.width ; i++)
        {
            this.grid[i][0] = Config.Tiles.WallH;
            this.grid[i][this.height - 1] = Config.Tiles.WallH;
        }
        for(let u = 0; u < this.height - 1; u++)
        {
            this.grid[0][u] = Config.Tiles.WallV;
            this.grid[this.width - 1][u] = Config.Tiles.WallV;
        }
    }

    /*
    Génère un obstacle horizontal
     */
    private generateObstacle(x : number, y : number) : void
    {
        for(let i = 0; i < Config.ObstacleLength; i++)
        {
            this.grid[x+i][y] = Config.Tiles.WallH;
        }
    }

    /**
     * Lance la génération de plusieurs obstacles
     */
    private generateObstacles() : void
    {
        let random : number = 0;
        let x : number = 0;
        for(let u = 3; u < this.height - 3;)
        {
            random = Math.random() * 100;
            if(random <= Config.ObstacleProbability)
            {
                random = Math.random() * 100;
                if(random >= 50)
                    x = this.width - Config.ObstacleLength - 1;
                else
                    x = 1;
                this.generateObstacle(x, u);
                u += 3;
            }
            else
                u++;
        }
    }

    private generateLava() : boolean
    {
        let gen = false;
        let x = Math.floor(Math.random() * (this.height - 1) + 1);
        let y = Math.floor(Math.random() * (this.height - 1) + 1);
        let width = Math.floor(Math.random() * 3 + 1);
        let height = Math.floor(Math.random() * 3 + 1);
        for(let i =0 ; i < width ;i ++)
        {
            for(let u = 0; u< height; u++)
            {
                if(this.grid[x+i] != null && this.grid[x+i][y+u] == Config.Tiles.Ground)
                {
                    this.grid[x+i][y+u] = Config.Tiles.Lava;
                    gen = true;
                }
            }
        }
        return gen;
    }

    private generateWater(force : boolean) : void
    {
        let gen = false;
        let tries = 10;
        while(gen == false) {
            tries -= 1;
            if(tries < 0)
                return;
            let x = Math.floor(Math.random() * (this.height - 1) + 1);
            let y = Math.floor(Math.random() * (this.height - 1) + 1);
            let width = Math.floor(Math.random() * 3 + 1);
            let height = Math.floor(Math.random() * 3 + 1);
            for (let i = 0; i < width; i++) {
                for (let u = 0; u < height; u++) {
                    if (this.grid[x + i] != null && this.grid[x + i][y + u] == Config.Tiles.Ground) {
                        if( this.grid[x][y - 2] == Config.Tiles.Lava || this.grid[x][y - 3 ] == Config.Tiles.Lava ||
                            this.grid[x][y + 2] == Config.Tiles.Lava || this.grid[x][y + 3 ] == Config.Tiles.Lava ||
                            ( this.grid[x - 2] != null &&  this.grid[x -2][y] == Config.Tiles.Lava) || (this.grid[x-3] != null && this.grid[x - 3][y ] == Config.Tiles.Lava) ||
                            ( this.grid[x + 2] != null && this.grid[x + 2][y] == Config.Tiles.Lava) ||  ( this.grid[x + 3] != null && this.grid[x + 3][y] == Config.Tiles.Lava )||
                            ( this.grid[x - 2] != null &&this.grid[x - 2][y - 2] == Config.Tiles.Lava) ||  ( this.grid[x - 3] != null &&this.grid[x - 3][y - 3 ] == Config.Tiles.Lava )||
                            ( this.grid[x + 2] != null &&this.grid[x + 2][y - 2] == Config.Tiles.Lava) ||  ( this.grid[x +3] != null &&this.grid[x + 3][y - 3 ] == Config.Tiles.Lava )||
                            ( this.grid[x - 2] != null &&this.grid[x - 2][y + 2] == Config.Tiles.Lava) ||  ( this.grid[x -3] != null &&this.grid[x - 3][y + 3 ] == Config.Tiles.Lava )||
                            ( this.grid[x + 2] != null &&this.grid[x + 2][y + 2] == Config.Tiles.Lava) ||  ( this.grid[x +3] != null &&this.grid[x + 3][y + 3 ] == Config.Tiles.Lava)
                        )
                            continue;


                        this.grid[x + i][y + u] = Config.Tiles.Water;
                        gen = true;
                    }
                }
            }
        }
    }



    public destroy() : void
    {

        Program.GetInstance().App().stage.removeChild(this.container);
    }


}