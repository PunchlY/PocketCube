import type { Solver } from './solver.js';

const { freeze, isFrozen } = Object;
const iterator8 = freeze([...Array(8).keys()]);

type L = [number, number, number, number, number, number, number, number];
const CTMap = new WeakMap<Rubik | Readonly<Rubik>, CT>();
export type CT = [L, L];
export const CT: typeof CTMap.get = CTMap.get.bind(CTMap);
const copyL = (...l: CT) => l.map((v) => [...v] as L) as CT;

export const isNumber = (n: any): n is number => n !== null && !isNaN(n);

const positionMap = new WeakMap<Rubik, number>();
const getPosition = (rubik: Rubik) => {
    let position = positionMap.get(rubik);
    if (isNumber(position)) return position;
    const [C, T] = CT(rubik);
    const list = [8];
    position = T.slice(0, -1).reduceRight((p, c) => p * 3 + c, C.reduceRight((p, c, i) => {
        const o = list.findIndex((v) => c < v);
        list.splice(o, 0, c);
        return p * (8 - i) + o;
    }, 0));
    positionMap.set(rubik, position);
    return position;
};
const setPosition = (rubik: Rubik, position: number) => {
    positionMap.set(rubik, position = (position & 2147483647) % 88179840);
    if (!position) CTMap.set(rubik, [[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]]);
    const T: L = [] as any, C: L = [] as any;
    T.push((3 - Array.from({ length: 7 } as number[]).reduce((p, c = position % 3) => {
        T.push(c);
        position /= 3, position |= 0;
        return p + c;
    }, 0) % 3) % 3);
    iterator8.forEach(function (this: number[], i) {
        C.push(this.splice(position % (8 - i), 1)[0]);
        position /= 8 - i, position |= 0;
    }, [...iterator8]);
    CTMap.set(rubik, [C, T]);
};

const at = ([C, T]: CT, i: number) => {
    return C.at(i) * 3 + T.at(i);
};

const copy = <T extends Rubik>(rubik: Rubik, constructor?: new (...arg: any) => T) => {
    constructor ??= rubik.constructor[Symbol.species];
    const copy = new constructor();
    CTMap.set(copy, copyL(...CT(rubik)));
    return copy;
};
const copyFreeze = <T extends Rubik>(rubik: T | Readonly<T>): T => isFrozen(rubik) ? copy(rubik) : rubik;
const action = <T extends Rubik>(self: T | Readonly<T>, rubiks: Iterable<Rubik | Readonly<Rubik>>): T => {
    positionMap.set(self = copyFreeze(self), NaN);
    const [C, T] = CT(self);
    for (const rubik of rubiks) {
        const [tC, tT] = copyL(C, T);
        const [rC, rT] = CT(rubik);
        rC.forEach((n, i) => {
            C[i] = tC[n];
            T[i] = (tT[n] + rT[i]) % 3;
        });
    }
    return self;
};
const inverse = <T extends Rubik>(self: T | Readonly<T>): T => {
    positionMap.set(self = copyFreeze(self), NaN);
    const [C, T] = CT(self);
    const [tC, tT] = copyL(C, T);
    tC.forEach((n, i) => {
        C[n] = i;
        T[n] = (3 - tT[i]) % 3;
    });
    return self;
};
const image = <T extends Rubik>(self: T | Readonly<T>): T => {
    positionMap.set(self = copyFreeze(self), NaN);
    const [C, T] = CT(self);
    const [tC, tT] = copyL(C, T);
    [1, 0, 3, 2, 5, 4, 7, 6].forEach((n, i, a) => {
        C[i] = a[tC[n]];
        T[i] = (3 - tT[n]) % 3;
    });
    return self;
};

export namespace Rubik {
    export interface Similar {
        rubik: Readonly<Rubik>;
        image: boolean;
        inverse: boolean;
        base: Readonly<Rubik>;
        coordinate: Readonly<Rubik>;
    }
    export interface Congruent extends Similar {
        image: false;
        inverse: false;
    }
}
const similarly = ((Ct) =>
    function* (rawRubik: Rubik, set: Set<number>, n?: number, i?: number) {
        for (const base of Rubik.Base) {
            const baseRubik = base.action(rawRubik).readonly();
            for (const coordinate of Ct(baseRubik, n, i)) {
                const rubik = baseRubik.action(coordinate).readonly();
                const { position } = rubik;
                if (set.has(position)) continue;
                set.add(position);
                yield { rubik, base, coordinate };
            }
        }
    }
)(function* (rubik: Rubik, n?: number, i?: number) {
    if (isNumber(n))
        yield Rubik._Base[isNumber(i) ? i : ~~(n / 3)][rubik.find(n)];
    else for (const cT of Rubik.Base) yield cT;
});

