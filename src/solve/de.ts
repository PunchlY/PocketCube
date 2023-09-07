import { chs, mlength } from './const.js';

const { length } = chs;
const tab = Object.fromEntries([...chs].map((v, i) => [v, i]));

function aton(s: string) {
    return [...s].reduceRight((p, c) => p * length + tab[c], 0);
}
function* dsplit(s: string, x: number, y: number) {
    for (let i = 0; i < s.length; i += x + y)
        yield [s.slice(i, i + x), s.slice(i + x, i + x + y)];
};

export default function (map: string[], sBuild: string, n: [number, number][]) {
    const mapL = map.length + 1;
    const data = Object.fromEntries(function* () {
        for (const [length, i] of n) {
            const kl = (i % mlength) + 1, vl = ~~(i / mlength) + 1, dl = kl + vl, l = length * dl;
            for (const [k, v] of dsplit(sBuild.slice(0, l), kl, vl))
                yield [aton(k), vfn(v)];
            sBuild = sBuild.slice(l);
        }
    }());
    data[0] = [];
    return Object.freeze({
        map: Object.freeze(map.map(aton)),
        build: Object.freeze(data)
    });

    function vfn(v: string) {
        return [...(function* (n) {
            do { yield (n % mapL) - 1; } while ((n = Math.floor(n / mapL)));
        })(aton(v))];
    }
}
