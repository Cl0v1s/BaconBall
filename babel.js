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
Config.AirDensity = 0.3;
Config.TileSize = 32;
Config.ObstacleProbability = 30; //%
Config.ObstacleLength = 3;
Config.Tiles = {
    "Ground": 0,
    "Wall": 1,
    "WallH": 2,
    "WallV": 3,
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
    constructor() {
        this.grid = [];
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
        console.log(this.grid);
    }
    generateSprites() {
        let sprite;
        for (let i = 0; i < this.width; i++) {
            let row = [];
            for (let u = 0; u < this.height; u++) {
                let tile = this.grid[i][u];
                // Adoucissement des murs
                tile = this.polishWalls(tile, i, u);
                // Adoucissement de la lave
                tile = this.polishLava(tile, i, u);
                // Adoucissement de l'eau
                tile = this.polishWater(tile, i, u);
                if (tile == Config.Tiles.Ground) continue;
                console.log(tile);
                sprite = PIXI.Sprite.fromFrame("tile" + (tile + 1) + ".png");
                sprite.x = i * Config.TileSize;
                sprite.y = u * Config.TileSize;
                this.container.addChild(sprite);
            }
            this.grid.push(row);
        }
    }
    polishWalls(tile, x, y) {
        if (tile == Config.Tiles.WallH && (this.grid[x + 1] != null && this.grid[x + 1][y] != Config.Tiles.WallH && this.grid[x + 1][y] != Config.Tiles.WallV || this.grid[x - 1] != null && this.grid[x - 1][y] != Config.Tiles.WallH && this.grid[x - 1][y] != Config.Tiles.WallV)) {
            tile = Config.Tiles.Wall;
        }
        return tile;
    }
    polishWater(tile, x, y) {
        if (tile != Config.Tiles.Ground) return tile;
        if (this.grid[x] != null && this.grid[x][y + 1] == Config.Tiles.Water) return Config.Tiles.WaterT;
        if (this.grid[x - 1] != null && this.grid[x - 1][y + 1] == Config.Tiles.Water) {
            if (this.grid[x - 1][y] != Config.Tiles.Water) return Config.Tiles.WaterTR;else return Config.Tiles.WaterR;
        }
        if (this.grid[x + 1] != null && this.grid[x + 1][y + 1] == Config.Tiles.Water) {
            if (this.grid[x + 1][y] != Config.Tiles.Water) return Config.Tiles.WaterTL;else return Config.Tiles.WaterL;
        }
        if (this.grid[x - 1] != null && this.grid[x - 1][y] == Config.Tiles.Water) return Config.Tiles.WaterR;
        if (this.grid[x + 1] != null && this.grid[x + 1][y] == Config.Tiles.Water) return Config.Tiles.WaterL;
        if (this.grid[x] != null && this.grid[x][y - 1] == Config.Tiles.Water) return Config.Tiles.WaterB;
        if (this.grid[x - 1] != null && this.grid[x - 1][y - 1] == Config.Tiles.Water) return Config.Tiles.WaterBR;
        if (this.grid[x + 1] != null && this.grid[x + 1][y - 1] == Config.Tiles.Water) return Config.Tiles.WaterBL;
        return tile;
    }
    polishLava(tile, x, y) {
        if (tile != Config.Tiles.Ground) return tile;
        if (this.grid[x] != null && this.grid[x][y + 1] == Config.Tiles.Lava) return Config.Tiles.LavaT;
        if (this.grid[x - 1] != null && this.grid[x - 1][y + 1] == Config.Tiles.Lava) {
            if (this.grid[x - 1][y] != Config.Tiles.Lava) return Config.Tiles.LavaTR;else return Config.Tiles.LavaR;
        }
        if (this.grid[x + 1] != null && this.grid[x + 1][y + 1] == Config.Tiles.Lava) {
            if (this.grid[x + 1][y] != Config.Tiles.Lava) return Config.Tiles.LavaTL;else return Config.Tiles.LavaL;
        }
        if (this.grid[x - 1] != null && this.grid[x - 1][y] == Config.Tiles.Lava) return Config.Tiles.LavaR;
        if (this.grid[x + 1] != null && this.grid[x + 1][y] == Config.Tiles.Lava) return Config.Tiles.LavaL;
        if (this.grid[x] != null && this.grid[x][y - 1] == Config.Tiles.Lava) return Config.Tiles.LavaB;
        if (this.grid[x - 1] != null && this.grid[x - 1][y - 1] == Config.Tiles.Lava) return Config.Tiles.LavaBR;
        if (this.grid[x + 1] != null && this.grid[x + 1][y - 1] == Config.Tiles.Lava) return Config.Tiles.LavaBL;
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
                if (random >= 50) x = this.width - Config.ObstacleLength - 1;else x = 1;
                this.generateObstacle(x, u);
                u += 3;
            } else u++;
        }
    }
    generateLava() {
        let gen = false;
        let x = Math.floor(Math.random() * (this.height - 1) + 1);
        let y = Math.floor(Math.random() * (this.height - 1) + 1);
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
        let tries = 3;
        while (gen == false) {
            tries -= 1;
            if (tries < 0) return;
            let x = Math.floor(Math.random() * (this.height - 1) + 1);
            let y = Math.floor(Math.random() * (this.height - 1) + 1);
            let width = Math.floor(Math.random() * 3 + 1);
            let height = Math.floor(Math.random() * 3 + 1);
            for (let i = 0; i < width; i++) {
                for (let u = 0; u < height; u++) {
                    if (this.grid[x + i] != null && this.grid[x + i][y + u] == Config.Tiles.Ground) {
                        if (this.grid[x][y - 1] == Config.Tiles.Lava || this.grid[x][y - 2] == Config.Tiles.Lava || this.grid[x][y + 1] == Config.Tiles.Lava || this.grid[x][y + 2] == Config.Tiles.Lava || this.grid[x - 1] != null && this.grid[x - 1][y] == Config.Tiles.Lava || this.grid[x - 2] != null && this.grid[x - 2][y] == Config.Tiles.Lava || this.grid[x + 1] != null && this.grid[x + 1][y] == Config.Tiles.Lava || this.grid[x + 2] != null && this.grid[x + 2][y] == Config.Tiles.Lava || this.grid[x - 1] != null && this.grid[x - 1][y - 1] == Config.Tiles.Lava || this.grid[x - 2] != null && this.grid[x - 2][y - 2] == Config.Tiles.Lava || this.grid[x + 1] != null && this.grid[x + 1][y - 1] == Config.Tiles.Lava || this.grid[x + 2] != null && this.grid[x + 2][y - 2] == Config.Tiles.Lava || this.grid[x - 1] != null && this.grid[x - 1][y + 1] == Config.Tiles.Lava || this.grid[x - 2] != null && this.grid[x - 2][y + 2] == Config.Tiles.Lava || this.grid[x + 1] != null && this.grid[x + 1][y + 1] == Config.Tiles.Lava || this.grid[x + 2] != null && this.grid[x + 2][y + 2] == Config.Tiles.Lava) continue;
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
        this.particles = [];
        this.ready = false;
        this.app = new PIXI.Application(384, 608, { backgroundColor: 0x282d44 });
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        document.body.appendChild(this.app.view);
        this.load();
    }
    // EntryPoint
    static Main() {
        Program.Initialize();
    }
    static Initialize() {
        if (Program.Instance == null) Program.Instance = new Program();
    }
    static GetInstance() {
        if (Program.Instance == null) throw new Error("Instance must be initialized.");
        return Program.Instance;
    }
    load() {
        PIXI.loader.add("assets/animations/Hero.json").add("assets/animations/Pig.json").add("assets/animations/Tileset.json").load(() => {
            this.setup();
        });
    }
    setup() {
        console.log("Setup...");
        this.scene = new SceneGame();
        this.scene.init();
        this.particleContainer = new PIXI.particles.ParticleContainer();
        this.app.stage.addChild(this.particleContainer);
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
            Program.GetInstance().App().ticker.add(left);
        };
        ControllerKeyboard.keyboard(upcode).press = () => {
            Program.GetInstance().App().ticker.add(up);
        };
        ControllerKeyboard.keyboard(rightcode).press = () => {
            Program.GetInstance().App().ticker.add(right);
        };
        ControllerKeyboard.keyboard(downcode).press = () => {
            Program.GetInstance().App().ticker.add(down);
        };
        ControllerKeyboard.keyboard(leftcode).release = () => {
            Program.GetInstance().App().ticker.remove(left);
        };
        ControllerKeyboard.keyboard(upcode).release = () => {
            Program.GetInstance().App().ticker.remove(up);
        };
        ControllerKeyboard.keyboard(rightcode).release = () => {
            Program.GetInstance().App().ticker.remove(right);
        };
        ControllerKeyboard.keyboard(downcode).release = () => {
            Program.GetInstance().App().ticker.remove(down);
        };
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
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
            }
            event.preventDefault();
        };
        //The `upHandler`
        key.upHandler = function (event) {
            if (event.keyCode === key.code) {
                if (key.isDown && key.release) key.release();
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
    action() {}
}
class EntityWalking {
    constructor() {
        this.vx = 0;
        this.vy = 0;
        this.mass = 0.75;
    }
    hit(other) {}
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
        this.vx = this.mass * this.vx;
        this.vy = this.mass * this.vy;
        if (Math.round(this.vx) == 0) this.vx = 0;
        if (Math.round(this.vy) == 0) this.vy = 0;
        this.setFrame();
    }
    setFrame() {
        if (this.vy == 0 && this.vx == 0) {
            this.sprite.stop();
            return;
        } else this.sprite.play();
        if (this.vy > 0) {
            if (this.sprite.currentFrame > 3) this.sprite.gotoAndPlay(0);
        } else if (this.vy < 0) {
            if (this.sprite.currentFrame < 12) this.sprite.gotoAndPlay(12);
        } else if (this.vx > 0) {
            if (this.sprite.currentFrame < 4 || this.sprite.currentFrame > 7) this.sprite.gotoAndPlay(4);
        } else if (this.vx < 0) {
            if (this.sprite.currentFrame < 8 || this.sprite.currentFrame > 11) this.sprite.gotoAndPlay(8);
        }
    }
    destroy() {
        throw new Error("Method not implemented.");
    }
}
/// <reference path="EntityWalking.ts" />
class EntityPig extends EntityWalking {
    constructor(x, y) {
        super();
        this.shootx = 0;
        this.shooty = 0;
        this.hits = 0;
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
        for (let i = 0; i < Math.random() * 10 + 20; i++) {
            let dirx = Math.random() * 5;
            let diry = Math.random() * 5;
            if (Math.random() * 100 <= 50) dirx *= -1;
            if (Math.random() * 100 <= 50) diry *= -1;
            let rot = Math.random() * 20;
            let p = new Particle("pig1.png", this.sprite.x + this.sprite.width / 2, this.sprite.y + this.sprite.height / 2, 5, dirx, diry, rot, 0.3);
            p.register();
        }
        this.sprite.x = Program.GetInstance().App().renderer.width / 2 - this.sprite.width / 2;
        this.sprite.y = Program.GetInstance().App().renderer.height / 2 - this.sprite.height / 2;
        this.vx = 0;
        this.vy = 0;
        this.hits = 0;
        for (let i = 0; i < Math.random() * 10 + 20; i++) {
            let dirx = Math.random() * 5;
            let diry = Math.random() * 5;
            if (Math.random() * 100 <= 50) dirx *= -1;
            if (Math.random() * 100 <= 50) diry *= -1;
            let rot = Math.random() * 20;
            let p = new Particle("pig1.png", this.sprite.x + this.sprite.width / 2, this.sprite.y + this.sprite.height / 2, 5, dirx, diry, rot, 0.3);
            p.register();
        }
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
        this.shake();
        if (this.hits > 10) this.reset();
        if (this.hits > 0) {
            this.hits -= 0.3;
        } else this.hits = 0;
        this.IA();
    }
    hit(other) {
        let mx = 0;
        let my = 0;
        if (other.Vx() != 0) mx = other.Vx() / Math.abs(other.Vx());
        if (other.Vy() != 0) my = other.Vy() / Math.abs(other.Vy());
        this.shootx = 50 * mx;
        this.shooty = 50 * my;
        this.hits += 1;
    }
    IA() {
        if (this.vx != 0 || this.vy != 0) return;
        this.vx = Math.random() * 20;
        this.vy = Math.random() * 20;
        if (Math.random() * 100 <= 50) this.vx *= -1;
        if (Math.random() * 100 <= 50) this.vy *= -1;
    }
    destroy() {
        Program.GetInstance().App().stage.removeChild(this.sprite);
    }
}
/// <reference path="EntityWalking.ts" />
class EntityPlayer extends EntityWalking {
    constructor(x, y) {
        super();
        let frames = [];
        for (let i = 1; i < 17; i++) {
            frames.push(PIXI.Texture.fromFrame("hero" + i + ".png"));
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
    update(delta) {
        super.update(delta);
    }
    destroy() {
        Program.GetInstance().App().stage.removeChild(this.sprite);
    }
    moveLeft() {
        if (this.vx <= 0) this.vx = -10;
    }
    moveRight() {
        if (this.vx >= 0) this.vx = 10;
    }
    moveUp() {
        if (this.vy <= 0) this.vy = -10;
    }
    moveDown() {
        if (this.vy >= 0) this.vy = 10;
    }
}
class Vector2 {
    static min(v1, v2) {
        if (v1.scalar() < v2.scalar()) return v1;
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
        if (!(this.x < rec.x + rec.width && this.x + this.width > rec.x && this.y < rec.y + rec.height && this.height + this.y > rec.y)) {
            return null;
        }
        let result = new Rectangle();
        if (this.x < rec.x) {
            result.x = rec.x;
            result.width = this.x + this.width - rec.x;
        } else {
            result.x = this.x;
            result.width = rec.x + rec.width - this.x;
        }
        if (this.y < rec.y) {
            result.y = rec.y;
            result.height = this.y + this.height - rec.y;
        } else {
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
            if (result != null) results.push(result);
        }
        if (results.length <= 0) return null;
        let result = new Vector2(0, 0);
        results.forEach(r => {
            result = result.add(r);
        });
        return result;
    }
    static checkCollisionWithEntity(entity1, entity2) {
        let rectangle1 = new Rectangle(entity1.sprite.x + Config.AirDensity * entity1.Vx(), entity1.sprite.y + Config.AirDensity * entity1.Vy(), entity1.sprite.width, entity1.sprite.height);
        let rectangle2 = new Rectangle(entity2.sprite.x + Config.AirDensity * entity2.Vx(), entity2.sprite.y + Config.AirDensity * entity2.Vy(), entity2.sprite.width, entity2.sprite.height);
        return this.checkCollision(rectangle1, rectangle2);
    }
    static checkCollision(rectangle1, rectangle2) {
        let intersection = rectangle1.intersect(rectangle2);
        if (intersection == null) return null;
        let normal = new Vector2(0, 0);
        if (intersection.width < intersection.height) normal.x = intersection.width;else normal.y = intersection.height;
        if (rectangle1.x < rectangle2.x) normal.x = -normal.x;
        if (rectangle1.y < rectangle2.y) normal.y = -normal.y;
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
 * Created by clovis on 28/08/17.
 */
class Particle {
    constructor(file, x, y, time, directionx, directiony, rotation, scale) {
        this.registered = false;
        this.sprite = PIXI.Sprite.fromFrame(file);
        this.sprite.x = x;
        this.sprite.y = y;
        this.time = time;
        if (rotation != null) this.sprite.rotation.toFixed(rotation);
        if (scale != null) this.sprite.scale.set(scale, scale);
        this.directionx = directionx;
        this.directiony = directiony;
    }
    register() {
        this.registered = true;
        Program.GetInstance().particles[Particle.ID] = this;
        Program.GetInstance().particleContainer.addChild(this.sprite);
        this.id = Particle.ID;
        Particle.ID++;
    }
    update(delta) {
        this.sprite.x += this.directionx;
        this.sprite.y += this.directiony;
        this.sprite.alpha.toFixed(this.time);
        this.time--;
        if (this.time == 0) {
            this.destroy();
        }
        console.log(this.time);
    }
    destroy() {
        if (this.registered == false) return;
        Program.GetInstance().particleContainer.removeChild(this.sprite);
        Program.GetInstance().particles[this.id] = null;
        //console.log(Program.GetInstance().particles);
    }
}
Particle.ID = 0;
class SceneGame {
    constructor() {
        this.entities = [];
        this.controllers = [];
    }
    init() {
        // Ajout de la carte en fond
        //Program.GetInstance().App().stage.addChild(PIXI.Sprite.fromImage("assets/images/Map.png"));
        Program.GetInstance().App().ticker.add(delta => {
            this.update(delta);
        });
        this.populate();
    }
    populate() {
        // Génération de la map
        this.map = new GameMap();
        // Creating players
        this.player1 = new EntityPlayer(50, 50);
        this.controllers.push(new ControllerKeyboard(this.player1, 90, 83, 81, 68));
        this.entities.push(this.player1);
        this.player2 = new EntityPlayer(50, 150);
        this.controllers.push(new ControllerKeyboard(this.player2, 38, 40, 37, 39));
        this.entities.push(this.player2);
        // Creating pig
        this.ball = new EntityPig(100, 100);
        this.entities.push(this.ball);
    }
    update(delta) {
        for (let id in Program.GetInstance().particles) {
            let particle = Program.GetInstance().particles[id];
            if (particle == null) continue;
            particle.update(delta);
        }
        this.entities.forEach(entity => {
            let normal = null;
            // Vérification des collisions entre entités
            this.entities.forEach(other => {
                if (other == entity) return;
                normal = HelperEntity.checkCollisionWithEntity(entity, other);
                if (normal != null) {
                    if (other instanceof EntityPig) {
                        other.hit(entity);
                        return;
                    }
                    HelperEntity.resolveCollision(normal, entity);
                }
            });
            // Vérification des collisions avec la map
            normal = HelperEntity.checkCollisionWithMap(this.map, entity);
            if (normal != null) HelperEntity.resolveCollision(normal, entity);
            entity.update(delta);
        });
    }
    destroy() {
        let self = this;
        Program.GetInstance().App().ticker.remove(self.update);
        this.map.destroy();
        this.entities.forEach(entity => {
            entity.destroy();
        });
    }
}
//# sourceMappingURL=main.js.map
