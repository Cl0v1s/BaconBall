import * as me from 'melonjs';

function init(map: Array<Array<number>>) {
    const width = me.game.viewport.width / 32;
    const height = me.game.viewport.height / 32;

    map = new Array(width);
    for(let i = 0; i < map.length; i++) {
        map[i] = new Array(height);
        for(let u = 0; u < map[i].length; u++) {
            map[i][u] = 0;
        }
    }

    return map;
}

function limits(map: Array<Array<number>>) {
    const width = map.length;
    const height = map[0].length;
    // top and bottom
    for(let i = 0; i < width; i++) {
        map[i][0] = 2;
        map[i][height - 1] = 2;
    }

    for(let i = 0; i < height - 1; i++) {
        map[0][i] = 3;
        map[width - 1][i] = 3;
    }

    return map;
}

function pipe(methods: Array<Function>): Array<Array<number>> {
    let result: Array<Array<number>> = [];
    methods.forEach((method) => result = method(result));
    return result;
}

export default pipe.bind(this, [init, limits]);