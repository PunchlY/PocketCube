const { freeze, isFrozen } = Object;
const iterator8 = freeze([...Array(8).keys()]);
const CTMap = new WeakMap();
export const CT = CTMap.get.bind(CTMap);
const copyL = (...l) => l.map((v) => [...v]);
export const isNumber = (n) => n !== null && !isNaN(n);
const positionMap = new WeakMap();
const getPosition = (rubik) => {
    let position = positionMap.get(rubik);
    if (isNumber(position))
        return position;
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
const setPosition = (rubik, position) => {
    positionMap.set(rubik, position = (position & 2147483647) % 88179840);
    if (!position)
        CTMap.set(rubik, [[0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]]);
    const T = [], C = [];
    T.push((3 - Array.from({ length: 7 }).reduce((p, c = position % 3) => {
        T.push(c);
        position /= 3, position |= 0;
        return p + c;
    }, 0) % 3) % 3);
    iterator8.forEach(function (i) {
        C.push(this.splice(position % (8 - i), 1)[0]);
        position /= 8 - i, position |= 0;
    }, [...iterator8]);
    CTMap.set(rubik, [C, T]);
};
const at = ([C, T], i) => {
    return C.at(i) * 3 + T.at(i);
};
const copy = (rubik, constructor) => {
    constructor ??= rubik.constructor[Symbol.species];
    const copy = new constructor();
    CTMap.set(copy, copyL(...CT(rubik)));
    return copy;
};
const copyFreeze = (rubik) => isFrozen(rubik) ? copy(rubik) : rubik;
const action = (self, rubiks) => {
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
const inverse = (self) => {
    positionMap.set(self = copyFreeze(self), NaN);
    const [C, T] = CT(self);
    const [tC, tT] = copyL(C, T);
    tC.forEach((n, i) => {
        C[n] = i;
        T[n] = (3 - tT[i]) % 3;
    });
    return self;
};
const image = (self) => {
    positionMap.set(self = copyFreeze(self), NaN);
    const [C, T] = CT(self);
    const [tC, tT] = copyL(C, T);
    [1, 0, 3, 2, 5, 4, 7, 6].forEach((n, i, a) => {
        C[i] = a[tC[n]];
        T[i] = (3 - tT[n]) % 3;
    });
    return self;
};
const similarly = ((Ct) => function* (rawRubik, set, n, i) {
    for (const base of Rubik.Base) {
        const baseRubik = base.action(rawRubik).readonly();
        for (const coordinate of Ct(baseRubik, n, i)) {
            const rubik = baseRubik.action(coordinate).readonly();
            const { position } = rubik;
            if (set.has(position))
                continue;
            set.add(position);
            yield { rubik, base, coordinate };
        }
    }
})(function* (rubik, n, i) {
    if (isNumber(n))
        yield Rubik._Base[isNumber(i) ? i : ~~(n / 3)][rubik.find(n)];
    else
        for (const cT of Rubik.Base)
            yield cT;
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
    static get [Symbol.species]() { return this; }
    constructor(position) {
        setPosition(this, position);
    }
    get position() {
        return getPosition(this);
    }
    get length() { return 8; }
    get [Symbol.isConcatSpreadable]() { return true; }
    at(i) {
        return at(CT(this), i);
    }
    find(n) {
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
    action(...rubiks) {
        return action(this, rubiks);
    }
    inverse() {
        return inverse(this);
    }
    image() {
        return image(this);
    }
    similar(base) {
        const rubik = action(Rubik.Base[base], [this, Rubik.BaseT[base]]);
        if (isFrozen(this))
            return rubik;
        setPosition(this, rubik.position);
        return this;
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
        return basePosition[at(CT(this), 0)] === getPosition(this);
    }
    *similarly(n, i) {
        const rawRubik = copy(this, Rubik).readonly();
        const set = new Set();
        for (const [t, rubik] of [this, rawRubik.image(), rawRubik.inverse(), rawRubik.image().inverse()].entries()) {
            if (set.has(rubik.position))
                continue;
            for (const data of similarly(rubik, set, n, i))
                yield { ...data, image: !!(t & 1), inverse: !!(t & 2) };
        }
    }
    *congruent(n, i) {
        for (const data of similarly(this, new Set(), n, i))
            yield { ...data, image: false, inverse: false };
    }
    *similarlyNoCongruent(n, i) {
        const rawRubik = copy(this, Rubik).readonly();
        const set = new Set();
        for (const [t, rubik] of [, rawRubik.image(), rawRubik.inverse(), rawRubik.image().inverse()].entries()) {
            if (!rubik || set.has(rubik.position))
                continue;
            for (const data of similarly(rubik, set, n, i))
                yield { ...data, image: !!(t & 1), inverse: !!(t & 2) };
        }
    }
    solve(t) {
        return false;
    }
}
Object.defineProperties(Rubik.prototype, iterator8.map((i) => ({
    get() { return at(CT(this), i); },
    enumerable: true
})));
(function (Rubik) {
    var _a, _b;
    Rubik.isReadonly = isFrozen;
    Rubik.readonly = freeze;
    const Turn = (g) => new Rubik(g).readonly();
    Rubik.Base = freeze(basePosition.map(Turn));
    Rubik.BaseT = freeze(Rubik.Base.map((v) => Rubik.Base[v.find(0)]));
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
