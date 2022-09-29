import * as me from 'melonjs';

import TileEntity from '../entities/tile';

export default class LevelContainer extends me.Container {
    constructor() {
        super();

        const tile = me.pool.pull("Tile", 32, 32, 0) as TileEntity;
        this.addChild(tile);
    }
}