type L = [number, number, number, number, number, number, number, number];
const copy = (...ls: L[]) => ls.map((v) => [].concat(v) as L);
const CTMap = new WeakMap<BaseRubik, [L, L]>();
const iterator8 = [...Array(8).keys()];
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
function copyRubik(rubik: BaseRubik, constructor = Rubik) {
    const copy = new constructor();
    const [C, T] = CTMap.get(rubik);
    CTMap.set(copy, [[].concat(C) as L, [].concat(T) as L]);
    return copy;
}
const action = <T extends BaseRubik>(self: T, rubiks: Iterable<BaseRubik>) => {
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
};

export { type BaseRubik };
interface BaseRubik extends ArrayLike<number>, Iterable<number> {
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
class BaseRubik {
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

export interface Turn {
    readonly position: number;
}
export class Turn extends BaseRubik {
    constructor(position?: number) {
        super(position);
        Object.defineProperty(this, 'position', { get: () => position });
    }

    copy() {
        return copyRubik(this);
    }
    action(...rubiks: BaseRubik[]) {
        return copyRubik(this).action(...rubiks);
    }
    inverse() {
        return copyRubik(this).inverse();
    }
    image() {
        return copyRubik(this).image();
    }
}

export namespace Turn {
    const { freeze } = Object;
    const $Turn = (g: number) => freeze(new Turn(g));
    type RTurn = Readonly<Turn>;
    type Turns = readonly [RTurn, RTurn, RTurn];
    type C = readonly [...Turns, ...Turns, ...Turns, ...Turns, ...Turns, ...Turns, ...Turns, ...Turns];
    type _C = readonly [C, C, C, C, C, C, C, C];

    export const C = freeze([
        0, 16219978, 2469029,
        33104619, 17954269, 49605440,
        51565086, 34630144, 3470675,
        84669705, 36364435, 50607086,
        18222084, 52672894, 36822425,
        51396687, 70206073, 38451740,
        40288914, 53569564, 84835823,
        73463517, 71102743, 86465138,
    ].map($Turn)) as C;

    export const _C = freeze(iterator8.map(
        (i) => freeze([...Turn.C].sort((c1, c2) => c1[i] - c2[i]))
    )) as _C;

    export const X = freeze([C[14], C[18], C[8]] as const);
    export const Y = freeze([C[6], C[9], C[3]] as const);
    export const Z = [C[4], C[15], C[13]] as const;

