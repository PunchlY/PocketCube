import { BaseRubik, copyRubik, action, CTMap, copy, __config } from './base.js';
import { Turn } from './turn.js';
export var Solve;
(function (Solve) {
    const turn = [...Turn.R, ...Turn.U, ...Turn.F];
    const solve = (eT, max = Infinity) => async function* () {
        const set = new Set();
        let map = new Map([[new Rubik(0), []]]), _map = new Map(), l = 0;
        while (l - 1 < max && map.size) {
            for (const [_r, build] of map) {
                const { position } = _r;
                if (set.has(position))
                    continue;
                const min = {
                    position,
                    build,
                };
                if ((() => {
                    for (const data of _r.similarNoCongruence(0)) {
                        const { r: { position } } = data;
                        if (set.has(position))
                            return false;
                        if (position > min.position)
                            continue;
                        min.position = position;
                        min.build = Solve.transform(build, data, 0);
                    }
                    return true;
                })())
                    yield min;
                for (const { r } of _r.congruent(0))
                    set.add(r.position);
                eT.filter((n) => !build.length || ~~((build.at(-1) - n) / 3)).forEach((n) => _map.set(_r.copy().action(turn[n]), [...build, n]));
                eT.filter((n) => !build.length || ~~((build.at(0) - n) / 3)).forEach((n) => _map.set(turn[n].action(_r), [n, ...build]));
            }
            map = _map, _map = new Map(), l++;
        }
    };
    Solve.halfOrQuarter = solve([
        0, 2,
        3, 5,
        6, 8,
        1, 4, 7
    ], 11);
    Solve.quarter = solve([
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
    ];
    const M = [
        [0, 1, 2, 3, 4, 5], [1, 2, 0, 4, 5, 3], [2, 0, 1, 5, 3, 4],
        [2, 1, 3, 5, 4, 0], [1, 3, 2, 4, 0, 5], [3, 2, 1, 0, 5, 4],
        [5, 1, 0, 2, 4, 3], [1, 0, 5, 4, 3, 2], [0, 5, 1, 3, 2, 4],
        [3, 1, 5, 0, 4, 2], [1, 5, 3, 4, 2, 0], [5, 3, 1, 2, 0, 4],
        [2, 4, 0, 5, 1, 3], [4, 0, 2, 1, 3, 5], [0, 2, 4, 3, 5, 1],
        [3, 4, 2, 0, 1, 5], [4, 2, 3, 1, 5, 0], [2, 3, 4, 5, 0, 1],
        [0, 4, 5, 3, 1, 2], [4, 5, 0, 1, 2, 3], [5, 0, 4, 2, 3, 1],
        [5, 4, 3, 2, 1, 0], [4, 3, 5, 1, 0, 2], [3, 5, 4, 0, 2, 1],
    ];
    const RM = [
        M[14], M[18], M[8],
        M[6], M[9], M[3],
        M[4], M[15], M[13],
        M[8], M[18], M[14],
        M[3], M[9], M[6],
        M[13], M[15], M[4],
    ];
    const transformC = (raw, cT) => {
        if (!cT)
            return raw;
        return raw.map(function (v) {
            return this[~~(v / 3)] * 3 + v % 3;
        }, M[cT[0]]);
    };
    const transformB = (raw, t = NaN) => {
        if (t === null || isNaN(t))
            return raw;
        return ((r, tl) => r ? tl.reverse() : tl)(t < 0 && (t = ~t, true), Array.from({ length: raw.length }, (v = t & 1) => (t >>= 1, v))).map(function (b, i) {
            let v = raw[i];
            v = this[~~(v / 3)] * 3 + v % 3;
            if (b ^ ~~(v / 9))
                this.map((p, i) => this[i] = RM[v][p]);
            return b * 9 + v % 9;
        }, [0, 1, 2, 3, 4, 5]);
    };
    Solve.transform = (raw, { image, inverse, c: [c, cT], }, t = NaN) => {
        if (image)
            raw = raw.map((v) => (~~(v / 3) || 3) * 3 + (2 - v % 3));
        if (inverse)
            raw = raw.reverse().map((v) => ~~(v / 3) * 3 + (2 - v % 3));
        return transformB(transformC(raw, ((c) => image ? c.image() : c)(inverse ? cT : c.inverse())), t);
    };
    Solve.stringify = (raw, t = NaN) => transformB(raw, t).map((v) => Re[v]).join('');
})(Solve || (Solve = {}));
const similar = ((CT) => function* (rubik, set, n, i) {
    for (const c of Turn.C) {
        const _r = c.action(rubik);
        for (const cT of CT(_r, n, i)) {
            const r = _r.copy().action(cT);
            const { position } = r;
            if (set.has(position))
                continue;
            set.add(position);
            yield { r, c: [c, cT] };
        }
    }
})(function* (rubik, n, i = 0) {
    if (n === null || isNaN(n))
        for (const cT of Turn.C)
            yield cT;
    else
        yield Turn._C[i][rubik.find(n)];
});
const turnParse = ((table, aregexp, gRegexp) => function* (scr) {
    scr = scr.replace(/\s/g, '');
    if (!aregexp.test(scr))
        return false;
    for (const [, t, p] of scr.matchAll(gRegexp))
        yield Turn[t][table[p]];
})({ '': 0, 2: 1, '\'': 2 }, /^([RUFLDBXYZ](2|'|))*$/, /([RUFLDBXYZ])(2|'|)/g);
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
    *similar(n, i) {
        const set = new Set();
        for (const [t, self] of [this, copyRubik(this).image(), copyRubik(this).inverse(), copyRubik(this).image().inverse()].entries()) {
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
        const set = new Set();
        for (const [t, self] of [, copyRubik(this).image(), copyRubik(this).inverse(), copyRubik(this).image().inverse()].entries()) {
            if (!self || set.has(self.position))
                continue;
            for (const s of similar(self, set, n, i))
                yield { ...s, image: !!(t & 1), inverse: !!(t & 2) };
        }
    }
    do(scr) {
        return action(this, turnParse(scr));
    }
}
(function (Rubik) {
    function $solve(rubik) {
        const { solve } = __config;
        for (const data of rubik.similar(0)) {
            const { r: { position }, inverse } = data;
            if (!(position in solve))
                continue;
            data.inverse = !inverse;
            return Solve.transform([...solve[position]], data);
        }
    }
    ;
    Rubik.prototype.solve = function solve(t = NaN) {
        return Solve.stringify($solve(this), t);
    };
    const { stringify } = Solve;
    function solve(scr, t = NaN) {
        const rubik = new Rubik(0).do(scr);
        if (!rubik)
            return false;
        return stringify($solve(rubik), t);
    }
    Rubik.solve = solve;
    function* solveAll(scr, reverse = false) {
        const rubik = new Rubik(0).do(scr);
        if (!rubik)
            return false;
        const solve = $solve(rubik);
        const max = 1 << solve.length;
        for (let t = 0; t < max; t++)
            yield stringify(solve, reverse ? ~t : t);
    }
    Rubik.solveAll = solveAll;
})(Rubik || (Rubik = {}));
__config.species = Rubik;
