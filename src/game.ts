import * as me from 'melonjs';

interface Game {
    textures: me.TextureAtlas | null;
}

const game: Game = {
    textures: null,
};

export default game;
