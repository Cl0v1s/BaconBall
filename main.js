/**
 * Created by clovis on 27/08/17.
 */
class Config {
    static TilesWalkable(tile) {
        switch (tile) {
            default:
                return false;
            case Config.Tiles.Ground:
            case Config.Tiles.Lava:
            case Config.Tiles.Water:
                return true;
        }
    }
}
Config.Width = 384;
Config.Height = 608;
Config.AirDensity = 0.3;
Config.PlayerLife = 3;
Config.PlayerFireTime = 500;
Config.PlayerSpeed = 10;
Config.FireDamage = 0.01;
Config.TileSize = 32;
Config.ObstacleProbability = 30; //%
Config.ObstacleLength = 3;
Config.Tiles = {
    "Ground": 0,
    "Wall": 1,
    "WallH": 2,
    "WallV": 3,
    "Weed": 12,
    "Rock": 13,
    "Lava": 25,
    "LavaTR": 15,
    "LavaT": 16,
    "LavaR": 17,
    "LavaTL": 18,
    "LavaBR": 19,
    "LavaBL": 20,
    "LavaB": 21,
    "LavaL": 22,
    "Water": 26,
    "WaterTR": 4,
    "WaterT": 5,
    "WaterR": 6,
    "WaterTL": 7,
    "WaterBR": 8,
    "WaterBL": 9,
    "WaterB": 10,
    "WaterL": 11
};
class GameMap {
    constructor(scene) {
        this.grid = [];
        this.scene = scene;
        this.container = new PIXI.Container();
        Program.GetInstance().App().stage.addChild(this.container);
        this.width = Math.floor(Program.GetInstance().App().renderer.width / Config.TileSize);
        this.height = Math.floor(Program.GetInstance().App().renderer.height / Config.TileSize);
        for (let i = 0; i < this.width; i++) {
            let row = [];
            for (let u = 0; u < this.height; u++) {
                row.push(Config.Tiles.Ground);
            }
            this.grid.push(row);
        }
        this.generate();
    }
    generate() {
        this.generateWalls();
        this.generateObstacles();
        let lava = this.generateLava();
        this.generateWater(lava);
        this.generateSprites();
    }
    generateSprites() {
        let sprite;
        for (let i = 0; i < this.width; i++) {
            let row = [];
            for (let u = 0; u < this.height; u++) {
                let tile = (this.grid[i][u]);
                // Adoucissement des murs
                //tile = this.polishWalls(tile, i, u);
                // Adoucissement de la lave
                tile = this.polishLava(tile, i, u);
                // Adoucissement de l'eau
                tile = this.polishWater(tile, i, u);
                // Variation du sol
                tile = this.randomizeGround(tile, i, u);
                if (tile == Config.Tiles.Ground)
                    continue;
                this.createEmitter(tile, i, u);
                sprite = PIXI.Sprite.fromFrame("tile" + (tile + 1) + ".png");
                sprite.x = i * Config.TileSize;
                sprite.y = u * Config.TileSize;
                this.container.addChild(sprite);
            }
            this.grid.push(row);
        }
    }
    createEmitter(tile, x, y) {
        if (tile == Config.Tiles.Lava) {
            ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame("particle3.png"), {
                x: x * Config.TileSize,
                y: y * Config.TileSize,
                life: Infinity,
                particleLife: 30,
                particleSpeed: 0.1,
                angleMax: 0,
                sizeRandom: true,
                sizeMax: 3,
                frequency: 20,
                zone: new PIXI.Rectangle(0, 0, Config.TileSize, Config.TileSize)
            });
        }
    }
    randomizeGround(tile, x, y) {
        if (tile != Config.Tiles.Ground)
            return tile;
        if (Math.random() * 100 <= 10)
            tile = Config.Tiles.Weed;
        else if (Math.random() * 100 <= 30)
            tile = Config.Tiles.Rock;
        return tile;
    }
    polishWalls(tile, x, y) {
        if (tile == Config.Tiles.WallH &&
            (this.grid[x + 1] != null && (this.grid[x + 1][y] != Config.Tiles.WallH && this.grid[x + 1][y] != Config.Tiles.WallV) ||
                this.grid[x - 1] != null && (this.grid[x - 1][y] != Config.Tiles.WallH && this.grid[x - 1][y] != Config.Tiles.WallV))) {
            tile = Config.Tiles.Wall;
        }
        return tile;
    }
    polishWater(tile, x, y) {
        if (tile != Config.Tiles.Ground)
            return tile;
        if (this.grid[x] != null && this.grid[x][y + 1] == Config.Tiles.Water)
            return Config.Tiles.WaterT;
        if (this.grid[x - 1] != null && this.grid[x - 1][y + 1] == Config.Tiles.Water) {
            if (this.grid[x - 1][y] != Config.Tiles.Water)
                return Config.Tiles.WaterTR;
            else
                return Config.Tiles.WaterR;
        }
        if (this.grid[x + 1] != null && this.grid[x + 1][y + 1] == Config.Tiles.Water) {
            if (this.grid[x + 1][y] != Config.Tiles.Water)
                return Config.Tiles.WaterTL;
            else
                return Config.Tiles.WaterL;
        }
        if (this.grid[x - 1] != null && this.grid[x - 1][y] == Config.Tiles.Water)
            return Config.Tiles.WaterR;
        if (this.grid[x + 1] != null && this.grid[x + 1][y] == Config.Tiles.Water)
            return Config.Tiles.WaterL;
        if (this.grid[x] != null && this.grid[x][y - 1] == Config.Tiles.Water)
            return Config.Tiles.WaterB;
        if (this.grid[x - 1] != null && this.grid[x - 1][y - 1] == Config.Tiles.Water)
            return Config.Tiles.WaterBR;
        if (this.grid[x + 1] != null && this.grid[x + 1][y - 1] == Config.Tiles.Water)
            return Config.Tiles.WaterBL;
        return tile;
    }
    polishLava(tile, x, y) {
        if (tile != Config.Tiles.Ground)
            return tile;
        if (this.grid[x] != null && this.grid[x][y + 1] == Config.Tiles.Lava)
            return Config.Tiles.LavaT;
        if (this.grid[x - 1] != null && this.grid[x - 1][y + 1] == Config.Tiles.Lava) {
            if (this.grid[x - 1][y] != Config.Tiles.Lava)
                return Config.Tiles.LavaTR;
            else
                return Config.Tiles.LavaR;
        }
        if (this.grid[x + 1] != null && this.grid[x + 1][y + 1] == Config.Tiles.Lava) {
            if (this.grid[x + 1][y] != Config.Tiles.Lava)
                return Config.Tiles.LavaTL;
            else
                return Config.Tiles.LavaL;
        }
        if (this.grid[x - 1] != null && this.grid[x - 1][y] == Config.Tiles.Lava)
            return Config.Tiles.LavaR;
        if (this.grid[x + 1] != null && this.grid[x + 1][y] == Config.Tiles.Lava)
            return Config.Tiles.LavaL;
        if (this.grid[x] != null && this.grid[x][y - 1] == Config.Tiles.Lava)
            return Config.Tiles.LavaB;
        if (this.grid[x - 1] != null && this.grid[x - 1][y - 1] == Config.Tiles.Lava)
            return Config.Tiles.LavaBR;
        if (this.grid[x + 1] != null && this.grid[x + 1][y - 1] == Config.Tiles.Lava)
            return Config.Tiles.LavaBL;
        return tile;
    }
    generateWalls() {
        for (let i = 0; i < this.width; i++) {
            this.grid[i][0] = Config.Tiles.WallH;
            this.grid[i][this.height - 1] = Config.Tiles.WallH;
        }
        for (let u = 0; u < this.height - 1; u++) {
            this.grid[0][u] = Config.Tiles.WallV;
            this.grid[this.width - 1][u] = Config.Tiles.WallV;
        }
    }
    /*
    Génère un obstacle horizontal
     */
    generateObstacle(x, y) {
        for (let i = 0; i < Config.ObstacleLength; i++) {
            this.grid[x + i][y] = Config.Tiles.WallH;
        }
    }
    /**
     * Lance la génération de plusieurs obstacles
     */
    generateObstacles() {
        let random = 0;
        let x = 0;
        for (let u = 3; u < this.height - 3;) {
            random = Math.random() * 100;
            if (random <= Config.ObstacleProbability) {
                random = Math.random() * 100;
                if (random >= 50)
                    x = this.width - Config.ObstacleLength - 1;
                else
                    x = 1;
                this.generateObstacle(x, u);
                u += 3;
            }
            else
                u++;
        }
    }
    generateLava() {
        let gen = false;
        let x = Math.floor(Math.random() * (this.height - 1) + 1);
        let y = Math.floor(Math.random() * (this.height - 7) + 3);
        let width = Math.floor(Math.random() * 3 + 1);
        let height = Math.floor(Math.random() * 3 + 1);
        for (let i = 0; i < width; i++) {
            for (let u = 0; u < height; u++) {
                if (this.grid[x + i] != null && this.grid[x + i][y + u] == Config.Tiles.Ground) {
                    this.grid[x + i][y + u] = Config.Tiles.Lava;
                    gen = true;
                }
            }
        }
        return gen;
    }
    generateWater(force) {
        let gen = false;
        let tries = 10;
        while (gen == false) {
            tries -= 1;
            if (tries < 0)
                return;
            let x = Math.floor(Math.random() * (this.height - 1) + 1);
            let y = Math.floor(Math.random() * (this.height - 7) + 3);
            let width = Math.floor(Math.random() * 3 + 1);
            let height = Math.floor(Math.random() * 3 + 1);
            for (let i = 0; i < width; i++) {
                for (let u = 0; u < height; u++) {
                    if (this.grid[x + i] != null && this.grid[x + i][y + u] == Config.Tiles.Ground) {
                        if (this.grid[x][y - 2] == Config.Tiles.Lava || this.grid[x][y - 3] == Config.Tiles.Lava ||
                            this.grid[x][y + 2] == Config.Tiles.Lava || this.grid[x][y + 3] == Config.Tiles.Lava ||
                            (this.grid[x - 2] != null && this.grid[x - 2][y] == Config.Tiles.Lava) || (this.grid[x - 3] != null && this.grid[x - 3][y] == Config.Tiles.Lava) ||
                            (this.grid[x + 2] != null && this.grid[x + 2][y] == Config.Tiles.Lava) || (this.grid[x + 3] != null && this.grid[x + 3][y] == Config.Tiles.Lava) ||
                            (this.grid[x - 2] != null && this.grid[x - 2][y - 2] == Config.Tiles.Lava) || (this.grid[x - 3] != null && this.grid[x - 3][y - 3] == Config.Tiles.Lava) ||
                            (this.grid[x + 2] != null && this.grid[x + 2][y - 2] == Config.Tiles.Lava) || (this.grid[x + 3] != null && this.grid[x + 3][y - 3] == Config.Tiles.Lava) ||
                            (this.grid[x - 2] != null && this.grid[x - 2][y + 2] == Config.Tiles.Lava) || (this.grid[x - 3] != null && this.grid[x - 3][y + 3] == Config.Tiles.Lava) ||
                            (this.grid[x + 2] != null && this.grid[x + 2][y + 2] == Config.Tiles.Lava) || (this.grid[x + 3] != null && this.grid[x + 3][y + 3] == Config.Tiles.Lava))
                            continue;
                        this.grid[x + i][y + u] = Config.Tiles.Water;
                        gen = true;
                    }
                }
            }
        }
    }
    destroy() {
        Program.GetInstance().App().stage.removeChild(this.container);
    }
}
/**
 * Created by clovis on 26/08/17.
 */
