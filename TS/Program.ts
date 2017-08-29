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
    public particleContainer : PIXI.particles.ParticleContainer;
    public particles : Array<Particle> = [];
    private ready : boolean = false;

    constructor()
    {
        this.app = new PIXI.Application(384, 608, {backgroundColor : 0x282d44});
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        document.body.appendChild(this.app.view);
        this.load();
    }

    private load() : void
    {
        PIXI.loader.add("assets/animations/Hero.json")
                    .add("assets/animations/Pig.json")
                    .add("assets/animations/Tileset.json")
                    .add("assets/images/GUI/StatUI_background.png")
                    .add("assets/images/GUI/Heart.png")
                    .load(() => { this.setup(); });
    }

    private setup() : void
    {
        console.log("Setup...");

        this.scene = new SceneGame();
        this.scene.init();
        this.particleContainer = new PIXI.particles.ParticleContainer();
        this.app.stage.addChild(this.particleContainer);
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