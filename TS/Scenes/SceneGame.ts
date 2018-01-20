class SceneGame implements Scene {
    private map: GameMap;
    private player1: EntityPlayer;
    private player2: EntityPlayer;
    private hole1 : EntityHole;
    private hole2 : EntityHole;
    private ball: EntityPig;
    private entities: Array < Entity > = [];
    private controllers: Array < Controller > = [];
    private guis: Array < GUI > = [];
    private emitterPool: Array < ParticleEmitter > = [];

    public init(): void {
        // Ajout de la carte en fond
        //Program.GetInstance().App().stage.addChild(PIXI.Sprite.fromImage("assets/images/Map.png"));
        Program.GetInstance().App().ticker.add((delta) => {
            this.update(delta)
        });

        this.populate();
    }

    private populate() {
        // Génération de la map
        this.map = new GameMap(this);

        // Creation des buts
        this.hole1 = new EntityHole(this,
            Math.floor(Program.GetInstance().App().renderer.width / 2 - 32),
            32,
        );
        this.entities.push(
            this.hole1
        );
        this.hole2 = new EntityHole(this,
            Math.floor(Program.GetInstance().App().renderer.width / 2 - 32),
            Math.floor(Program.GetInstance().App().renderer.height - 64),
        );
        this.entities.push(
            this.hole2
        );

        // Creating players
        this.player1 = new EntityPlayer(this, "hero", -50, -50);
        this.controllers.push(new ControllerKeyboard(this.player1, 90, 83, 81, 68));
        this.controllers.push(new ControllerTouch(this.player1, new PIXI.Rectangle(0,0,Program.GetInstance().App().renderer.width, Program.GetInstance().App().renderer.height /2)))
        this.entities.push(this.player1);

        this.player2 = new EntityPlayer(this, "badguy", -50, -150);
        this.controllers.push(new ControllerKeyboard(this.player2, 38, 40, 37, 39));
        this.controllers.push(new ControllerTouch(this.player2, new PIXI.Rectangle(0,Program.GetInstance().App().renderer.height /2,Program.GetInstance().App().renderer.width, Program.GetInstance().App().renderer.height /2)))
        this.entities.push(this.player2);

        this.hole1.setPlayer(this.player1);
        this.hole2.setPlayer(this.player2);

        // Creating pig
        this.ball = new EntityPig(
            this, 
            - 100,
            -100 
        );
        this.entities.push(this.ball);
        this.ball.setRespawn(
            Program.GetInstance().App().renderer.width / 2 - this.ball.sprite.width / 2, 
            Program.GetInstance().App().renderer.height / 2 - this.ball.sprite.height / 2
        );

        // Creating GUI
        this.guis.push(new GUIStat(0, Program.GetInstance().App().renderer.height - 32, this.player2, 0));
        this.guis.push(new GUIStat(Program.GetInstance().App().renderer.width, 32, this.player1, 3.142));

        this.player1.reset();
        this.player2.reset();
        this.ball.reset();

    }

    private updateParticleEmitters(delta): void {
        this.emitterPool.forEach((emitter) => {
            if (emitter == null)
                return;
            emitter.update(delta);
        })
    }

    public registerParticleEmitter(em: ParticleEmitter): number {
        let id: number = this.emitterPool.length;
        for (let i = 0; i < this.emitterPool.length; i++) {
            if (this.emitterPool[i] == null) {
                id = i;
                break;
            }
        }
        if (id == this.emitterPool.length)
            this.emitterPool.push(em);
        else
            this.emitterPool[id] = em;
        Program.GetInstance().App().stage.addChild(em.container);
        return id;
    }

    public unregisterParticleEmitter(id: number) {
        if (this.emitterPool[id] == null)
            return;
        Program.GetInstance().App().stage.addChild(this.emitterPool[id].container);
        this.emitterPool[id] = null;
    }

    private updateEntities(delta: number): void {
        this.entities.forEach((entity) => {
            let normal: any = null;
            HelperPlayer.CheckPlayerTile(this.map, entity);

            // Vérification des collisions entre entités
            if (entity.solid) {
                this.entities.forEach((other) => {
                    if (other == entity)
                        return;
                    normal = HelperEntity.checkCollisionWithEntity(entity, other);
                    if (normal != null) {
                        other.hit(entity);
                        if (other instanceof EntityPig || other.solid == false) 
                            return;
                        HelperEntity.resolveCollision(normal, entity);
                    }
                });
            }

            // Vérification des collisions avec la map
            try {
                normal = HelperEntity.checkCollisionWithMap(this.map, entity);
            }
            catch(e)
            {
                
            }
            if (normal != null)
            {
                console.log(normal);
                HelperEntity.resolveCollision(normal, entity);
                if(entity instanceof EntityPlayer)
                {
                    this.controllers.forEach((controller : Controller) => {
                        if(controller.player == entity)
                            controller.cancel();
                    });
                }
                entity.bump();
            }
            entity.update(delta);

        });
    }

    public but(player: EntityPlayer)
    {
        this.player1.reset();
        this.player2.reset();
    }

    public update(delta: number): void {
        this.updateEntities(delta);
        this.guis.forEach((gui) => {
            gui.update();
        });
        this.updateParticleEmitters(delta);
    }

    public destroy(): void {
        let self: SceneGame = this;
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