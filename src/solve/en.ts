import { chs, mlength } from './const.js';

const { length } = chs;

function ntoa(n: number) {
    return [...(function* (n) {
        do { yield n % length; } while (n = Math.floor(n / length));
    })(n)].map((n) => chs[n]).join('');
}

export default function (data: typeof import('solvedata.json').default) {
    const { map, build: builds } = data;
    const mapL = map.length + 1;
    delete builds[0];
    const a: string[][] = [];
    for (let position in builds) {
        const build = builds[position];
        const sBuild = ntoa(
            build
                .reduceRight((p, c) => p * mapL + c + 1, 0)
        );
        const sPosition = ntoa(Number(position));
        (a[sPosition.length - 1 + (sBuild.length - 1) * mlength] ??= []).push(`${sPosition}${sBuild}`);
    }
    const p: number[][] = [];
    return [
        map.map(ntoa),
        a.map((s, i) => {
            if (!s.length) return '';
            p.push([s.length, i]);
            return s.join('');
        }).join(''),
        p,
    ] as const;
};
