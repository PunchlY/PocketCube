import { CT, Rubik } from './rubik.js';

const { readonly } = Rubik;

const Turns = [
    ...Rubik.R, ...Rubik.U, ...Rubik.F,
    ...Rubik.L, ...Rubik.D, ...Rubik.B,
    ...Rubik.X, ...Rubik.Y, ...Rubik.Z,
] as const;
const TurnNames = [
    'R', 'R2', 'R\'',
    'U', 'U2', 'U\'',
    'F', 'F2', 'F\'',
    'L', 'L2', 'L\'',
    'D', 'D2', 'D\'',
    'B', 'B2', 'B\'',
    'X', 'X2', 'X\'',
    'Y', 'Y2', 'Y\'',
    'Z', 'Z2', 'Z\'',
] as const;

type Graph = readonly [number, number, number, number, number, number];
const Base = [
    , [1, 2, 0, 4, 5, 3], [2, 0, 1, 5, 3, 4],
    [2, 1, 3, 5, 4, 0], [1, 3, 2, 4, 0, 5], [3, 2, 1, 0, 5, 4],
    [5, 1, 0, 2, 4, 3], [1, 0, 5, 4, 3, 2], [0, 5, 1, 3, 2, 4],
    [3, 1, 5, 0, 4, 2], [1, 5, 3, 4, 2, 0], [5, 3, 1, 2, 0, 4],
    [2, 4, 0, 5, 1, 3], [4, 0, 2, 1, 3, 5], [0, 2, 4, 3, 5, 1],
    [3, 4, 2, 0, 1, 5], [4, 2, 3, 1, 5, 0], [2, 3, 4, 5, 0, 1],
    [0, 4, 5, 3, 1, 2], [4, 5, 0, 1, 2, 3], [5, 0, 4, 2, 3, 1],
    [5, 4, 3, 2, 1, 0], [4, 3, 5, 1, 0, 2], [3, 5, 4, 0, 2, 1],
] as Graph[];
const TurnBase = [
    14, 18, 8,
    6, 9, 3,
    4, 15, 13,
    8, 18, 14,
    3, 9, 6,
    13, 15, 4,
    14, 18, 8,
    6, 9, 3,
    4, 15, 13,
].map((n) => Base[n]);
const Base_Base = Rubik.Base.map((c) => Array.from({ length: 24 }, ([C, T]: CT = CT(c), i) => Base[C[i / 3] * 3 + (T[i / 3] + i) % 3]));
const Base_BaseT = Array.from({ length: 24 }, (v, i) => Rubik.Base.map((c) => Base[c.find(i)]));
const BaseT = Base_BaseT[0];
const BaseBaseT = Base_BaseT.map((l, i) => l[i]);

export class Build extends Array<number>{
    constructor(build: number[] | readonly number[]) {
        build.length ? super(...build) : super();
    }
    copy() {
        return new Build(this);
    }
    mapping(graph: Graph) {
        if (!graph) return this;
        super.forEach((v, i) => super[i] = graph[~~(v / 3)] * 3 + v % 3);
        return this;
    }
    base(base: number) {
        Build.prototype.mapping.call(this, Base[base]);
        return this;
    }
    coordinate(coordinate: number) {
        Build.prototype.mapping.call(this, BaseT[coordinate]);
        return this;
    }
    similar(base: number) {
        const { mapping } = Build.prototype;
        mapping.call(this, Base[base]);
        mapping.call(this, BaseBaseT[base]);
        return this;
    }
    image() {
        super.forEach((v, i) => {
            const t = ~~(v / 3);
            if (t === 6) return;
            super[i] = (t || 3) * 3 + (2 - v % 3);
        });
        return this;
    }
    inverse() {
        super.reverse();
        super.forEach((v, i) => super[i] = ~~(v / 3) * 3 + (2 - v % 3));
        return this;
    }
    bits(t: number) {
        const st = ((r, st) =>
            r ? st.reverse() : st
        )(
            t < 0 && (t = ~t, true),
            Array.from({ length: super.length },
                (v: number = t & 1) => (t >>= 1, v)
            ),
        );
        const graph = [0, 1, 2, 3, 4, 5];
        st.forEach((b, i) => {
            let v = graph[i];
            v = graph[~~(v / 3)] * 3 + v % 3;
            if (b ^ ~~(v / 9)) graph.forEach((p, i) => graph[i] = TurnBase[v][p]);
            super[i] = b * 9 + v % 9;
        });
        return this;
    }
    stringify() {
        return super.map((v) => TurnNames[v]).join('');
    }
}

export interface Solver {
    solve(t?: number): string | false;
}
export function* Solver(eT: number[], max = Infinity) {
    const set = new Set();
    let map = new Map([[readonly(new Rubik(0)), [] as number[]]]), _map = new Map(), l = 0;
    while (l - 1 < max && map.size) {
        for (const [rubik, build] of map) {
            const { position } = rubik;
            if (set.has(position)) continue;
            if ((() => {
                for (const { rubik: { position } } of rubik.similarNoCongruence(0)) if (set.has(position)) return false;
                return true;
            })()) yield {
                build: new Build(build),
                rubik,
            };
            for (const { rubik: r } of rubik.congruent(0)) set.add(r.position);
            eT.filter((n) => !build.length || ~~((build.at(-1) - n) / 3)).forEach((n) => _map.set(
                readonly(rubik.action(Turns[n])),
                [...build, n],
            ));
            eT.filter((n) => !build.length || ~~((build.at(0) - n) / 3)).forEach((n) => _map.set(
                readonly(Turns[n].action(rubik)),
                [n, ...build],
            ));
        }
        map = _map, _map = new Map(), l++;
    }
}
export namespace Solver {
    export declare let data: typeof import('./solvedata.json').default;
    export function solveRaw(rubik: Rubik) {
        for (const { rubik: { position }, image, inverse, base, coordinate } of rubik.similar()) {
            if (!(position in data)) continue;
            const solve = new Build(data[position]);
            if (image) solve.image();
            if (!inverse) solve.inverse();
            return solve.base(((c) => image ? c.image() : c)(inverse ? base.inverse() : coordinate)[0]);
        }
        return false;
    };
    Rubik.prototype.solve = function solve(t = NaN) {
        const solve = solveRaw(this);
        if (!solve) return false;
        if (t !== null) solve.bits(t);
        return solve.stringify();
    };
    export function solve(scr: string, t = NaN) {
        const rubik = new Rubik(0).do(scr);
        if (!rubik) return false;
        return rubik.solve(t);
    }
    export function* solveAll(scr: string, reverse = false) {
        const rubik = new Rubik(0).do(scr);
        if (!rubik) return false;
        const solve = solveRaw(rubik);
        if (!solve) return false;
        const max = 1 << solve.length;
        for (let t = 0; t < max; t++)
            yield solve.bits(reverse ? ~t : t).stringify();
    }
}
