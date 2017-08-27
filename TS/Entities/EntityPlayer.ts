/// <reference path="EntityWalking.ts" />


class EntityPlayer extends EntityWalking
{

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

    public update(delta : number): void {
        super.update(delta);
    }

    public destroy(): void {
        Program.GetInstance().App().stage.removeChild(this.sprite);
    }

    public moveLeft() : void
    {
        if(this.vx <= 0)
            this.vx = -10;
    }

    public moveRight() : void
    {
        if(this.vx >= 0)
            this.vx = 10;
    }

    public moveUp() : void
    {
        if(this.vy <= 0)
            this.vy = -10;
    }

    public moveDown() : void
    {
        if(this.vy >= 0)
            this.vy = 10;
    }

}