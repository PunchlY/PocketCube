import { type Rubik } from './index.js';

export const __config = {
    species: null as typeof Rubik,
    solve: {} as Record<number, readonly number[]>,
};

export const iterator8 = [...Array(8).keys()];

type L = [number, number, number, number, number, number, number, number];
export const copy = (...ls: L[]) => ls.map((v) => [].concat(v) as L);
export const CTMap = new WeakMap<BaseRubik, [L, L]>();

function CTToPosition([C, T]: [L, L]) {
    const list = [8];
    return T.slice(0, -1).reduceRight((p, c) => p * 3 + c, C.reduceRight((p, c, i) => {
        const o = list.findIndex((v) => c < v);
        list.splice(o, 0, c);
        return p * (8 - i) + o;
    }, 0));
}
function positionToCT(position: number, rubik: BaseRubik) {
    position = ~~position;
    if (!position) CTMap.set(rubik, [[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]]);
    const T: L = [] as any, C: L = [] as any;
    T.push((3 - Array.from({ length: 7 } as number[]).reduce((p, c = position % 3) => {
        T.push(c);
        position = ~~(position / 3);
        return p + c;
    }, 0) % 3) % 3);
    iterator8.forEach(function (this: number[], i) {
        C.push(this.splice(position % (8 - i), 1)[0]);
        position = ~~(position / (8 - i));
    }, [...iterator8]);
    rubik && CTMap.set(rubik, [C, T]);
}

export interface BaseRubik extends ArrayLike<number>, Iterable<number> {
    position: number;
    readonly 0: number;
    readonly 1: number;
    readonly 2: number;
    readonly 3: number;
    readonly 4: number;
    readonly 5: number;
    readonly 6: number;
    readonly 7: number;
}
export class BaseRubik {
    constructor(position = 0) { // genotype %= 88179840;
        positionToCT(position, this);
    }
    at(i: number) {
        const [C, T] = CTMap.get(this);
        return C.at(i) * 3 + T.at(i);
    }
    find(n: number) {
        const [C, T] = CTMap.get(this);
        const p = C.indexOf(~~(n / 3) % 8);
        return p * 3 + (3 + (n % 3) - T[p]) % 3;
    }

    *[Symbol.iterator]() {
        const [C, T] = CTMap.get(this);
        for (let i = 0; i < 8; i++)
            yield C[i] * 3 + T[i];
    }
}
Object.defineProperties(BaseRubik.prototype, Object.assign({
    position: {
        get(this: BaseRubik) {
            return CTToPosition(CTMap.get(this));
        },
        set(this: BaseRubik, position: number) {
            positionToCT(position, this);
        },
    },
    length: { value: 8 },
    [Symbol.isConcatSpreadable]: { value: true },
}, iterator8.map((i) => ({
    get(this: BaseRubik) {
        const [C, T] = CTMap.get(this);
        return C[i] * 3 + T[i];
    },
})) as { [key: number]: PropertyDescriptor; }));

export function copyRubik(rubik: BaseRubik, constructor = __config.species) {
    const copy = new constructor();
    const [C, T] = CTMap.get(rubik);
    CTMap.set(copy, [[].concat(C) as L, [].concat(T) as L]);
    return copy;
}

export function action<T extends BaseRubik>(self: T, rubiks: Iterable<BaseRubik>) {
    const [C, T] = CTMap.get(self);
    for (const rubik of rubiks) {
        const [tC, tT] = copy(C, T);
        const [rC, rT] = CTMap.get(rubik);
        rC.forEach((n, i) => {
            C[i] = tC[n];
            T[i] = (tT[n] + rT[i]) % 3;
        });
    }
    return self;
}
