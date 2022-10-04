import * as me from 'melonjs';

export default class ActorBounds extends me.Bounds {
    constructor(bounds: me.Bounds) {
        super(undefined);
        this.addBounds(bounds, true);
    }

    overlaps(bounds: me.Bounds | me.Rect): boolean {
        if(!(bounds as any).isMap) return super.overlaps(bounds);
        return true;
    }
}