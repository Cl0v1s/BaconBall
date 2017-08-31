/**
 * Created by clovis on 26/08/17.
 */
require("pixi.js");


class Program
{
    // EntryPoint
    public static Main()
    {
        Program.Initialize();
    }

    // Singleton
    private static Instance : Program;

    public static Initialize() : void
    {
        if(Program.Instance == null)
            Program.Instance = new Program();
    }

    public static GetInstance() : Program
    {
        if(Program.Instance == null)
            throw new Error("Instance must be initialized.");
        return Program.Instance;
    }

    // StateFull Object
    private app : PIXI.Application;
    private scene : Scene;
    private ready : boolean = false;

    constructor()
    {
        this.app = new PIXI.Application(Config.Width, Config.Height, {backgroundColor : 0x282d44});
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        document.getElementById("touch").appendChild(this.app.view);
        this.load();
        
        this.app.renderer.autoResize = true;
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        
    }


    private load() : void
    {
        PIXI.loader.add("assets/animations/Hero.json")
                    .add("assets/animations/Badguy.json")
                    .add("assets/animations/Pig.json")
                    .add("assets/animations/Tileset.json")
                    .add("assets/images/GUI/StatUI_background.png")
                    .add("assets/images/GUI/Heart.png")
                    .add("assets/animations/Particles.json")
                    .add("assets/images/Elements/Hole.png")
                    .load(() => { this.setup(); });
    }

    private setup() : void
    {
        console.log("Setup...");

        this.scene = new SceneGame();
        this.scene.init();
        this.app.render();
        this.ready = true;





    }

    public Ready() : boolean
    {
        return this.ready;
    }

    public App() : PIXI.Application
    {
        return this.app;
    }
}

(<any>window).Program = Program;