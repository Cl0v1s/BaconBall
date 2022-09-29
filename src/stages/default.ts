import * as me from 'melonjs';
import Player1Entity from '../entities/player1';
import LevelContainer from '../containers/level';

export default class DefaultStage extends me.Stage {
    onResetEvent(): void {
        me.game.world.addChild(new LevelContainer());
        const player: Player1Entity = me.pool.pull("Player1", 0 , 0) as Player1Entity;
        me.game.world.addChild(player);
    }

    onDestroyEvent(): void {
        
    }
}