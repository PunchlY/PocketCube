import * as Rubik from './util.js';
import data from 'solvedata.json';

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
];
const Position = Object.fromEntries([
    ...Rubik.R, ...Rubik.U, ...Rubik.F,
    ...Rubik.L, ...Rubik.D, ...Rubik.B,
    ...Rubik.X, ...Rubik.Y, ...Rubik.Z,
].map(({ position }, i) => [position, i]));

type Graph = readonly [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
const Image: Graph = [
    11, 10, 9,
    5, 4, 3,
    8, 7, 6,
    2, 1, 0,
    14, 13, 12,
    17, 16, 15,
    18, 19, 20,
    23, 22, 21,
    26, 25, 24,
];
const Inverse: Graph = [
    2, 1, 0,
    5, 4, 3,
    8, 7, 6,
    11, 10, 9,
    14, 13, 12,
    17, 16, 15,
    20, 19, 18,
    23, 22, 21,
    26, 25, 24,
];
const Base = [
    , [1, 2, 0, 4, 5, 3], [2, 0, 1, 5, 3, 4],
    [2, 1, 3, 5, 4, 0], [1, 3, 2, 4, 0, 5], [3, 2, 1, 0, 5, 4],
    [5, 1, 0, 2, 4, 3], [1, 0, 5, 4, 3, 2], [0, 5, 1, 3, 2, 4],
    [3, 1, 5, 0, 4, 2], [1, 5, 3, 4, 2, 0], [5, 3, 1, 2, 0, 4],
    [2, 4, 0, 5, 1, 3], [4, 0, 2, 1, 3, 5], [0, 2, 4, 3, 5, 1],
    [3, 4, 2, 0, 1, 5], [4, 2, 3, 1, 5, 0], [2, 3, 4, 5, 0, 1],
    [0, 4, 5, 3, 1, 2], [4, 5, 0, 1, 2, 3], [5, 0, 4, 2, 3, 1],
    [5, 4, 3, 2, 1, 0], [4, 3, 5, 1, 0, 2], [3, 5, 4, 0, 2, 1],
].map((g) => [...g, ...g.slice(0, 3).map((v) => v + 6)].flatMap((v) => [v * 3, v * 3 + 1, v * 3 + 2]) as unknown as Graph);

const base_c_cT = Array.from({ length: 24 }, (_v, i) => Rubik.Base.map((c) => c.find(i)));
const base_cT = base_c_cT[0];
const base_ccT = base_c_cT.map((l, i) => l[i]);
const base_turnT = [
    8, 18, 14,
    3, 9, 6,
    13, 15, 4,
    14, 18, 8,
    6, 9, 3,
    4, 15, 13,
];

class Build {
    private declare data: number[];
    static from(data: number[]) {
        const build = new this();
        build.data = data;
        return build;
    }
    private map(graph: Graph) {
        this.data.forEach((v, i) => this.data[i] = graph[v]);
        return this;
    }

    base(base: number) {
        return this.map(Base[base]);
    }
    coordinate(coordinate: number) {
        return this.map(Base[base_cT[coordinate]]);
    }
    similar(base: number) {
        this.map(Base[base]);
        this.map(Base[base_ccT[base]]);
        return this;
    }
    image() {
        this.map(Image);
        return this;
    }
    inverse() {
        this.data.reverse();
        this.map(Inverse);
        return this;
    }
    bits(t: number) {
        let graph = 0;
        Array.from({ length: this.data.length },
            (v: number = t & 1) => (t >>= 1, v)
        ).forEach((b, i) => {
            let v = this[i];
            v = Base[graph]?.[v] ?? v;
            if (v >= 18) return this.data[i] = v;
            if (b ^ (~~(v / 9))) graph = base_c_cT[graph][base_turnT[v]];
            this.data[i] = b * 9 + v % 9;
        });
        return this;
    }
    toString() {
        return this.data.map((v) => TurnNames[v]).join('');
    }
}

export function solve(rubik: Rubik.Rubik) {
    const { map, build } = data;
    for (const { rubik: { position }, image, inverse, base, coordinate } of Rubik.similarly(rubik, 15)) {
        if (!(position in build)) continue;
        const solve = Build.from(build[position].map((v) => Position[map[v]]));
        if (!inverse) solve.inverse();
        if (image) solve.image();
        return solve.base(((c) => image ? c.image() : c)(inverse ? base.inverse() : coordinate)[0]);
    }
    return false;
};