require("pixi.js");
class Program {
    constructor() {
        this.ready = false;
        this.app = new PIXI.Application(Config.Width, Config.Height, { backgroundColor: 0x282d44 });
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        document.getElementById("touch").appendChild(this.app.view);
        this.app.renderer.autoResize = true;
        this.app.renderer.resize(Math.floor(window.innerWidth / Config.TileSize) * Config.TileSize, Math.floor(window.innerHeight / Config.TileSize) * Config.TileSize);
        this.load();
    }
    // EntryPoint
    static Main() {
        Program.Initialize();
    }
    static Initialize() {
        if (Program.Instance == null)
            Program.Instance = new Program();
    }
    static GetInstance() {
        if (Program.Instance == null)
            throw new Error("Instance must be initialized.");
        return Program.Instance;
    }
    load() {
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
    setup() {
        console.log("Setup...");
        this.scene = new SceneGame();
        this.scene.init();
        this.app.render();
        this.ready = true;
    }
    Ready() {
        return this.ready;
    }
    App() {
        return this.app;
    }
}
window.Program = Program;
/**
 * Created by clovis on 26/08/17.
 */
class ControllerKeyboard {
    constructor(player, upcode, downcode, leftcode, rightcode) {
        this.player = player;
        let left = this.left.bind(this);
        let right = this.right.bind(this);
        let up = this.up.bind(this);
        let down = this.down.bind(this);
        ControllerKeyboard.keyboard(leftcode).press = () => {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.left();
            }, 20);
        };
        ControllerKeyboard.keyboard(upcode).press = () => {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.up();
            }, 20);
        };
        ControllerKeyboard.keyboard(rightcode).press = () => {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.right();
            }, 20);
        };
        ControllerKeyboard.keyboard(downcode).press = () => {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.down();
            }, 20);
        };
        /*ControllerKeyboard.keyboard(leftcode).release = () => {
        };
        ControllerKeyboard.keyboard(upcode).release = () => {

        };
        ControllerKeyboard.keyboard(rightcode).release = () => {

        };
        ControllerKeyboard.keyboard(downcode).release = () => {
        };*/
    }
    static keyboard(keyCode) {
        var key = {};
        key.code = keyCode;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;
        //The `downHandler`
        key.downHandler = function (event) {
            if (event.keyCode === key.code) {
                if (key.isUp && key.press)
                    key.press();
                key.isDown = true;
                key.isUp = false;
            }
            event.preventDefault();
        };
        //The `upHandler`
        key.upHandler = function (event) {
            if (event.keyCode === key.code) {
                if (key.isDown && key.release)
                    key.release();
                key.isDown = false;
                key.isUp = true;
            }
            event.preventDefault();
        };
        //Attach event listeners
        window.addEventListener("keydown", key.downHandler.bind(key), false);
        window.addEventListener("keyup", key.upHandler.bind(key), false);
        return key;
    }
    left() {
        this.player.moveLeft();
    }
    right() {
        this.player.moveRight();
    }
    up() {
        this.player.moveUp();
    }
    down() {
        this.player.moveDown();
    }
    action() {
    }
    cancel() {
        clearInterval(this.timer);
        this.timer = null;
    }
}
class ControllerTouch {
    constructor(player, bounds) {
        this.player = player;
        this.bounds = bounds;
        document.getElementById("touch").addEventListener("touchstart", (e) => {
            for (let i = 0; i < e.changedTouches.length; i++)
                this.start(e.changedTouches[i]);
        }, true);
        document.getElementById("touch").addEventListener("touchmove", (e) => {
            for (let i = 0; i < e.changedTouches.length; i++)
                this.move(e.changedTouches[i]);
        }, true);
        /*document.getElementById("touch").addEventListener("touchend", (e) => {
            for(let i = 0; i < e.changedTouches.length; i++)
                this.end(e.changedTouches[i]);
        }, true);
        document.getElementById("touch").addEventListener("touchcancel", (e) => {
            for(let i = 0; i < e.changedTouches.length; i++)
                this.end(e.changedTouches[i]);
        }, true);*/
    }
    start(e) {
        let coords = {
            x: e.clientX,
            y: e.clientY
        };
        if (!(coords.x >= this.bounds.x && coords.x <= this.bounds.x + this.bounds.width && coords.y >= this.bounds.y && coords.y <= this.bounds.y + this.bounds.height))
            return;
        this.touch = e;
    }
    move(e) {
        if (this.touch == null || e.identifier != this.touch.identifier)
            return;
        let coords = {
            x: e.clientX - this.touch.clientX,
            y: e.clientY - this.touch.clientY
        };
        console.log(coords);
        if (Math.abs(coords.x) > Math.abs(coords.y)) {
            if (coords.x < 0)
                this.left();
            else if (coords.x > 0)
                this.right();
        }
        else if (Math.abs(coords.x) < Math.abs(coords.y)) {
            if (coords.y < 0)
                this.up();
            else if (coords.y > 0)
                this.down();
            /*console.log(this.bounds.y >= Program.GetInstance().App().renderer.height / 2);
            if(this.bounds.y >= Program.GetInstance().App().renderer.height / 2)
            {
                if(coords.y < 0)
                    this.up();
                else if(coords.y > 0)
                    this.down();
            }
            else
                {
                    if(coords.y > 0)
                        this.up();
                    else if(coords.y < 0)
                        this.down();
                }*/
        }
        /*   {
               this.up();
               return;
           }
           {
               this.down();
               return;
           }
           {
              this.right();
              return;
           }
           {
               this.left();
               return;
           }*/
    }
    end(e = null) {
        console.log(e);
        if (e != null && (this.touch != null && this.touch.identifier != e.identifier))
            return;
        this.touch = null;
        clearInterval(this.timer);
        this.timer = null;
    }
    left() {
        this.end();
        this.timer = setInterval(() => {
            this.player.moveLeft();
        }, 20);
    }
    right() {
        this.end();
        this.timer = setInterval(() => {
            this.player.moveRight();
        }, 20);
    }
    up() {
        this.end();
        this.timer = setInterval(() => {
            this.player.moveUp();
        }, 20);
    }
    down() {
        this.end();
        this.timer = setInterval(() => {
            this.player.moveDown();
        }, 20);
    }
    action() {
    }
    cancel() {
        clearInterval(this.timer);
        this.timer = null;
    }
}
class EntityHole {
    constructor(scene, x, y) {
        this.solid = false;
        this.scene = scene;
        this.sprite = PIXI.Sprite.fromImage("assets/images/Elements/Hole.png");
        this.sprite.x = x;
        this.sprite.y = y;
        //this.sprite.scale.set(1.5,1.5);
        Program.GetInstance().App().stage.addChild(this.sprite);
        this.mass = 0.90;
    }
    Vx() {
        return 0;
    }
    Vy() {
        return 0;
    }
    setVx(vx) {
    }
    setVy(vy) {
    }
    setPlayer(player) {
        this.player = player;
        let x = this.sprite.x + this.sprite.width / 2 - this.player.sprite.width / 2;
        let y = 64;
        if (this.sprite.y > Program.GetInstance().App().renderer.height / 2)
            y = Program.GetInstance().App().renderer.height - 32 * 3;
        this.player.setRespawn(x, y);
    }
    update(delta) {
    }
    hit(other) {
        other.reset();
        if (other instanceof EntityPig) {
            this.scene.but(this.player);
        }
    }
    bump() {
    }
    reset() {
    }
    destroy() {
        Program.GetInstance().App().stage.removeChild(this.sprite);
    }
}
class EntityWalking {
    constructor() {
        this.solid = true;
        this.vx = 0;
        this.vy = 0;
        this.mass = 0.75;
    }
    reset() {
    }
    hit(other) {
    }
    setVx(vx) {
        this.vx = vx;
    }
    setVy(vy) {
        this.vy = vy;
    }
    Vx() {
        return this.vx;
    }
    Vy() {
        return this.vy;
    }
    update(delta) {
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
    bump() {
    }
    setFrame() {
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
    destroy() {
        throw new Error("Method not implemented.");
    }
}
/// <reference path="EntityWalking.ts" />import { Sprite } from "pixi.js";
class EntityPig extends EntityWalking {
    constructor(scene, x, y) {
        super();
        this.shootx = 0;
        this.shooty = 0;
        this.hits = 0;
        this.scene = scene;
        let frames = [];
        for (let i = 1; i < 17; i++) {
            frames.push(PIXI.Texture.fromFrame("pig" + i + ".png"));
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
    reset() {
        ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame("pig1.png"), {
            x: this.sprite.x,
            y: this.sprite.y,
            life: 10,
            particleLife: 10,
            particleSpeed: 5,
            angleMax: 360,
            sizeRandom: false,
            sizeMax: null
        });
        this.sprite.x = this.respawnx;
        this.sprite.y = this.respawny;
        this.vx = 0;
        this.vy = 0;
        this.hits = 0;
        ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame("pig1.png"), {
            x: this.sprite.x,
            y: this.sprite.y,
            life: 10,
            particleLife: 10,
            particleSpeed: 5,
            angleMax: 360,
            sizeRandom: false,
            sizeMax: null
        });
    }
    setRespawn(x, y) {
        this.respawnx = x;
        this.respawny = y;
    }
    shake() {
        this.sprite.scale.set(1 + this.hits / 20, 1 + this.hits / 20);
    }
    update(delta) {
        super.update(delta);
        if (this.shootx != 0 || this.shooty != 0) {
            this.vx = this.shootx;
            this.vy = this.shooty;
            this.shootx = 0;
            this.shooty = 0;
        }
        if (this.sprite.x < 0 || this.sprite.x > Config.Width || this.sprite.y < 0 || this.sprite.y > Config.Height)
            this.reset();
        this.shake();
        if (this.hits > 10)
            this.reset();
        if (this.hits > 0) {
            this.hits -= 0.5;
        }
        else
            this.hits = 0;
        //this.IA();
    }
    bump() {
        this.hits++;
    }
    IA() {
        if (this.vx != 0 || this.vy != 0)
            return;
        if (this.sprite.y + this.sprite.height >= Program.GetInstance().App().renderer.height - 64 * 2) {
            this.vy = -20;
            return;
        }
        if (this.sprite.y <= 64 * 2) {
            this.vy = 20;
            return;
        }
        this.vx = Math.random() * 20;
        this.vy = Math.random() * 20;
        if (Math.random() * 100 <= 50)
            this.vx *= -1;
        if (Math.random() * 100 <= 50)
            this.vy *= -1;
    }
    destroy() {
        Program.GetInstance().App().stage.removeChild(this.sprite);
    }
}
/// <reference path="EntityWalking.ts" />
class EntityPlayer extends EntityWalking {
    constructor(scene, file, x, y) {
        super();
        this.life = Config.PlayerLife;
        this.onFire = 0;
        this.respawnx = 0;
        this.respawny = 0;
        this.nextAction = null;
        this.carrying = null;
        this.file = file;
        this.scene = scene;
        let frames = [];
        for (let i = 1; i < 17; i++) {
            frames.push(PIXI.Texture.fromFrame(file + i + ".png"));
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
    setRespawn(x, y) {
        this.respawnx = x;
        this.respawny = y;
    }
    Life() {
        return this.life;
    }
    updateEmitter() {
        if (this.emitter != null) {
            this.emitter.config.x = this.sprite.x;
            this.emitter.config.y = this.sprite.y;
            if (this.onFire > 0)
                this.emitter.config.life = this.onFire;
        }
    }
    update(delta) {
        super.update(delta);
        this.updateEmitter();
        if (this.onFire > 0) {
            this.onFire -= delta;
            this.life -= Config.FireDamage * delta;
        }
        if (this.life <= 0)
            this.reset();
        if (this.nextAction != null) {
            this.nextAction.bind(this)();
            this.nextAction = null;
        }
        this.updateCarrying();
    }
    hit(other) {
        if (other instanceof EntityPig)
            this.carry(other);
    }
    updateCarrying() {
        if (this.carrying == null)
            return;
        this.carrying.sprite.x = this.sprite.x;
        this.carrying.sprite.y = this.sprite.y - this.carrying.sprite.height / 2;
        this.carrying.setVx(0);
        this.carrying.setVy(0);
    }
    carry(other) {
        this.carrying = other;
        this.carrying.solid = false;
    }
    throw(vx, vy) {
        if (vx > 0) {
            this.carrying.sprite.x = this.sprite.x + this.sprite.width;
        }
        if (vx < 0) {
            this.carrying.sprite.x = this.sprite.x - this.carrying.sprite.width;
        }
        if (vy > 0) {
            this.carrying.sprite.y = this.sprite.y + this.sprite.height;
        }
        if (vy < 0) {
            this.carrying.sprite.y = this.sprite.y - this.carrying.sprite.height;
        }
        this.carrying.setVx(vx);
        this.carrying.setVy(vy);
        this.carrying.solid = true;
        this.carrying = null;
    }
    setEmitter(emitter) {
        if (this.emitter != null) {
            this.emitter.destroy(false);
        }
        this.emitter = emitter;
    }
    setOnFire(value) {
        if (this.onFire > 0 && value == false) {
            this.setEmitter(ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame("particle2.png"), {
                x: this.sprite.x,
                y: this.sprite.y,
                life: 10,
                particleLife: 40,
                particleSpeed: 1,
                angleMax: 45,
                sizeRandom: true,
                sizeMax: 4,
                zone: new PIXI.Rectangle(0, 0, this.sprite.width, this.sprite.height)
            }, () => {
                this.setEmitter(null);
            }));
        }
        this.onFire = value ? Config.PlayerFireTime : 0;
        if (value == false)
            return;
        this.setEmitter(ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame("particle1.png"), {
            x: this.sprite.x,
            y: this.sprite.y,
            life: Config.PlayerFireTime,
            particleLife: 25,
            particleSpeed: 2,
            angleMax: 20,
            sizeRandom: false,
            sizeMax: null,
            zone: new PIXI.Rectangle(0, 0, this.sprite.width, this.sprite.height)
        }));
    }
    reset() {
        //TODO: ajouter particles
        //TODO: ajouter spawn a coté des buts
        ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame(this.file + "1.png"), {
            x: this.sprite.x,
            y: this.sprite.y,
            life: 10,
            particleLife: 10,
            particleSpeed: 5,
            angleMax: 360,
            sizeRandom: false,
            sizeMax: null
        });
        this.setEmitter(null);
        this.life = Config.PlayerLife;
        this.sprite.x = this.respawnx;
        this.sprite.y = this.respawny;
        this.onFire = 0;
        this.vx = 0;
        this.vy = 0;
        ParticleEmitter.create(this.scene, PIXI.Texture.fromFrame(this.file + "1.png"), {
            x: this.sprite.x,
            y: this.sprite.y,
            life: 10,
            particleLife: 10,
            particleSpeed: 5,
            angleMax: 360,
            sizeRandom: false,
            sizeMax: null
        });
    }
    destroy() {
        Program.GetInstance().App().stage.removeChild(this.sprite);
    }
    moveLeft() {
        if (this.carrying != null) {
            this.nextAction = function () {
                this.throw(-Config.PlayerSpeed * 5, 0);
            };
            return;
        }
        this.nextAction = function () {
            if (this.vx <= 0)
                this.vx = this.onFire > 0 ? -Config.PlayerSpeed * 2 : -Config.PlayerSpeed;
        };
    }
    moveRight() {
        if (this.carrying != null) {
            this.nextAction = function () {
                this.throw(Config.PlayerSpeed * 5, 0);
            };
            return;
        }
        this.nextAction = function () {
            if (this.vx >= 0)
                this.vx = this.onFire > 0 ? Config.PlayerSpeed * 2 : Config.PlayerSpeed;
        };
    }
    moveUp() {
        if (this.carrying != null) {
            this.nextAction = function () {
                this.throw(0, -Config.PlayerSpeed * 5);
            };
            return;
        }
        this.nextAction = function () {
            if (this.vy <= 0)
                this.vy = this.onFire > 0 ? -Config.PlayerSpeed * 2 : -Config.PlayerSpeed;
        };
    }
    moveDown() {
        if (this.carrying != null) {
            this.nextAction = function () {
                this.throw(0, Config.PlayerSpeed * 5);
            };
            return;
        }
        this.nextAction = function () {
            if (this.vy >= 0)
                this.vy = this.onFire > 0 ? Config.PlayerSpeed * 2 : Config.PlayerSpeed;
        };
    }
}
var Sprite = PIXI.Sprite;
class GUIStat {
    constructor(x, y, player, rotation) {
        this.x = x;
        this.y = y;
        this.player = player;
        this.container = new PIXI.Container();
        /*this.container.addChild(
            PIXI.Sprite.fromImage("assets/images/GUI/StatUI_background.png")
        );*/
        this.container.x = x;
        this.container.y = y;
        this.container.width = 40 * Config.PlayerLife;
        this.container.height = 32;
        this.container.rotation = rotation;
        this.hearts = [];
        let sprite;
        for (let i = 0; i < Math.round(this.player.Life() + 1); i++) {
            sprite = PIXI.Sprite.fromImage("assets/images/GUI/Heart.png");
            sprite.x = i * 40;
            sprite.y = 0;
            this.hearts.push(sprite);
            this.container.addChild(sprite);
        }
        this.lastLife = Math.round(this.player.Life());
        Program.GetInstance().App().stage.addChild(this.container);
    }
    update() {
        if (this.lastLife != Math.round(this.player.Life())) {
            this.hearts.forEach((gui) => {
                gui.x = -400;
            });
            for (let i = 0; i < Math.round(this.player.Life() + 1); i++) {
                this.hearts[i].x = i * 40;
            }
            this.lastLife = Math.round(this.player.Life());
        }
    }
    destroy() {
        Program.GetInstance().App().stage.removeChild(this.container);
    }
}
class Vector2 {
    static min(v1, v2) {
        if (v1.scalar() < v2.scalar())
            return v1;
        return v2;
    }
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    substract(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    multiply(other) {
        return new Vector2(this.x * other.x, this.y * other.y);
    }
    dotproduct(other) {
        return this.x * other.x + this.y * other.y;
    }
    scalar() {
        return this.x + this.y;
    }
}
class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    translate(vec) {
        return new Rectangle(this.x + vec.x, this.y + vec.y, this.width, this.height);
    }
    intersect(rec) {
        if (!(this.x < rec.x + rec.width &&
            this.x + this.width > rec.x &&
            this.y < rec.y + rec.height &&
            this.height + this.y > rec.y)) {
            return null;
        }
        let result = new Rectangle();
        if (this.x < rec.x) {
            result.x = rec.x;
            result.width = this.x + this.width - rec.x;
        }
        else {
            result.x = this.x;
            result.width = rec.x + rec.width - this.x;
        }
        if (this.y < rec.y) {
            result.y = rec.y;
            result.height = this.y + this.height - rec.y;
        }
        else {
            result.y = this.y;
            result.height = rec.y + rec.height - this.y;
        }
        return result;
    }
}
class HelperEntity {
    /*
        Vérifie la collision entre deux entitées
     */
    static checkCollisionWithMap(map, entity) {
        let results = [];
        let rectangle1 = new Rectangle(entity.sprite.x + Config.AirDensity * entity.Vx(), entity.sprite.y + Config.AirDensity * entity.Vy(), entity.sprite.width, entity.sprite.height);
        let points = [];
        points.push(new Vector2(entity.sprite.x, entity.sprite.y));
        points.push(new Vector2(entity.sprite.x + entity.sprite.width, entity.sprite.y + entity.sprite.height));
        points.push(new Vector2(entity.sprite.x + entity.sprite.width, entity.sprite.y));
        points.push(new Vector2(entity.sprite.x, entity.sprite.y + entity.sprite.height));
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
            if (Config.TilesWalkable(map.grid[Math.floor(point.x / Config.TileSize)][Math.floor(point.y / Config.TileSize)])) {
                continue;
            }
            let rectangle2 = new Rectangle(Math.floor(point.x / Config.TileSize) * Config.TileSize, Math.floor(point.y / Config.TileSize) * Config.TileSize, Config.TileSize, Config.TileSize);
            let result = HelperEntity.checkCollision(rectangle1, rectangle2);
            if (result != null)
                results.push(result);
        }
        if (results.length <= 0)
            return null;
        let result = new Vector2(0, 0);
        results.forEach((r) => {
            result = result.add(r);
        });
        if (result.x != 0 && Math.abs(result.x) < 1) {
            if (result.x < 0)
                result.x = -1;
            if (result.x > 0)
                result.x = 1;
        }
        if (result.y != 0 && Math.abs(result.y) < 1) {
            if (result.y < 0)
                result.y = -1;
            if (result.y > 0)
                result.y = 1;
        }
        return result;
    }
    static checkCollisionWithEntity(entity1, entity2) {
        let rectangle1 = new Rectangle(entity1.sprite.x + Config.AirDensity * entity1.Vx(), entity1.sprite.y + Config.AirDensity * entity1.Vy(), entity1.sprite.width, entity1.sprite.height);
        let rectangle2 = new Rectangle(entity2.sprite.x + Config.AirDensity * entity2.Vx(), entity2.sprite.y + Config.AirDensity * entity2.Vy(), entity2.sprite.width, entity2.sprite.height);
        return this.checkCollision(rectangle1, rectangle2);
    }
    static checkCollision(rectangle1, rectangle2) {
        let intersection = rectangle1.intersect(rectangle2);
        if (intersection == null)
            return null;
        let normal = new Vector2(0, 0);
        if (intersection.width < intersection.height)
            normal.x = intersection.width;
        else
            normal.y = intersection.height;
        if (rectangle1.x < rectangle2.x)
            normal.x = -normal.x;
        if (rectangle1.y < rectangle2.y)
            normal.y = -normal.y;
        return normal;
    }
    static resolveCollision(normal, entity1, entity2) {
        entity1.setVy(normal.y);
        entity1.setVx(normal.x);
        if (entity2 != null) {
            entity2.setVy(-normal.y);
            entity2.setVx(-normal.x);
        }
    }
}
/**
 * Created by clovis on 29/08/17.
 */