    export const R = freeze([77350359, 68566824, 50861415].map($Turn)) as Turns;
    export const U = freeze([51438240, 84505680, 33067440].map($Turn)) as Turns;
    export const F = freeze([21433374, 84383208, 62951382].map($Turn)) as Turns;
    export const L = freeze([15944780, 20238498, 22807586].map($Turn)) as Turns;
    export const D = freeze([37179, 164025, 126846].map($Turn)) as Turns;
    export const B = freeze([4540624, 5469687, 929887].map($Turn)) as Turns;
}

const similar = ((CT) => function* (rubik: Rubik, set: Set<number>, n?: number, i?: number) {
    for (const c of Turn.C) {
        const _r = c.action(rubik);
        for (const cT of CT(_r, n, i)) {
            const r = _r.copy().action(cT);
            const { position } = r;
            if (set.has(position)) continue;
            set.add(position);
            yield { r, c: [c, cT] as const };
        }
    }
})(function* (rubik: Rubik, n?: number, i = 0) {
    if (n === null || isNaN(n)) for (const cT of Turn.C) yield cT;
    else yield Turn._C[i][rubik.find(n)];
});

const TurnParse = ((table, aregexp, gRegexp) => function* (scr: string) {
    scr = scr.replace(/\s/g, '');
    if (!aregexp.test(scr)) return false;
    for (const [, t, p] of scr.matchAll(gRegexp))
        yield Turn[t][table[p]] as Readonly<Turn>;
})({ '': 0, 2: 1, '\'': 2 }, /^([RUFLDBXYZ](2|'|))*$/, /([RUFLDBXYZ])(2|'|)/g);

export class Rubik extends BaseRubik {
    static get [Symbol.species]() {
        return Rubik;
    }
    static from(rubik: BaseRubik | number) {
        if (rubik instanceof BaseRubik)
            return copyRubik(rubik, this);
        if (typeof rubik === 'number')
            return new this(rubik);
    }
    copy() {
        return copyRubik(this, this.constructor[Symbol.species]);
    }
    action(...rubiks: BaseRubik[]) {
        return action(this, rubiks);
    }
    inverse() {
        const [C, T] = CTMap.get(this);
        const [tC, tT] = copy(C, T);
        tC.forEach((n, i) => {
            C[n] = i;
            T[n] = (3 - tT[i]) % 3;
        });
        return this;
    }
    image() {
        const [C, T] = CTMap.get(this);
        const [tC, tT] = copy(C, T);
        [1, 0, 3, 2, 5, 4, 7, 6].forEach((n, i, a) => {
            C[i] = a[tC[n]];
            T[i] = (3 - tT[n]) % 3;
        });
        return this;
    }

    isReinstated() {
        return [
            0, 16219978, 2469029,
            33104619, 17954269, 49605440,
            51565086, 34630144, 3470675,
            84669705, 36364435, 50607086,
            18222084, 52672894, 36822425,
            51396687, 70206073, 38451740,
            40288914, 53569564, 84835823,
            73463517, 71102743, 86465138,
        ][super[0]] === super.position;
    }

    *similar(n?: number, i?: number) {
        const set = new Set<number>();
        for (const [t, self] of [this, copyRubik(this).image(), copyRubik(this).inverse(), copyRubik(this).image().inverse()].entries()) {
            if (set.has(self.position)) continue;
            for (const s of similar(self, set, n, i))
                yield { ...s, image: !!(t & 1), inverse: !!(t & 2) };
        }
    }
    *congruent(n?: number, i?: number) {
        for (const s of similar(this, new Set(), n, i))
            yield { ...s, image: false, inverse: false };
    }
    *similarNoCongruence(n?: number, i?: number) {
        const set = new Set<number>();
        for (const [t, self] of [, copyRubik(this).image(), copyRubik(this).inverse(), copyRubik(this).image().inverse()].entries()) {
            if (!self || set.has(self.position)) continue;
            for (const s of similar(self, set, n, i))
                yield { ...s, image: !!(t & 1), inverse: !!(t & 2) };
        }
    }

    do(scr: string) {
        return action(
            this,
            TurnParse(scr),
        );
    }
}

export namespace Solve {
    const turn = [...Turn.R, ...Turn.U, ...Turn.F] as const;
    const solve = (eT: number[], max = Infinity) => async function* () {
        const set = new Set();
        let map = new Map([[new Rubik(0), [] as number[]]]), _map = new Map(), l = 0;
        while (l - 1 < max && map.size) {
            for (const [_r, build] of map) {
                const { position } = _r;
                if (set.has(position)) continue;
                const min = {
                    position,
                    build,
                };
                if ((() => {
                    for (const data of _r.similarNoCongruence(0)) {
                        const { r: { position } } = data;
                        if (set.has(position)) return false;
                        if (position > min.position) continue;
                        min.position = position;
                        min.build = transform(build, data, 0);
                    }
                    return true;
                })()) yield min;
                for (const { r } of _r.congruent(0)) set.add(r.position);
                eT.filter((n) => !build.length || ~~((build.at(-1) - n) / 3)).forEach((n) => _map.set(
                    _r.copy().action(turn[n]),
                    [...build, n],
                ));
                eT.filter((n) => !build.length || ~~((build.at(0) - n) / 3)).forEach((n) => _map.set(
                    turn[n].action(_r),
                    [n, ...build],
                ));
            }
            map = _map, _map = new Map(), l++;
        }
    };
    export const halfOrQuarter = solve([
        0, 2,
        3, 5,
        6, 8,
        1, 4, 7
    ], 11);
    export const quarter = solve([
        0, 2,
        3, 5,
        6, 8,
    ], 14);


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
    const RM = [
        M[14], M[18], M[8],
        M[6], M[9], M[3],
        M[4], M[15], M[13],
        M[8], M[18], M[14],
        M[3], M[9], M[6],
        M[13], M[15], M[4],
    ] as const;

    const transformC = (raw: number[], cT?: Readonly<Turn>) => {
        if (!cT) return raw;
        return raw.map(function (this: number[], v) {
            return this[~~(v / 3)] * 3 + v % 3;
        }, M[cT[0]]);
    };
    const transformB = (raw: number[], t = NaN) => {
        if (t === null || isNaN(t)) return raw;
        return ((r, tl) =>
            r ? tl.reverse() : tl
        )(
            t < 0 && (t = ~t, true),
            Array.from({ length: raw.length },
                (v: number = t & 1) => (t >>= 1, v)
            ),
        ).map(function (this: number[], b, i) {
            let v = raw[i];
            v = this[~~(v / 3)] * 3 + v % 3;
            if (b ^ ~~(v / 9)) this.map((p, i) => this[i] = RM[v][p]);
            return b * 9 + v % 9;
        }, [0, 1, 2, 3, 4, 5]);
    };
    export const transform = (raw: number[], {
        image,
        inverse,
        c: [c, cT],
    }: {
        image: boolean;
        inverse: boolean;
        c: readonly [Readonly<Turn>, Readonly<Turn>];
    }, t = NaN) => {
        if (image)
            raw = raw.map((v) => (~~(v / 3) || 3) * 3 + (2 - v % 3));
        if (inverse)
            raw = raw.reverse().map((v) => ~~(v / 3) * 3 + (2 - v % 3));
        return transformB(transformC(raw, ((c) => image ? c.image() : c)(inverse ? cT : c.inverse())), t);
    };
    export const stringify = (raw: number[], t = NaN) => transformB(raw, t).map((v) => Re[v]).join('');

}
