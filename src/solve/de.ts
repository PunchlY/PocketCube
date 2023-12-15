import { chs, mlength } from './const.js';
import solvedata from 'solvedata.min.json';

const { length } = chs;
const tab = Object.fromEntries([...chs].map((v, i) => [v, i]));

function aton(s: string) {
    return [...s].reduceRight((p, c) => p * length + tab[c], 0);
}
function* dsplit(s: string, x: number, y: number) {
    for (let i = 0; i < s.length; i += x + y)
        yield [s.slice(i, i + x), s.slice(i + x, i + x + y)];
};

function de({ map, sBuild, pos }: typeof import('solvedata.min.json')): typeof import('solvedata.json') {
    const mapL = map.length + 1;
    const data = Object.fromEntries(function* () {
        for (const [length, i] of pos) {
            const kl = (i % mlength) + 1, vl = ~~(i / mlength) + 1, dl = kl + vl, l = length * dl;
            for (const [k, v] of dsplit(sBuild.slice(0, l), kl, vl))
                yield [aton(k), Object.freeze(vfn(v))];
            sBuild = sBuild.slice(l);
        }
    }());
    data[0] = [];
    return {
        map: Object.freeze(map.map(aton)),
        build: Object.freeze(data)
    };

    function vfn(v: string) {
        return [...(function* (n) {
            do { yield (n % mapL) - 1; } while ((n = Math.floor(n / mapL)));
        })(aton(v))];
    }
}

export const { map, build } = de(solvedata);
