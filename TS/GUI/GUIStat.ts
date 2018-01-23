import Sprite = PIXI.Sprite;
class GUIStat implements GUI
{
    private player : EntityPlayer;
    private hearts : Array<Sprite>;
    private container : PIXI.Container;
    private score : PIXI.Text;
    private lastLife : number;
    private x : number;
    private y : number;

    constructor(x : number, y : number, player : EntityPlayer, rotation : number)
    {
        this.x = x;
        this.y = y;
        this.player = player;
        this.container = new PIXI.Container();
        /*this.container.addChild(
            PIXI.Sprite.fromImage("assets/images/GUI/StatUI_background.png")
        );*/
        this.container.x = x;
        this.container.y = y;
        this.container.width = 40*Config.PlayerLife;
        this.container.height = 32;
        this.container.rotation = rotation;
        this.hearts = [];
        let sprite : PIXI.Sprite;
        for(let i = 0; i < Math.round(this.player.Life()+1); i++)
        {

            sprite = PIXI.Sprite.fromImage("assets/images/GUI/Heart.png");
            sprite.x = i*40;
            sprite.y = 0;
            this.hearts.push(sprite);
            this.container.addChild(sprite);
        }
        this.lastLife = Math.round(this.player.Life());

        let style = new PIXI.TextStyle({
            fill : "white",
            fontFamily : "Roboto",
            fontSize : "20px"
        });
        this.score = new PIXI.Text(this.player.Score()+"pts", style);
        this.score.position.x = (Math.round(this.player.Life()+1))*40;
        this.score.position.y = 5;

        this.container.addChild(this.score);
        Program.GetInstance().App().stage.addChild(this.container);
    }

    update(): void {
        if( this.lastLife != Math.round(this.player.Life()))
        {
            this.hearts.forEach((gui) => {
               gui.x = -400;
            });
            for(let i = 0; i < Math.round(this.player.Life()+1); i++)
            {
                this.hearts[i].x = i*40;
            }
            this.lastLife = Math.round(this.player.Life());
        }
        this.score.text = this.player.Score()+"pts";
    }

    destroy(): void {
        Program.GetInstance().App().stage.removeChild(this.container);
    }

}