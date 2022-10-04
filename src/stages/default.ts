import * as me from 'melonjs';
import PlayerEntity from '../entities/player';
import LevelContainer from '../containers/level';
import PigEntity from '../entities/pig';

export default class DefaultStage extends me.Stage {
    onResetEvent(): void {
        me.game.world.addChild(new LevelContainer());
        const player1: PlayerEntity = me.pool.pull("Player1", me.game.viewport.width / 2 - 16 , 32 + 1) as PlayerEntity;
        me.game.world.addChild(player1);

        const player2: PlayerEntity = me.pool.pull("Player2", me.game.viewport.width / 2 - 16 , me.game.viewport.height - 32 * 2 - 1) as PlayerEntity;
        me.game.world.addChild(player2);

        const pig = me.pool.pull("Pig", me.game.viewport.width / 2 - 16 , me.game.viewport.height / 2 - 16) as PigEntity;
        me.game.world.addChild(pig);
    }

    onDestroyEvent(): void {
        
    }
}