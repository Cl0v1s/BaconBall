class Particle 
{
    public sprite : PIXI.Sprite;

    private ready : boolean = true;

    private vx : number;
    private vy : number;
    private size : number = 1;

    private life : number;
    private originalLife : number;

    constructor(texture : PIXI.Texture)
    {
        this.sprite = new PIXI.Sprite(texture);
    }

    public set(x : number, y : number, life : number, speed : number, angle : number, sizeRandom : boolean, sizeMax : number)
    {
        this.sprite.x = x - this.sprite.width / 2;
        this.sprite.y = y - this.sprite.height / 2;

        this.originalLife = this.life = life;

        let radians =  angle * Math.PI / 180;
        let modifier = Math.random();
        if(Math.random() * 100 <= 50)
            modifier = -modifier;
        radians+=modifier;

        if(sizeRandom && sizeMax != null)
            this.size = Math.random() * (sizeMax - 1) + 1;

        this.vx = speed * Math.cos(radians);
        this.vy = speed * Math.sin(radians);

        this.ready = false;
    }

    public Ready() : boolean
    {
        return this.ready;
    }


    public update(delta : number)
    {
        if(this.ready == true)
            return;
        this.life -= delta;
        if(this.life > 0)
        {
                this.sprite.x += this.vx * delta;
                this.sprite.y += this.vy * delta;
                let per = this.life / this.originalLife;
                this.sprite.scale.set( this.size * per, this.size * per);
                this.sprite.alpha = per;
        }
        else 
            this.ready = true;
    }

}