class HelperPlayer {
    static CheckPlayerTile(map, entity) {
        if (entity instanceof EntityPlayer == false)
            return;
        let player = entity;
        let x = Math.floor((entity.sprite.x + entity.sprite.width / 2) / Config.TileSize);
        let y = Math.floor((entity.sprite.y + entity.sprite.height) / Config.TileSize);
        if (map.grid[x][y] == Config.Tiles.Lava)
            player.setOnFire(true);
        else if (map.grid[x][y] == Config.Tiles.Water)
            player.setOnFire(false);
    }
}
class Particle {
    constructor(texture) {
        this.ready = true;
        this.size = 1;
        this.sprite = new PIXI.Sprite(texture);
    }
    set(x, y, life, speed, angle, sizeRandom, sizeMax) {
        this.sprite.x = x;
        this.sprite.y = y;
        this.originalLife = this.life = life;
        let radians = angle * Math.PI / 180;
        let modifier = Math.random();
        if (Math.random() * 100 <= 50)
            modifier = -modifier;
        radians += modifier;
        if (sizeRandom && sizeMax != null)
            this.size = Math.random() * (sizeMax - 1) + 1;
        this.vx = speed * Math.cos(radians);
        this.vy = speed * Math.sin(radians);
        this.ready = false;
    }
    Ready() {
        return this.ready;
    }
    update(delta) {
        if (this.ready == true)
            return;
        this.life -= delta;
        if (this.life > 0) {
            this.sprite.x += this.vx * delta;
            this.sprite.y += this.vy * delta;
            let per = this.life / this.originalLife;
            this.sprite.scale.set(this.size * per, this.size * per);
            this.sprite.alpha = per;
        }
        else
            this.ready = true;
    }
}
class ParticleEmitter {
    constructor() {
        this.particlePool = [];
        this.totalParticles = 25;
        this.frequency = 0;
        this.callback = null;
    }
    static create(scene, texture, config, callback, totalParticles) {
        let em = new ParticleEmitter();
        em.callback = callback;
        em.scene = scene;
        em.config = config;
        em.life = em.config.life;
        em.container = new PIXI.particles.ParticleContainer;
        if (totalParticles != null)
            em.totalParticles = totalParticles;
        for (let i = 0; i < em.totalParticles; i++) {
            em.particlePool.push(new Particle(texture));
        }
        em.id = em.scene.registerParticleEmitter(em);
        console.log(em.config.zone);
        return em;
    }
    createParticle() {
        let particle = this.getFreeParticeFromPool();
        if (particle == null)
            return;
        let angle = Math.random() * this.config.angleMax;
        angle -= 90;
        let x = this.config.x;
        let y = this.config.y;
        if (this.config.zone != null) {
            x += Math.floor(Math.random() * this.config.zone.width);
            y += Math.floor(Math.random() * this.config.zone.height);
        }
        particle.set(x, y, this.config.particleLife, this.config.particleSpeed, angle, this.config.sizeRandom, this.config.sizeMax);
        this.container.addChild(particle.sprite);
    }
    destroy(execute = true) {
        if (this.callback != null && execute)
            this.callback();
        this.scene.unregisterParticleEmitter(this.id);
        this.container.destroy({ children: true });
    }
    update(delta) {
        if (this.life != Infinity)
            this.life -= delta;
        this.frequency -= delta;
        if (this.frequency <= 0) {
            this.createParticle();
            this.frequency = this.config.frequency != null ? this.config.frequency : 0;
        }
        if (this.life < 0) {
            this.destroy();
            return;
        }
        for (let i = 0; i < this.totalParticles; i++) {
            if (!this.particlePool[i].Ready()) {
                this.particlePool[i].update(delta);
                if (this.particlePool[i].Ready())
                    this.container.removeChild(this.particlePool[i].sprite);
            }
        }
    }
    getFreeParticeFromPool() {
        for (let i = 0; i < this.totalParticles; i++) {
            if (this.particlePool[i].Ready())
                return this.particlePool[i];
        }
        return null;
    }
}
class SceneGame {
    constructor() {
        this.entities = [];
        this.controllers = [];
        this.guis = [];
        this.emitterPool = [];
    }
    init() {
        // Ajout de la carte en fond
        //Program.GetInstance().App().stage.addChild(PIXI.Sprite.fromImage("assets/images/Map.png"));
        Program.GetInstance().App().ticker.add((delta) => {
            this.update(delta);
        });
        this.populate();
    }
    populate() {
        // Génération de la map
        this.map = new GameMap(this);
        // Creation des buts
        this.hole1 = new EntityHole(this, Math.floor(Program.GetInstance().App().renderer.width / 2 - 32), 32);
        this.entities.push(this.hole1);
        this.hole2 = new EntityHole(this, Math.floor(Program.GetInstance().App().renderer.width / 2 - 32), Math.floor(Program.GetInstance().App().renderer.height - 64));
        this.entities.push(this.hole2);
        // Creating players
        this.player1 = new EntityPlayer(this, "hero", -50, -50);
        this.controllers.push(new ControllerKeyboard(this.player1, 90, 83, 81, 68));
        this.controllers.push(new ControllerTouch(this.player1, new PIXI.Rectangle(0, 0, Program.GetInstance().App().renderer.width, Program.GetInstance().App().renderer.height / 2)));
        this.entities.push(this.player1);
        this.player2 = new EntityPlayer(this, "badguy", -50, -150);
        this.controllers.push(new ControllerKeyboard(this.player2, 38, 40, 37, 39));
        this.controllers.push(new ControllerTouch(this.player2, new PIXI.Rectangle(0, Program.GetInstance().App().renderer.height / 2, Program.GetInstance().App().renderer.width, Program.GetInstance().App().renderer.height / 2)));
        this.entities.push(this.player2);
        this.hole1.setPlayer(this.player1);
        this.hole2.setPlayer(this.player2);
        // Creating pig
        this.ball = new EntityPig(this, -100, -100);
        this.entities.push(this.ball);
        this.ball.setRespawn(Program.GetInstance().App().renderer.width / 2 - this.ball.sprite.width / 2, Program.GetInstance().App().renderer.height / 2 - this.ball.sprite.height / 2);
        // Creating GUI
        this.guis.push(new GUIStat(0, Program.GetInstance().App().renderer.height - 32, this.player2, 0));
        this.guis.push(new GUIStat(Program.GetInstance().App().renderer.width, 32, this.player1, 3.142));
        this.player1.reset();
        this.player2.reset();
        this.ball.reset();
    }
    updateParticleEmitters(delta) {
        this.emitterPool.forEach((emitter) => {
            if (emitter == null)
                return;
            emitter.update(delta);
        });
    }
    registerParticleEmitter(em) {
        let id = this.emitterPool.length;
        for (let i = 0; i < this.emitterPool.length; i++) {
            if (this.emitterPool[i] == null) {
                id = i;
                break;
            }
        }
        if (id == this.emitterPool.length)
            this.emitterPool.push(em);
        else
            this.emitterPool[id] = em;
        Program.GetInstance().App().stage.addChild(em.container);
        return id;
    }
    unregisterParticleEmitter(id) {
        if (this.emitterPool[id] == null)
            return;
        Program.GetInstance().App().stage.addChild(this.emitterPool[id].container);
        this.emitterPool[id] = null;
    }
    updateEntities(delta) {
        this.entities.forEach((entity) => {
            let normal = null;
            HelperPlayer.CheckPlayerTile(this.map, entity);
            // Vérification des collisions entre entités
            if (entity.solid) {
                this.entities.forEach((other) => {
                    if (other == entity)
                        return;
                    normal = HelperEntity.checkCollisionWithEntity(entity, other);
                    if (normal != null) {
                        other.hit(entity);
                        if (other instanceof EntityPig || other.solid == false)
                            return;
                        HelperEntity.resolveCollision(normal, entity);
                    }
                });
            }
            // Vérification des collisions avec la map
            try {
                normal = HelperEntity.checkCollisionWithMap(this.map, entity);
            }
            catch (e) {
            }
            if (normal != null) {
                console.log(normal);
                HelperEntity.resolveCollision(normal, entity);
                if (entity instanceof EntityPlayer) {
                    this.controllers.forEach((controller) => {
                        if (controller.player == entity)
                            controller.cancel();
                    });
                }
                entity.bump();
            }
            entity.update(delta);
        });
    }
    but(player) {
        this.player1.reset();
        this.player2.reset();
    }
    update(delta) {
        this.updateEntities(delta);
        this.guis.forEach((gui) => {
            gui.update();
        });
        this.updateParticleEmitters(delta);
    }
    destroy() {
        let self = this;
        Program.GetInstance().App().ticker.remove(self.update);
        this.map.destroy();
        this.entities.forEach((entity) => {
            entity.destroy();
        });
        this.guis.forEach((gui) => {
            gui.destroy();
        });
    }
}
//# sourceMappingURL=main.js.map