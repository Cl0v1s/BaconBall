/// <reference path="EntityWalking.ts" />


class EntityPlayer extends EntityWalking
{

    private life : number = Config.PlayerLife;
    private onFire : number = 0;

    constructor(x : number, y : number)
    {
        super();
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
            this.onFire -= 1;
            this.life -= Config.FireDamage;
        }
        if(this.life <= 0)
            this.reset();
    }

    public setOnFire(value : boolean) : void
    {
        this.onFire = value ? Config.PlayerFireTime : 0;
    }

    private reset() : void
    {
        //TODO: ajouter particles
        //TODO: ajouter spawn a coté des buts
        this.life = Config.PlayerLife;
        this.sprite.x = 50;
        this.sprite.y = 50;
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