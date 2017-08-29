/// <reference path="EntityWalking.ts" />


class EntityPlayer extends EntityWalking
{

    private life : number = Config.PlayerLife;
    private onFire : number = 0;
    private emitter : ParticleEmitter;

    constructor(scene : Scene,x : number, y : number)
    {
        super();
        this.scene = scene;
        let frames = [];
        for(let i = 1; i < 17; i++)
        {
            frames.push(PIXI.Texture.fromFrame("hero"+i+".png"));
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

    public Life() : number
    {
        return this.life;
    }

    public update(delta : number): void {
        super.update(delta);
        if(this.onFire > 0)
        {
            this.onFire -= delta;
            this.life -= Config.FireDamage * delta;
            if(this.emitter != null)
                {
            this.emitter.config.x = this.sprite.x + this.sprite.width / 2;
            this.emitter.config.y = this.sprite.y + this.sprite.height / 2;
            this.emitter.config.life = this.onFire;
                }
        }
        if(this.life <= 0)
            this.reset();
    }

    public setOnFire(value : boolean) : void
    {
        this.onFire = value ? Config.PlayerFireTime : 0;
        if(value == false && this.emitter != null)
        {
            // extinction du feu 
            this.emitter.destroy();
            this.emitter = null;
            // en faisant de la fumée
            ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame("particle2.png"), {
                x : this.sprite.x + this.sprite.width / 2,
                y : this.sprite.y + this.sprite.height / 2,
                life : 50,
                particleLife : 40,
                particleSpeed : 1,
                angleMax : 45,
                sizeRandom: true,
                sizeMax: 4
            });
        }
        if(value == false || this.emitter != null)
            return;
        this.emitter = ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame("particle1.png"), {
            x : this.sprite.x + this.sprite.width / 2,
            y : this.sprite.y + this.sprite.height / 2,
            life : Config.PlayerFireTime,
            particleLife : 25,
            particleSpeed : 2,
            angleMax : 20,
            sizeRandom: false,
            sizeMax: null
        })

    }

    private reset() : void
    {
        //TODO: ajouter particles
        //TODO: ajouter spawn a coté des buts
        if(this.emitter != null)
        {
            this.emitter.destroy();
            this.emitter = null;
        }
        this.life = Config.PlayerLife;
        this.sprite.x = 50;
        this.sprite.y = 50;
        this.onFire = 0;
        this.vx = 0;
        this.vy = 0;
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