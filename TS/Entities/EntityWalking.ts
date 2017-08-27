abstract class EntityWalking implements Entity {

    sprite: PIXI.extras.AnimatedSprite;


    vx: number = 0;
    vy: number = 0;

    mass : number = 0.75;


    constructor() {

    }

    public hit(other : Entity) : void
    {

    }

    public setVx(vx: number) {
        this.vx = vx;
    }

    public setVy(vy: number) {
        this.vy = vy;
    }

    public Vx() : number
    {
        return this.vx;
    }

    public Vy() : number
    {
        return this.vy;
    }

    update(delta: number): void {
        this.vx = this.vx > 50 ? 50 : this.vx;
        this.vy = this.vy > 50 ? 50 : this.vy;
        this.sprite.x += Config.AirDensity * this.vx;
        this.sprite.y += Config.AirDensity * this.vy;

        this.vx = (this.mass) * this.vx;
        this.vy = (this.mass) * this.vy;

        if (Math.round(this.vx) == 0)
            this.vx = 0;
        if (Math.round(this.vy) == 0)
            this.vy = 0;

        this.setFrame();
    }

    private setFrame(): void {
        if (this.vy == 0 && this.vx == 0) {
            this.sprite.stop();
            return;
        }
        else
            this.sprite.play();
        if (this.vy > 0) {
            if ((this.sprite.currentFrame > 3))
                this.sprite.gotoAndPlay(0);
        }
        else if (this.vy < 0) {
            if ((this.sprite.currentFrame < 12))
                this.sprite.gotoAndPlay(12);
        }
        else if (this.vx > 0) {
            if ((this.sprite.currentFrame < 4 || this.sprite.currentFrame > 7))
                this.sprite.gotoAndPlay(4);
        }
        else if (this.vx < 0) {
            if ((this.sprite.currentFrame < 8 || this.sprite.currentFrame > 11))
                this.sprite.gotoAndPlay(8);
        }

    }

    destroy(): void {
        throw new Error("Method not implemented.");
    }

}