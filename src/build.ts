import { Base, TurnNames, Turns, StringToTrunsIndex } from './util.js';

const Position: Record<number, number> = Object.fromEntries(Turns.map(({ position }, i) => [position, i]));

const Image_Graph = [
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
const Inverse_Graph = [
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
const Base_GraphList = [
    [0, 1, 2, 3, 4, 5], [1, 2, 0, 4, 5, 3], [2, 0, 1, 5, 3, 4],
    [2, 1, 3, 5, 4, 0], [1, 3, 2, 4, 0, 5], [3, 2, 1, 0, 5, 4],
    [5, 1, 0, 2, 4, 3], [1, 0, 5, 4, 3, 2], [0, 5, 1, 3, 2, 4],
    [3, 1, 5, 0, 4, 2], [1, 5, 3, 4, 2, 0], [5, 3, 1, 2, 0, 4],
    [2, 4, 0, 5, 1, 3], [4, 0, 2, 1, 3, 5], [0, 2, 4, 3, 5, 1],
    [3, 4, 2, 0, 1, 5], [4, 2, 3, 1, 5, 0], [2, 3, 4, 5, 0, 1],
    [0, 4, 5, 3, 1, 2], [4, 5, 0, 1, 2, 3], [5, 0, 4, 2, 3, 1],
    [5, 4, 3, 2, 1, 0], [4, 3, 5, 1, 0, 2], [3, 5, 4, 0, 2, 1],
].map((g) =>
    [...g, ...g.slice(0, 3).map((v) => v + 6)]
        .flatMap((v) => [v * 3, v * 3 + 1, v * 3 + 2])
);

const base_c_cT = Array.from({ length: 24 }, (_v, i) => Base.map((c) => c.find(i)));
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

function map(data: number[], graph: number[]) {
    data.forEach((v, i) => data[i] = graph[v]);
}

class Build {
    #data!: number[];
    static from(data: number[] | string) {
        const build = new Build();
        if (typeof data === 'string')
            build.#data = [...StringToTrunsIndex(data)];
        else
            build.#data = data;
        return build;
    }

    base(base: number) {
        map(this.#data, Base_GraphList[base]);
        return this;
    }
    coordinate(coordinate: number) {
        map(this.#data, Base_GraphList[base_cT[coordinate]]);
        return this;
    }
    similar(base: number) {
        map(this.#data, Base_GraphList[base]);
        map(this.#data, Base_GraphList[base_ccT[base]]);
        return this;
    }
    image() {
        map(this.#data, Image_Graph);
        return this;
    }
    inverse() {
        map(this.#data.reverse(), Inverse_Graph);
        return this;
    }
    bits(t: number) {
        let graph = 0;
        Array.from({ length: this.#data.length },
            (v: number = t & 1) => (t >>= 1, v)
        ).forEach((b, i) => {
            let v = this.#data[i];
            v = Base_GraphList[graph]?.[v] ?? v;
            if (v >= 18) return this.#data[i] = v;
            if (b ^ (~~(v / 9))) graph = base_c_cT[graph][base_turnT[v]];
            this.#data[i] = b * 9 + v % 9;
        });
        return this;
    }
    toString() {
        return this.#data.map((v) => TurnNames[v]).join('');
    }
}

export { Build, Position };
