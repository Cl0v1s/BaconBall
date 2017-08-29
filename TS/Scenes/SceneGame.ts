class SceneGame implements Scene
{
    private map : GameMap;
    private player1 : EntityPlayer;
    private player2 : EntityPlayer;
    private ball : EntityPig;
    private entities : Array<Entity> = [];
    private controllers : Array<Controller> = [];

    public init(): void {
        // Ajout de la carte en fond
        //Program.GetInstance().App().stage.addChild(PIXI.Sprite.fromImage("assets/images/Map.png"));
        Program.GetInstance().App().ticker.add((delta) => { this.update(delta) });

        this.populate();
    }

    private populate()
    {
        // Génération de la map
        this.map = new GameMap();

        // Creating players
        this.player1 = new EntityPlayer(50,50);
        this.controllers.push(new ControllerKeyboard(this.player1,  90, 83, 81,68 ));
        this.entities.push(this.player1);

        this.player2 = new EntityPlayer(50,150);
        this.controllers.push(new ControllerKeyboard(this.player2,38,40, 37, 39));
        this.entities.push(this.player2);

        // Creating pig
        this.ball = new EntityPig(100,100);
        this.entities.push(this.ball);

    }

    public update(delta : number): void {

        for(let id in Program.GetInstance().particles)
        {
            let particle = Program.GetInstance().particles[id];
            if(particle == null)
                continue;
            particle.update(delta);
        }
        this.entities.forEach((entity) => {
           let normal : any = null;
            HelperPlayer.CheckPlayerTile(this.map, entity);

           // Vérification des collisions entre entités
           this.entities.forEach((other) => {
               if(other == entity)
                   return;
               normal = HelperEntity.checkCollisionWithEntity(entity, other);
               if(normal != null)
               {
                   if(other instanceof EntityPig)
                   {
                       other.hit(entity);
                       return;
                   }
                   HelperEntity.resolveCollision(normal, entity);
               }
           });

           // Vérification des collisions avec la map
            normal = HelperEntity.checkCollisionWithMap(this.map, entity);
            if(normal != null)
                HelperEntity.resolveCollision(normal, entity);
            entity.update(delta);

        });

    }

    public destroy(): void {
        let self : SceneGame = this;
        Program.GetInstance().App().ticker.remove(self.update);
        this.map.destroy();
        this.entities.forEach((entity) => {
           entity.destroy();
        });
    }

}