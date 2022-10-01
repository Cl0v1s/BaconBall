import * as me from 'melonjs';

export const SOLID = [
    false, 
    true, 
    true, 
    true, 
    false, 
    false, 
    false, 
    false, 
    false, 
    false, 
    false, // 10 
    false,
    false, 
    false, 
    false,
]

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

function decorations(map: Array<Array<number>>) {
    const width = map.length;
    const height = map[0].length;
    for(let i = 0; i < width; i++) {
        for(let u = 0; u < height; u++) {
            const rand = Math.random() * 10;
            // different ground
            if(rand >= 9.2) map[i][u] = 13;

            // vegetal
            if(rand >= 9.8) map[i][u] = 12;

            if(
                rand >= 5
                && (
                    i > 0 && map[i - 1][u] == 12
                    || u > 0 && map[i][u - 1] == 12
                )
            ) map[i][u] = 12;
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

export default pipe.bind(this, [init, decorations, limits]);