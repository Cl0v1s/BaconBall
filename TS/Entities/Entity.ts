/**
 * Created by clovis on 26/08/17.
 */
interface Entity
{
    sprite : PIXI.Sprite;
    mass : number;
    solid : boolean;

    scene : Scene;

    vx : number;
    vy : number;

    update(delta : number) : void;
    destroy() : void;

    hit(other : Entity) : void;
    reset() : void;

    Vx() : number;
    Vy() : number;
    setVx(vx : number);
    setVy(vy : number);
}