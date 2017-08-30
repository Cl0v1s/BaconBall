/// <reference path="EntityWalking.ts" />


class EntityPlayer extends EntityWalking
{

    private life : number = Config.PlayerLife;
    private onFire : number = 0;
    private emitter : ParticleEmitter;
    private file : string;

    private respawnx : number = 0; 
    private respawny : number = 0;

    constructor(scene : Scene, file : string,  x : number, y : number)
    {
        super();
        this.file = file;
        this.scene = scene;
        let frames = [];
        for(let i = 1; i < 17; i++)
        {
            frames.push(PIXI.Texture.fromFrame(file+i+".png"));
        }
        this.sprite = new PIXI.extras.AnimatedSprite(frames);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.animationSpeed = 0.3;
        //this.sprite.scale.set(1.5,1.5);
        this.sprite.play();

        Program.GetInstance().App().stage.addChild(this.sprite);

        this.mass = 0.3;
    }

    public setRespawn(x : number, y : number)
    {
        this.respawnx = x;
        this.respawny = y;
    }

    public Life() : number
    {
        return this.life;
    }

    private updateEmitter()
    {
        if(this.emitter != null)
        {
            this.emitter.config.x = this.sprite.x;
            this.emitter.config.y = this.sprite.y;
            if(this.onFire > 0)
                this.emitter.config.life = this.onFire;
        }
    }

    public update(delta : number): void {
        super.update(delta);
        this.updateEmitter();
        if(this.onFire > 0)
        {
            this.onFire -= delta;
            this.life -= Config.FireDamage * delta;
        }
        if(this.life <= 0)
            this.reset();
    }

    public setEmitter(emitter : ParticleEmitter) : void 
    {
        if(this.emitter != null)
        {
            this.emitter.destroy(false);
        }
        this.emitter = emitter;
    }

    public setOnFire(value : boolean) : void
    {
        if(this.onFire > 0 && value == false)
        {
            this.setEmitter(
                ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame("particle2.png"), {
                    x : this.sprite.x,
                    y : this.sprite.y,
                    life : 10,
                    particleLife : 40,
                    particleSpeed : 1,
                    angleMax : 45,
                    sizeRandom: true,
                    sizeMax: 4,
                    zone : new PIXI.Rectangle(0,0,this.sprite.width, this.sprite.height)
            
                }, () => {
                    this.setEmitter(null);
                }));
        }
        this.onFire = value ? Config.PlayerFireTime : 0;
        if(value == false)
            return;
        this.setEmitter(
            ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame("particle1.png"), {
            x : this.sprite.x,
            y : this.sprite.y,
            life : Config.PlayerFireTime,
            particleLife : 25,
            particleSpeed : 2,
            angleMax : 20,
            sizeRandom: false,
            sizeMax: null, 
            zone : new PIXI.Rectangle(0,0,this.sprite.width, this.sprite.height)
        }));

    }

    public reset() : void
    {
        //TODO: ajouter particles
        //TODO: ajouter spawn a coté des buts
        ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame(this.file+"1.png"), {
            x : this.sprite.x + this.sprite.width / 2,
            y : this.sprite.y + this.sprite.height / 2,
            life : 10,
            particleLife : 10,
            particleSpeed : 5,
            angleMax : 360,
            sizeRandom: false,
            sizeMax: null
        });
        this.setEmitter(null);
        this.life = Config.PlayerLife;
        this.sprite.x = this.respawnx;
        this.sprite.y = this.respawny;
        this.onFire = 0;
        this.vx = 0;
        this.vy = 0;
        ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame(this.file+"1.png"), {
            x : this.sprite.x + this.sprite.width / 2,
            y : this.sprite.y + this.sprite.height / 2,
            life : 10,
            particleLife : 10,
            particleSpeed : 5,
            angleMax : 360,
            sizeRandom: false,
            sizeMax: null
        });
    }

    public destroy(): void {
        Program.GetInstance().App().stage.removeChild(this.sprite);
    }

    public moveLeft() : void
    {
        if(this.vx <= 0)
            this.vx = this.onFire > 0 ? -Config.PlayerSpeed*2 : -Config.PlayerSpeed;
    }

    public moveRight() : void
    {
        if(this.vx >= 0)
            this.vx = this.onFire > 0 ? Config.PlayerSpeed*2 : Config.PlayerSpeed;
    }

    public moveUp() : void
    {
        if(this.vy <= 0)
            this.vy = this.onFire > 0 ? -Config.PlayerSpeed*2 : -Config.PlayerSpeed;
    }

    public moveDown() : void
    {
        if(this.vy >= 0)
            this.vy = this.onFire > 0 ? Config.PlayerSpeed*2 : Config.PlayerSpeed;
    }

}