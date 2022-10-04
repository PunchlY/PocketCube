const { Rubik, Turn } = require('../');

function solve(e, eT, max = Infinity) {
    return function* () {
        const set = new Set();
        let map = new Map([[new Rubik(0), []]]), _map = new Map(), l = 0;
        while (map.size && l - 1 < max) {
            for (const [_r, a] of map) {
                const position = _r.position;
                if (set.has(position)) continue;
                if ((() => {
                    for (const { r } of _r.similarNoCongruence(0))
                        if (set.has(r.position)) return false;
                    return true;
                })()) yield { position, build: a.join('') };
                for (const { r } of _r.congruent(0)) set.add(r.position);
                e.forEach((_a, i) => (a.length && !~~((a.at(-1) - eT[i]) / 3)) || _map.set(_r.copy().action(_a), [].concat(a, eT[i])));
            }
            map = _map, _map = new Map(), l++;
        }
    }
}

exports.halfOrQuarter = solve([
    Turn.R[0], Turn.R[2],
    Turn.U[0], Turn.U[2],
    Turn.F[0], Turn.F[2],
    Turn.R[1], Turn.U[1], Turn.F[1],
], [
    0, 2,
    3, 5,
    6, 8,
    1, 4, 7
], 11);
exports.quarter = solve([
    Turn.R[0], Turn.R[2],
    Turn.U[0], Turn.U[2],
    Turn.F[0], Turn.F[2],
], [
    0, 2,
    3, 5,
    6, 8,
], 14);