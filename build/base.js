export const __config = {
    species: null,
    solve: {},
};
export const iterator8 = [...Array(8).keys()];
export const copy = (...ls) => ls.map((v) => [].concat(v));
export const CTMap = new WeakMap();
function CTToPosition([C, T]) {
    const list = [8];
    return T.slice(0, -1).reduceRight((p, c) => p * 3 + c, C.reduceRight((p, c, i) => {
        const o = list.findIndex((v) => c < v);
        list.splice(o, 0, c);
        return p * (8 - i) + o;
    }, 0));
}
function positionToCT(position, rubik) {
    position = ~~position;
    if (!position)
        CTMap.set(rubik, [[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]]);
    const T = [], C = [];
    T.push((3 - Array.from({ length: 7 }).reduce((p, c = position % 3) => {
        T.push(c);
        position = ~~(position / 3);
        return p + c;
    }, 0) % 3) % 3);
    iterator8.forEach(function (i) {
        C.push(this.splice(position % (8 - i), 1)[0]);
        position = ~~(position / (8 - i));
    }, [...iterator8]);
    rubik && CTMap.set(rubik, [C, T]);
}
export class BaseRubik {
    constructor(position = 0) {
        positionToCT(position, this);
    }
    at(i) {
        const [C, T] = CTMap.get(this);
        return C.at(i) * 3 + T.at(i);
    }
    find(n) {
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
        get() {
            return CTToPosition(CTMap.get(this));
        },
        set(position) {
            positionToCT(position, this);
        },
    },
    length: { value: 8 },
    [Symbol.isConcatSpreadable]: { value: true },
}, iterator8.map((i) => ({
    get() {
        const [C, T] = CTMap.get(this);
        return C[i] * 3 + T[i];
    },
}))));
export function copyRubik(rubik, constructor = __config.species) {
    const copy = new constructor();
    const [C, T] = CTMap.get(rubik);
    CTMap.set(copy, [[].concat(C), [].concat(T)]);
    return copy;
}
export function action(self, rubiks) {
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
