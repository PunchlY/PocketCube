import { Rubik, BaseRubik } from './index.js';
import basisSolution from './solvedata.json';

const Re = [
    'R', 'R2', 'R\'',
    'U', 'U2', 'U\'',
    'F', 'F2', 'F\'',
    'L', 'L2', 'L\'',
    'D', 'D2', 'D\'',
    'B', 'B2', 'B\'',
] as const;
const M = [
    [0, 1, 2, 3, 4, 5], [1, 2, 0, 4, 5, 3], [2, 0, 1, 5, 3, 4],
    [2, 1, 3, 5, 4, 0], [1, 3, 2, 4, 0, 5], [3, 2, 1, 0, 5, 4],
    [5, 1, 0, 2, 4, 3], [1, 0, 5, 4, 3, 2], [0, 5, 1, 3, 2, 4],
    [3, 1, 5, 0, 4, 2], [1, 5, 3, 4, 2, 0], [5, 3, 1, 2, 0, 4],
    [2, 4, 0, 5, 1, 3], [4, 0, 2, 1, 3, 5], [0, 2, 4, 3, 5, 1],
    [3, 4, 2, 0, 1, 5], [4, 2, 3, 1, 5, 0], [2, 3, 4, 5, 0, 1],
    [0, 4, 5, 3, 1, 2], [4, 5, 0, 1, 2, 3], [5, 0, 4, 2, 3, 1],
    [5, 4, 3, 2, 1, 0], [4, 3, 5, 1, 0, 2], [3, 5, 4, 0, 2, 1],
] as const;
const RT = [
    M[14], M[18], M[8],
    M[6], M[9], M[3],
    M[4], M[15], M[13],
    M[8], M[18], M[14],
    M[3], M[9], M[6],
    M[13], M[15], M[4],
] as const;

const $solve = (rubik: Rubik) => {
    for (const { r: { position }, c: [c, cT], image, inverse } of rubik.similar(0)) {
        let E = basisSolution[position];
        if (E === undefined) continue;
        if (image)
            E = E.map((v) => (~~(v / 3) || 3) * 3 + (2 - v % 3));
        if (!inverse)
            E = E.reverse().map((v) => ~~(v / 3) * 3 + (2 - v % 3));
        E = E.map(
            function (this: number[], v) {
                return this[~~(v / 3)] * 3 + v % 3;
            },
            M[((c) => image ? c.image() : c)(inverse ? c.inverse() : cT)[0]],
        );
        return E;
    }
};
const transform = (raw: number[], t = NaN) => {
    if (!(t === null || isNaN(t))) [...function* (t, i) {
        t &= (1 << i) - 1;
        while (i--) yield t & 1, t >>>= 1;
    }(t, raw.length)].forEach(function (this: number[], b, i) {
        let v = raw[i];
        v = this[~~(v / 3)] * 3 + v % 3;
        raw[i] = b * 9 + v % 9;
        if (b ^ ~~(v / 9)) RT[v].map((v, i, a) => this[i] = a[this[i]]);
    }, [...M[0]]);
    return raw.map((v) => Re[v]).join('');
};
export interface SolveRubik {
    copy(): SolveRubik;
}
export class SolveRubik extends Rubik {
    static get [Symbol.species]() {
        return SolveRubik;
    }
    solve(t = NaN) {
        return transform($solve(this), t);
    }
}
export namespace SolveRubik {
    export declare function from(rubik: BaseRubik | number): SolveRubik;
    export function solve(scr: string, t = NaN) {
        const rubik = new Rubik(0).do(scr);
        if (!rubik) return false;
        return transform($solve(rubik), t);
    }
    export function* solveAll(scr: string) {
        const rubik = new Rubik(0).do(scr);
        if (!rubik) return false;
        const solve = $solve(rubik);
        for (let t = 0; t < 1 << solve.length; t++)
            yield transform(solve, t);
    }
}

export * from './index.js';
