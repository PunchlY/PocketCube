import { Rubik } from './base.js';
import { R, U, F, L, D, B, congruent, similarly, type Trun, type Layer } from './util.js';

const Turns = Array.from({ length: 8 }, (_, i) => [R, U, F, L, D, B].filter((T) => T[0].at(i) === i * 3));

function SameLayer(turn: Trun, layer: Layer) {
    for (const rubik of layer)
        if (turn === rubik) return true;
    return false;
}

function Solver(p: number, half?: boolean, length = Infinity) {
    return {
        turns: Turns[p].flat(1),
        res: Solver(),
    };

    function* Solver() {
        const set = new Set<number>();
        let map = new Map([[0, [] as Trun[]]]), tmp: typeof map = new Map();
        do {
            for (const [position, build] of map) {
                if (set.has(position))
                    continue;
                const rubik = Object.freeze(Rubik.from(position));
                if (hasNotSimilarly())
                    yield { position, build };
                for (const { position } of congruent(rubik, p))
                    set.add(position);
                for (const turn of Turns[p])
                    push(turn[0], turn), push(turn[2], turn);
                if (!half) continue;
                for (const turn of Turns[p])
                    push(turn[1], turn);

                function hasNotSimilarly() {
                    for (const { position } of similarly(rubik, 14, p))
                        if (set.has(position)) return false;
                    return true;
                }
                function push(turn: Trun, layer: Layer) {
                    if (!SameLayer(build.at(-1)!, layer)) {
                        const { position } = rubik.action(turn);
                        if (!set.has(position))
                            tmp.set(position, [...build, turn]);
                    }
                    if (!SameLayer(build.at(0)!, layer)) {
                        const { position } = turn.action(rubik);
                        if (!set.has(position))
                            tmp.set(position, [turn, ...build]);
                    }
                }
            }
            map = tmp, tmp = new Map();
        } while (length-- && map.size);
    }
}

export { Solver };
