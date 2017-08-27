class GameMap
{
    private container : PIXI.Container;
    public grid  : Array<Array<number>> = [];
    private width : number;
    private height : number;

    constructor()
    {
        this.container = new PIXI.Container();
        Program.GetInstance().App().stage.addChild(this.container);

        this.width = Math.floor(Program.GetInstance().App().renderer.width / Config.TileSize);
        this.height = Math.floor(Program.GetInstance().App().renderer.height / Config.TileSize);

        for(let i = 0; i < this.width ; i++)
        {
            let row : Array<number> = [];
            for(let u = 0; u < this.height; u++)
            {
                row.push(0);
            }
            this.grid.push(row);
        }


        this.generate();
    }

    private generate() : void
    {
        this.generateWalls();
        this.generateObstacles();


        this.generateSprites();
        console.log(this.grid);
    }

    private generateSprites() : void
    {
        let sprite : PIXI.Sprite;
        for(let i = 0; i < this.width ; i++)
        {
            let row : Array<number> = [];
            for(let u = 0; u < this.height; u++)
            {
                if(this.grid[i][u] == Config.Tiles.Ground)
                    continue;
                sprite = PIXI.Sprite.fromFrame("tile"+(this.grid[i][u]+1)+".png");
                sprite.x = i * Config.TileSize;
                sprite.y = u * Config.TileSize;
                this.container.addChild(sprite);
            }
            this.grid.push(row);
        }
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
                u += 2;
            }
            else
                u++;
        }
    }



    public destroy() : void
    {

        Program.GetInstance().App().stage.removeChild(this.container);
    }


}