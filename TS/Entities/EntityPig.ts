/// <reference path="EntityWalking.ts" />


class EntityPig extends EntityWalking
{

    private shootx : number = 0;
    private shooty : number = 0;
    private hits : number = 0;

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

    private reset() : void
    {
        ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame("pig1.png"), {
            x : this.sprite.x + this.sprite.width / 2,
            y : this.sprite.y + this.sprite.height / 2,
            life : 10,
            particleLife : 10,
            particleSpeed : 5,
            angleMax : 360,
            sizeRandom: false,
            sizeMax: null
        });
        this.sprite.x = Program.GetInstance().App().renderer.width / 2 - this.sprite.width/2;
        this.sprite.y = Program.GetInstance().App().renderer.height / 2 - this.sprite.height / 2;
        this.vx = 0;
        this.vy = 0;
        this.hits = 0;
        ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame("pig1.png"), {
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
        this.shake();
        if(this.hits > 10)
            this.reset();
        if(this.hits > 0) {
            this.hits -= 0.3;
        }
        else
            this.hits = 0;

        this.IA();
    }

    public hit(other : Entity) : void
    {
        let mx = 0;
        let my = 0;

        if(other.Vx() != 0)
            mx = other.Vx()/Math.abs(other.Vx());
        if(other.Vy() != 0)
            my = other.Vy()/Math.abs(other.Vy());

        this.shootx = 50 * mx;
        this.shooty = 50 * my;

        this.hits += 1;

    }

    private IA() : void
    {
        if(this.vx != 0 || this.vy != 0)
            return;
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