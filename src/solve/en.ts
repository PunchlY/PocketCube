import { chs, mlength } from './const.js';
import { map, build as builds } from '../../solvedata.json';

const { length } = chs;

function ntoa(n: number) {
    return [...(function* (n) {
        do { yield n % length; } while (n = Math.floor(n / length));
    })(n)].map((n) => chs[n]).join('');
}

const mapL = map.length + 1;
// @ts-ignore
delete builds[0];
const a: string[][] = [];
for (let position in builds) {
    // @ts-ignore
    const build: number[] = builds[position];
    const sBuild = ntoa(build.reduceRight((p, c) => p * mapL + c + 1, 0));
    const sPosition = ntoa(Number(position));
    (a[sPosition.length - 1 + (sBuild.length - 1) * mlength] ??= []).push(`${sPosition}${sBuild}`);
}
const pos: number[][] = [];

export default {
    map: map.map(ntoa),
    sBuild: a.map((s, i) => {
        if (!s.length) return '';
        pos.push([s.length, i]);
        return s.join('');
    }).join(''),
    pos,
};

