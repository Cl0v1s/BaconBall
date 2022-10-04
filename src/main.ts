// https://github.com/melonjs/melonJS/wiki
// https://melonjs.github.io/melonJS/docs/

import * as me from 'melonjs';
import game from './game';
import { createTextures, ressources} from './res';

import DefaultStage from './stages/default';

import Player1Entity from './entities/player1';
import Player2Entity from './entities/player2';
import PigEntity from './entities/pig';

async function init() {
    await new Promise((resolve) => me.device.onReady(resolve));
    me.video.init(480, 640, {parent : "screen", scaleMethod : "fit", renderer : me.video.CANVAS});
    await new Promise((resolve) => me.loader.preload(ressources, resolve));
    game.textures = createTextures();

    me.pool.register("Player1", Player1Entity, false);
    me.pool.register("Player2", Player2Entity, false);
    me.pool.register("Pig", PigEntity, false);

    me.state.set(me.state.PLAY, new DefaultStage());
    me.state.change(me.state.PLAY, false);
}

init();