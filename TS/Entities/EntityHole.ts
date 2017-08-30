class EntityHole implements Entity
{
    solid : boolean = false;
    sprite: Sprite;
    mass: number;
    scene: SceneGame;
    vx: number;
    vy: number;
    Vx(): number {
        return 0;
    }
    Vy(): number {
        return 0;
    }
    setVx(vx: number) {
    }
    setVy(vy: number) {
    }

    private player : EntityPlayer;

    constructor(scene : SceneGame,x : number, y : number)
    {
        this.scene = scene;
        this.sprite = PIXI.Sprite.fromImage("assets/images/Elements/Hole.png");
        this.sprite.x = x;
        this.sprite.y = y;
        //this.sprite.scale.set(1.5,1.5);

        Program.GetInstance().App().stage.addChild(this.sprite);

        this.mass = 0.90;
    }

    public setPlayer(player : EntityPlayer)
    {
        this.player = player;
        let x = this.sprite.x + this.sprite.width/2 - this.player.sprite.width / 2;
        let y = 64;
        if(this.sprite.y > Program.GetInstance().App().renderer.height / 2)
            y = Program.GetInstance().App().renderer.height - 32 *3;
        this.player.setRespawn(x,y);
    }


    update(delta: number): void {
        
    }

    public hit(other : Entity) : void
    {
        other.reset();
        if(other instanceof EntityPig)
        {
            this.scene.but(this.player);
        }
    }

    public reset() : void 
    {

    }

    destroy(): void {
        Program.GetInstance().App().stage.removeChild(this.sprite);
    }
}