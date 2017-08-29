/// <reference path="EntityWalking.ts" />


class EntityPig extends EntityWalking
{

    private shootx : number = 0;
    private shooty : number = 0;
    private hits : number = 0;

    constructor(x : number, y : number)
    {
        super();
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
        for(let i = 0; i < Math.random() * 10 + 20; i++) {
            let dirx = Math.random() *5;
            let diry = Math.random() *5;
            if(Math.random() * 100 <= 50)
                dirx *= -1;
            if(Math.random() * 100 <= 50)
                diry *= -1;

            let rot = Math.random() * 20;

            let p = new Particle("pig1.png", this.sprite.x + this.sprite.width / 2, this.sprite.y + this.sprite.height/2, 5, dirx, diry, rot, 0.3);
            p.register();
        }

        this.sprite.x = Program.GetInstance().App().renderer.width / 2 - this.sprite.width/2;
        this.sprite.y = Program.GetInstance().App().renderer.height / 2 - this.sprite.height / 2;
        this.vx = 0;
        this.vy = 0;
        this.hits = 0;
        for(let i = 0; i < Math.random() * 10 + 20; i++) {
            let dirx = Math.random() *5;
            let diry = Math.random() *5;
            if(Math.random() * 100 <= 50)
                dirx *= -1;
            if(Math.random() * 100 <= 50)
                diry *= -1;

            let rot = Math.random() * 20;

            let p = new Particle("pig1.png", this.sprite.x + this.sprite.width / 2, this.sprite.y + this.sprite.height/2, 5, dirx, diry, rot, 0.3);
            p.register();
        }
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