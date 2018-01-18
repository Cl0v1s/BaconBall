/// <reference path="EntityWalking.ts" />import { Sprite } from "pixi.js";




class EntityPig extends EntityWalking
{

    private shootx : number = 0;
    private shooty : number = 0;
    private hits : number = 0;

    private respawnx : number;
    private respawny : number;

    constructor(scene : Scene,x : number, y : number)
    {
        super();
        this.scene = scene;
        let frames = [];
        for(let i = 1; i < 17; i++)
        {
            frames.push(PIXI.Texture.fromFrame("pig"+i+".png"));
        }
        this.sprite = new PIXI.extras.AnimatedSprite(frames);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.animationSpeed = 0.3;
        this.sprite.play();
        //this.sprite.scale.set(1.5,1.5);


        Program.GetInstance().App().stage.addChild(this.sprite);

        this.mass = 0.90;
    }

    public reset() : void
    {
        ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame("pig1.png"), {
            x : this.sprite.x,
            y : this.sprite.y,
            life : 10,
            particleLife : 10,
            particleSpeed : 5,
            angleMax : 360,
            sizeRandom: false,
            sizeMax: null
        });
        this.sprite.x = this.respawnx;
        this.sprite.y = this.respawny;
        this.vx = 0;
        this.vy = 0;
        this.hits = 0;
        ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame("pig1.png"), {
            x : this.sprite.x,
            y : this.sprite.y,
            life : 10,
            particleLife : 10,
            particleSpeed : 5,
            angleMax : 360,
            sizeRandom: false,
            sizeMax: null
        });
    }

    public setRespawn(x : number, y : number)
    {
        this.respawnx = x;
        this.respawny = y;
    }

    private shake() : void
    {
        this.sprite.scale.set(1+this.hits/20, 1+this.hits/20);
    }


    update(delta: number): void {
        super.update(delta);
        if(this.shootx != 0 || this.shooty != 0)
        {
            this.vx = this.shootx;
            this.vy = this.shooty;
            this.shootx = 0;
            this.shooty = 0;
        }

        if(this.sprite.x < 0 ||  this.sprite.x > Config.Width || this.sprite.y < 0 || this.sprite.y > Config.Height)
            this.reset();

        this.shake();
        if(this.hits > 10)
            this.reset();
        if(this.hits > 0) {
            this.hits -= 0.5;
        }
        else
            this.hits = 0;
        
        this.IA();
    }

    public bump()
    {
        this.hits++;
    }

    private IA() : void
    {
        if(this.vx != 0 || this.vy != 0)
            return;

        if(this.sprite.y+this.sprite.height >= Program.GetInstance().App().renderer.height - 64*2)
        {
            this.vy = -20;
            return;
        }

        if(this.sprite.y <= 64*2)
        {
                this.vy = 20;
                return;
        }

        this.vx = Math.random() * 20;
        this.vy = Math.random() * 20;
        if(Math.random() * 100 <= 50)
            this.vx *= -1;
        if(Math.random() * 100 <= 50)
            this.vy *= -1;
    }

    destroy(): void {
        Program.GetInstance().App().stage.removeChild(this.sprite);
    }

}