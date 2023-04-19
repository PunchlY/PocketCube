const { freeze, isFrozen: $isReadonly } = Object;
const iterator8 = freeze([...Array(8).keys()]);
const $readonly = (rubik) => {
    if ($isReadonly(rubik))
        return rubik;
    Object.defineProperty(rubik, 'position', { value: CTToPosition(CT(rubik)) });
    Array.from({ length: 8 }, (v, i) => Object.defineProperty(rubik, i, { value: rubik[i] }));
    return freeze(rubik);
};
const CTMap = new WeakMap();
export const CT = CTMap.get.bind(CTMap);
const copyL = (...l) => l.map((v) => [...v]);
const CTToPosition = ([C, T]) => {
    const list = [8];
    return T.slice(0, -1).reduceRight((p, c) => p * 3 + c, C.reduceRight((p, c, i) => {
        const o = list.findIndex((v) => c < v);
        list.splice(o, 0, c);
        return p * (8 - i) + o;
    }, 0));
};
const positionToCT = (position, rubik) => {
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
};
const at = (rubik, i) => {
    const [C, T] = CT(rubik);
    return C.at(i) * 3 + T.at(i);
};
const copy = (rubik, constructor) => {
    constructor ??= rubik.constructor[Symbol.species];
    const copy = new constructor();
    CTMap.set(copy, copyL(...CT(rubik)));
    return copy;
};
const action = (self, rubiks) => {
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
const inverse = (self) => {
    const [C, T] = CT(self);
    const [tC, tT] = copyL(C, T);
    tC.forEach((n, i) => {
        C[n] = i;
        T[n] = (3 - tT[i]) % 3;
    });
    return self;
};
const image = (self) => {
    const [C, T] = CT(self);
    const [tC, tT] = copyL(C, T);
    [1, 0, 3, 2, 5, 4, 7, 6].forEach((n, i, a) => {
        C[i] = a[tC[n]];
        T[i] = (3 - tT[n]) % 3;
    });
    return self;
};
const similar = ((Ct) => function* (rawRubik, set, n, i) {
    for (const base of Rubik.Base) {
        const baseRubik = base.action(rawRubik);
        for (const coordinate of Ct(baseRubik, n, i)) {
            const rubik = Rubik.readonly(baseRubik.copy().action(coordinate));
            const { position } = rubik;
            if (set.has(position))
                continue;
            set.add(position);
            yield { rubik, base, coordinate };
        }
    }
})(function* (rubik, n, i = 0) {
    if (n === null || isNaN(n))
        for (const cT of Rubik.Base)
            yield cT;
    else
        yield Rubik._Base[i][rubik.find(n)];
});
const turnParse = ((table, aRegexp, gRegexp) => function* (scr) {
    scr = scr.replace(/\s/g, '');
    if (!aRegexp.test(scr))
        return false;
    for (const [, t, p] of scr.matchAll(gRegexp))
        yield Rubik[t][table[p]];
})({ '': 0, 2: 1, '\'': 2 }, /^([RUFLDBXYZ](2|'|))*$/, /([RUFLDBXYZ])(2|'|)/g);
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
export class Rubik {
    static isReadonly(rubik) {
        return $isReadonly(rubik);
    }
    static readonly(rubik) {
        return $readonly(rubik);
    }
    static get [Symbol.species]() {
        return this;
    }
    constructor(position = 0, readonly = false) {
        positionToCT(position, this);
        if (readonly)
            $readonly(this);
    }
    get position() {
        return CTToPosition(CT(this));
    }
    set position(position) {
        positionToCT(position, this);
    }
    get length() { return 8; }
    get [Symbol.isConcatSpreadable]() { return true; }
    at(i) {
        const [C, T] = CT(this);
        return C.at(i) * 3 + T.at(i);
    }
    find(n) {
        const [C, T] = CT(this);
        const p = C.indexOf(~~(n / 3) % 8);
        return p * 3 + (3 + (n % 3) - T[p]) % 3;
    }
    *[Symbol.iterator]() {
        const [C, T] = CT(this);
        for (let i = 0; i < 8; i++)
            yield C[i] * 3 + T[i];
    }
    copy(readonly) {
        const rubik = copy(this);
        if (readonly)
            $readonly(rubik);
        return rubik;
    }
    action(...rubiks) {
        return action($isReadonly(this) ? copy(this) : this, rubiks);
    }
    inverse() {
        return inverse($isReadonly(this) ? copy(this) : this);
    }
    image() {
        return image($isReadonly(this) ? copy(this) : this);
    }
    static from(rubik) {
        if (rubik instanceof Rubik)
            return copy(rubik, this[Symbol.species]);
        if (typeof rubik === 'number')
            return new this[Symbol.species](rubik);
    }
    do(scr) {
        if (!scr)
            return this;
        return action(this, turnParse(scr));
    }
    isReinstated() {
        return basePosition[this[0]] === this.position;
    }
    *similar(n, i) {
        const rubik = freeze(copy(this, Rubik));
        const set = new Set();
        for (const [t, self] of [this, rubik.image(), rubik.inverse(), rubik.image().inverse()].entries()) {
            if (set.has(self.position))
                continue;
            for (const s of similar(self, set, n, i))
                yield { ...s, image: !!(t & 1), inverse: !!(t & 2) };
        }
    }
    *congruent(n, i) {
        for (const s of similar(this, new Set(), n, i))
            yield { ...s, image: false, inverse: false };
    }
    *similarNoCongruence(n, i) {
        const rubik = freeze(copy(this, Rubik));
        const set = new Set();
        for (const [t, self] of [, rubik.image(), rubik.inverse(), rubik.image().inverse()].entries()) {
            if (!self || set.has(self.position))
                continue;
            for (const s of similar(self, set, n, i))
                yield { ...s, image: !!(t & 1), inverse: !!(t & 2) };
        }
    }
    solve(t) {
        return false;
    }
}
Object.defineProperties(Rubik.prototype, iterator8.map((i) => ({
    get() { return at(this, i); },
    enumerable: true
})));
(function (Rubik) {
    var _a, _b;
    const Turn = (g) => new Rubik(g, true);
    Rubik.Base = freeze(basePosition.map(Turn));
    Rubik._Base = freeze(iterator8.map((i) => freeze([...Rubik.Base].sort((c1, c2) => c1[i] - c2[i]))));
    _a = [
        [14, 18, 8],
        [6, 9, 3],
        [4, 15, 13],
    ].map((a) => freeze(a.map((n) => Rubik.Base[n]))), Rubik.X = _a[0], Rubik.Y = _a[1], Rubik.Z = _a[2];
    _b = [
        [77350359, 68566824, 50861415],
        [51438240, 84505680, 33067440],
        [21433374, 84383208, 62951382],
        [15944780, 20238498, 22807586],
        [37179, 164025, 126846],
        [4540624, 5469687, 929887],
    ].map((T) => freeze(T.map(Turn))), Rubik.R = _b[0], Rubik.U = _b[1], Rubik.F = _b[2], Rubik.L = _b[3], Rubik.D = _b[4], Rubik.B = _b[5];
})(Rubik || (Rubik = {}));
