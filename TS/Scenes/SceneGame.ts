class SceneGame implements Scene
{
    private map : GameMap;
    private player1 : EntityPlayer;
    private player2 : EntityPlayer;
    private ball : EntityPig;
    private entities : Array<Entity> = [];
    private controllers : Array<Controller> = [];
    private guis : Array<GUI> = [];
    private emitterPool : Array<ParticleEmitter> = [];

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
        this.player1 = new EntityPlayer(this, 50,50);
        this.controllers.push(new ControllerKeyboard(this.player1,  90, 83, 81,68 ));
        this.entities.push(this.player1);

        this.player2 = new EntityPlayer(this, 50,150);
        this.controllers.push(new ControllerKeyboard(this.player2,38,40, 37, 39));
        this.entities.push(this.player2);

        // Creating pig
        this.ball = new EntityPig(this, 100,100);
        this.entities.push(this.ball);

        // Creating GUI
        this.guis.push(new GUIStat(0, Program.GetInstance().App().renderer.height - 32, this.player1, 0));
        this.guis.push(new GUIStat(Program.GetInstance().App().renderer.width, 32, this.player2, 3.142));


    }

    private updateParticleEmitters(delta) : void 
    {
        this.emitterPool.forEach((emitter) => {
            if(emitter == null)
                return;
            emitter.update(delta);
        })
    }

    public registerParticleEmitter(em : ParticleEmitter) : number
    {
        let id : number = this.emitterPool.length;
        for(let i = 0; i < this.emitterPool.length; i++)
        {
            if(this.emitterPool[i] == null)
                {
                    id = i;
                    break;                    
                }
        }
        if(id == this.emitterPool.length)
            this.emitterPool.push(em);
        else 
            this.emitterPool[id] = em;
        Program.GetInstance().App().stage.addChild(em.container);
        return id;
    }

    public unregisterParticleEmitter(id : number)
    {
        if(this.emitterPool[id] == null)
            return;
        Program.GetInstance().App().stage.addChild(this.emitterPool[id].container);
        this.emitterPool[id] = null;
    }

    public update(delta : number): void {
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
        this.guis.forEach((gui) => {
           gui.update();
        });

        this.updateParticleEmitters(delta);


    }

    public destroy(): void {
        let self : SceneGame = this;
        Program.GetInstance().App().ticker.remove(self.update);
        this.map.destroy();
        this.entities.forEach((entity) => {
           entity.destroy();
        });
        this.guis.forEach((gui) => {
           gui.destroy();
        });
    }

}