/// <reference path="EntityWalking.ts" />

class EntityPig extends EntityWalking
{

    private shootx : number = 0;
    private shooty : number = 0;

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

    update(delta: number): void {
        super.update(delta);
        if(this.shootx != 0 || this.shooty != 0)
        {
            this.vx = this.shootx;
            this.vy = this.shooty;
            this.shootx = 0;
            this.shooty = 0;
        }
        //this.IA();
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

    }

    private IA() : void
    {
        if(this.vx != 0 || this.vy != 0)
            return;
        this.vx = Math.random() * 50;
        this.vy = Math.random() * 50;
    }

    destroy(): void {
        Program.GetInstance().App().stage.removeChild(this.sprite);
    }

}