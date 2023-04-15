const copy = (...ls) => ls.map((v) => [].concat(v));
const CTMap = new WeakMap();
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
    Array.from({ length: 8 }).forEach(function (_, i) {
        C.push(this.splice(position % (8 - i), 1)[0]);
        position = ~~(position / (8 - i));
    }, Array.from({ length: 8 }).map((v, i) => i));
    rubik && CTMap.set(rubik, [C, T]);
}
function copyRubik(rubik, constructor = Rubik) {
    const copy = new constructor();
    const [C, T] = CTMap.get(rubik);
    CTMap.set(copy, [[].concat(C), [].concat(T)]);
    return copy;
}
const action = (self, ...rubiks) => {
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
class BaseRubik {
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
}, Array.from({ length: 8 }).map((v, i) => ({
    get() {
        const [C, T] = CTMap.get(this);
        return C[i] * 3 + T[i];
    },
}))));
export class Turn extends BaseRubik {
    constructor(position) {
        super(position);
        Object.defineProperty(this, 'position', { get: () => position });
    }
    copy() {
        return copyRubik(this);
    }
    action(...rubiks) {
        return copyRubik(this).action(...rubiks);
    }
    inverse() {
        return copyRubik(this).inverse();
    }
    image() {
        return copyRubik(this).image();
    }
}
(function (Turn) {
    const { freeze } = Object;
    const $Turn = (g) => freeze(new Turn(g));
    Turn.C = freeze([
        0, 16219978, 2469029,
        33104619, 17954269, 49605440,
        51565086, 34630144, 3470675,
        84669705, 36364435, 50607086,
        18222084, 52672894, 36822425,
        51396687, 70206073, 38451740,
        40288914, 53569564, 84835823,
        73463517, 71102743, 86465138,
    ].map($Turn));
    Turn._C = freeze(Array.from({ length: 8 })
        .map((_, i) => Turn.C.slice().sort((c1, c2) => c1[i] - c2[i]))
        .map(freeze));
    Turn.X = freeze([Turn.C[14], Turn.C[18], Turn.C[8]]);
    Turn.Y = freeze([Turn.C[6], Turn.C[9], Turn.C[3]]);
    Turn.Z = [Turn.C[4], Turn.C[15], Turn.C[13]];
    Turn.R = freeze([77350359, 68566824, 50861415].map($Turn));
    Turn.U = freeze([51438240, 84505680, 33067440].map($Turn));
    Turn.F = freeze([21433374, 84383208, 62951382].map($Turn));
    Turn.L = freeze([15944780, 20238498, 22807586].map($Turn));
    Turn.D = freeze([37179, 164025, 126846].map($Turn));
    Turn.B = freeze([4540624, 5469687, 929887].map($Turn));
})(Turn || (Turn = {}));
export class Rubik extends BaseRubik {
    static get [Symbol.species]() {
        return Rubik;
    }
    static from(rubik) {
        if (rubik instanceof BaseRubik)
            return copyRubik(rubik, this);
        if (typeof rubik === 'number')
            return new this(rubik);
    }
    copy() {
        return copyRubik(this, this.constructor[Symbol.species]);
    }
    action(...rubiks) {
        return action(this, ...rubiks);
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
    *similar(n = NaN, i = 0) {
        const set = new Set();
        for (const [t, self] of [this, copyRubik(this).image(), copyRubik(this).inverse(), copyRubik(this).image().inverse()].entries())
            if (!set.has(self.position))
                for (const c of Turn.C) {
                    const _r = c.action(self);
                    for (const cT of function* () {
                        if (n === null || isNaN(n))
                            for (const cT of Turn.C)
                                yield cT;
                        else
                            yield Turn._C[i][_r.find(n)];
                    }()) {
                        const r = _r.copy().action(cT);
                        const genotype = r.position;
                        if (set.has(genotype))
                            continue;
                        set.add(genotype);
                        yield { r, c: [c, cT], image: !!(t & 1), inverse: !!(t & 2) };
                    }
                }
    }
    *congruent(n = NaN, i = 0) {
        const set = new Set();
        for (const c of Turn.C) {
            const _r = c.action(this);
            for (const cT of function* () {
                if (n === null || isNaN(n))
                    for (const cT of Turn.C)
                        yield cT;
                else
                    yield Turn._C[i][_r.find(n)];
            }()) {
                const r = _r.copy().action(cT);
                const genotype = r.position;
                if (set.has(genotype))
                    continue;
                set.add(genotype);
                yield { r, c: [c, cT], image: false, inverse: false };
            }
        }
    }
    *similarNoCongruence(n = NaN, i = 0) {
        const set = new Set();
        for (const [t, self] of [, copyRubik(this).image(), copyRubik(this).inverse(), copyRubik(this).image().inverse()].entries())
            if (self && !set.has(self.position))
                for (const c of Turn.C) {
                    const _r = c.action(self);
                    for (const cT of function* () {
                        if (n === null || isNaN(n))
                            for (const cT of Turn.C)
                                yield cT;
                        else
                            yield Turn._C[i][_r.find(n)];
                    }()) {
                        const r = _r.copy().action(cT);
                        const genotype = r.position;
                        if (set.has(genotype))
                            continue;
                        set.add(genotype);
                        yield { r, c: [c, cT], image: !!(t & 1), inverse: !!(t & 2) };
                    }
                }
    }
    do(scr) {
        scr = scr.replace(/\s/g, '');
        if (!/^([RUFLDBXYZ](2|'|))*$/.test(scr))
            return false;
        return action(this, ...[...scr.matchAll(/([RUFLDBXYZ])(2|'|)/g)
        ].map(([, t, p]) => Turn[t][{ '': 0, 2: 1, '\'': 2 }[p]]));
    }
}
export var solve;
(function (solve_1) {
    const turn = [...Turn.R, ...Turn.U, ...Turn.F];
    const solve = (eT, max = Infinity) => async function* () {
        const set = new Set();
        let map = new Map([[new Rubik(0), []]]), _map = new Map(), l = 0;
        while (l - 1 < max && map.size) {
            for (const [_r, build] of map) {
                const { position } = _r;
                if (set.has(position))
                    continue;
                if ((() => {
                    for (const { r: { position } } of _r.similarNoCongruence(0))
                        if (set.has(position))
                            return false;
                    return true;
                })())
                    yield { position, build };
                for (const { r } of _r.congruent(0))
                    set.add(r.position);
                eT.filter((n) => !build.length || ~~((build.at(-1) - n) / 3)).forEach((n) => _map.set(_r.copy().action(turn[n]), [...build, n]));
                eT.filter((n) => !build.length || ~~((build.at(0) - n) / 3)).forEach((n) => _map.set(_r.copy().action(turn[n]), [n, ...build]));
            }
            map = _map, _map = new Map(), l++;
        }
    };
    solve_1.halfOrQuarter = solve([
        0, 2,
        3, 5,
        6, 8,
        1, 4, 7
    ], 11);
    solve_1.quarter = solve([
        0, 2,
        3, 5,
        6, 8,
    ], 14);
})(solve || (solve = {}));