const turnParse = ((table, aRegexp, gRegexp) =>
    function* (scr: string) {
        scr = scr.replace(/\s/g, '');
        if (!aRegexp.test(scr)) return false;
        for (const [, t, p] of scr.matchAll(gRegexp))
            yield Rubik[t][table[p]] as Readonly<Rubik>;
    }
)({ '': 0, 2: 1, '\'': 2 }, /^([RUFLDBXYZ](2|'|))*$/, /([RUFLDBXYZ])(2|'|)/g);

const basePosition = [
    0, 16219978, 2469029,
    33104619, 17954269, 49605440,
    51565086, 34630144, 3470675,
    84669705, 36364435, 50607086,
    18222084, 52672894, 36822425,
    51396687, 70206073, 38451740,
    40288914, 53569564, 84835823,
    73463517, 71102743, 86465138,
];

export interface Rubik extends Solver, ArrayLike<number>, Iterable<number> {
    readonly 0: number;
    readonly 1: number;
    readonly 2: number;
    readonly 3: number;
    readonly 4: number;
    readonly 5: number;
    readonly 6: number;
    readonly 7: number;
}
export class Rubik {
    static get [Symbol.species]() { return this; }
    constructor(position?: number) { // genotype %= 88179840;
        setPosition(this, position);
    }

    get position() {
        return getPosition(this);
    }
    get length() { return 8; }
    get [Symbol.isConcatSpreadable]() { return true; }
    at(i: number) {
        return at(CT(this), i);
    }
    find(n: number) {
        const [C, T] = CT(this);
        const p = C.indexOf(~~(n / 3) % 8);
        return p * 3 + (3 + (n % 3) - T[p]) % 3;
    }
    *[Symbol.iterator]() {
        const _CT = CT(this);
        for (let i = 0; i < 8; i++)
            yield at(_CT, i);
    }

    readonly() {
        return freeze(this);
    }
    copy() {
        return copy(this);
    }
    action(...rubiks: (Rubik | Readonly<Rubik>)[]): Rubik | this {
        return action(this, rubiks);
    }
    inverse(): Rubik | this {
        return inverse(this);
    }
    image(): Rubik | this {
        return image(this);
    }
    similar(base: number): Rubik | this {
        const rubik = action(Rubik.Base[base], [this, Rubik.BaseT[base]]);
        if (isFrozen(this)) return rubik;
        setPosition(this, rubik.position);
        return this;
    }

    static from(rubik: Rubik | number) {
        if (rubik instanceof Rubik)
            return copy(rubik, this[Symbol.species]);
        if (typeof rubik === 'number')
            return new this[Symbol.species](rubik);
    }

    do(scr: string): Rubik | this {
        if (!scr) return this;
        return action(this, turnParse(scr));
    }

    isReinstated() {
        return basePosition[at(CT(this), 0)] === getPosition(this);
    }

    *similarly(n?: number, i?: number) {
        const rawRubik = copy(this, Rubik).readonly();
        const set = new Set<number>();
        for (const [t, rubik] of [this, rawRubik.image(), rawRubik.inverse(), rawRubik.image().inverse()].entries()) {
            if (set.has(rubik.position)) continue;
            for (const data of similarly(rubik, set, n, i))
                yield { ...data, image: !!(t & 1), inverse: !!(t & 2) } as Rubik.Similar;
        }
    }
    *congruent(n?: number, i?: number) {
        for (const data of similarly(this, new Set(), n, i))
            yield { ...data, image: false, inverse: false } as Rubik.Congruent;
    }
    *similarlyNoCongruent(n?: number, i?: number) {
        const rawRubik = copy(this, Rubik).readonly();
        const set = new Set<number>();
        for (const [t, rubik] of [, rawRubik.image(), rawRubik.inverse(), rawRubik.image().inverse()].entries()) {
            if (!rubik || set.has(rubik.position)) continue;
            for (const data of similarly(rubik, set, n, i))
                yield { ...data, image: !!(t & 1), inverse: !!(t & 2) } as Rubik.Similar;
        }
    }
    solve(t?: number): string | false {
        return false;
    }
}
Object.defineProperties(Rubik.prototype, iterator8.map((i) => ({
    get(this: Rubik) { return at(CT(this), i); },
    enumerable: true
} as PropertyDescriptor)) as { [key: number]: PropertyDescriptor; });

export namespace Rubik {
    export const isReadonly: (rubik: Rubik | Readonly<Rubik>) => boolean = isFrozen;
    export const readonly: <T extends Rubik>(rubik: T | Readonly<T>) => Readonly<T> = freeze;

    const Turn = (g: number) => new Rubik(g).readonly() as Readonly<Rubik>;

    type Turn = Readonly<Rubik>;
    type Turns = readonly [Turn, Turn, Turn];
    type Base = readonly [...Turns, ...Turns, ...Turns, ...Turns, ...Turns, ...Turns, ...Turns, ...Turns];
    type _Base = readonly [Base, Base, Base, Base, Base, Base, Base, Base];

    export const Base = freeze(basePosition.map(Turn)) as Base;

    export const BaseT = freeze(Base.map((v) => Base[v.find(0)])) as Base;

    export const _Base = freeze(iterator8.map(
        (i) => freeze([...Base].sort((c1, c2) => c1[i] - c2[i]))
    )) as _Base;
    export const [X, Y, Z] = [
        [14, 18, 8],
        [6, 9, 3],
        [4, 15, 13],
    ].map((a) => freeze(a.map((n) => Base[n])) as Turns);
    export const [R, U, F, L, D, B] = [
        [77350359, 68566824, 50861415],
        [51438240, 84505680, 33067440],
        [21433374, 84383208, 62951382],
        [15944780, 20238498, 22807586],
        [37179, 164025, 126846],
        [4540624, 5469687, 929887],
    ].map((T) => freeze(T.map(Turn)) as Turns);
}
