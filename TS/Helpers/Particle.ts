/**
 * Created by clovis on 28/08/17.
 */
class Particle
{
    private static ID : number = 0;

    private id : number;
    private sprite : PIXI.Sprite;

    private time : number;

    private directionx : number;
    private directiony : number;

    private registered : boolean = false;

    constructor(file : string, x : number, y : number, time : number,directionx : number, directiony : number, rotation? : number, scale? : number)
    {
        this.sprite = PIXI.Sprite.fromFrame(file);
        this.sprite.x = x;
        this.sprite.y = y;
        this.time = time;
        if(rotation != null)
            this.sprite.rotation.toFixed(rotation);
        if(scale != null)
            this.sprite.scale.set(scale, scale);
        this.directionx = directionx;
        this.directiony = directiony;
    }

    public register() : void
    {
        this.registered = true;
        Program.GetInstance().particles[Particle.ID] = this;
        Program.GetInstance().particleContainer.addChild(this.sprite);
        this.id = Particle.ID;
        Particle.ID ++;
    }

    public update(delta : number)
    {
        this.sprite.x += this.directionx;
        this.sprite.y += this.directiony;
        this.sprite.alpha.toFixed(this.time);
        this.time --;
        if(this.time == 0)
        {
            this.destroy();
        }
        console.log(this.time);
    }

    public destroy()
    {
        if(this.registered == false)
            return;
        Program.GetInstance().particleContainer.removeChild(this.sprite);
        Program.GetInstance().particles[this.id] = null;
        //console.log(Program.GetInstance().particles);
    }
}