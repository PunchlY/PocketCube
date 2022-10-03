!function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(module) :
        typeof define === 'function' && define.amd ? define(['module'], factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Rubik = factory({}));
}(this, function (module) {
    'use strict';
    class BaseRubik {
        constructor(position = 0) { // genotype %= 88179840;
            position = ~~position;
            if (!position) return;
            const T = this.#T = [], C = this.#C = [];
            T.push((3 - Array.from({ length: 7 }).reduce((p, c) => {
                T.push(c = position % 3);
                position = ~~(position / 3);
                return p + c;
            }, 0) % 3) % 3);
            Array.from({ length: 8 }).forEach(function (_, i) {
                C.push(this.splice(position % (8 - i), 1)[0]);
                position = ~~(position / (8 - i));
            }, Array.from({ length: 8 }).map((v, i) => i));
        }
        #C = [0, 1, 2, 3, 4, 5, 6, 7];
        #T = [0, 0, 0, 0, 0, 0, 0, 0];
        get position() {
            const list = [8];
            return this.#T.slice(0, -1).reduceRight((p, c) => p * 3 + c, this.#C.reduceRight((p, c, i) => {
                const o = list.findIndex((v) => c < v);
                list.splice(o, 0, c);
                return p * (8 - i) + o;
            }, 0));
        }

        at(i) {
            return this.#C[i] * 3 + this.#T[i];
        }
        find(n) {
            const p = this.#C.indexOf(~~(n / 3) % 8);
            return p * 3 + (3 + (n % 3) - this.#T[p]) % 3;
        }

        *[Symbol.iterator]() { for (let i = 0; i < 8; i++) yield this.#C[i] * 3 + this.#T[i] }
        get [0]() { return this.#C[0] * 3 + this.#T[0] }
        get [1]() { return this.#C[1] * 3 + this.#T[1] }
        get [2]() { return this.#C[2] * 3 + this.#T[2] }
        get [3]() { return this.#C[3] * 3 + this.#T[3] }
        get [4]() { return this.#C[4] * 3 + this.#T[4] }
        get [5]() { return this.#C[5] * 3 + this.#T[5] }
        get [6]() { return this.#C[6] * 3 + this.#T[6] }
        get [7]() { return this.#C[7] * 3 + this.#T[7] }

        copy() {
            const copy = new this.constructor[Symbol.species]();
            copy.#C = [].concat(this.#C), copy.#T = [].concat(this.#T);
            return copy;
        }
        action(...rubiks) {
            rubiks.forEach((rubik) => {
                if (!(rubik instanceof BaseRubik)) throw '';
                const C = [], T = [];
                rubik.#C.forEach((n, i) => {
                    C[i] = this.#C[n];
                    T[i] = (this.#T[n] + rubik.#T[i]) % 3;
                });
                this.#C = C, this.#T = T;
            });
            return this;
        }
        inverse() {
            const C = [], T = [];
            this.#C.forEach((n, i) => {
                C[n] = i;
                T[n] = (3 - this.#T[i]) % 3;
            });
            this.#C = C, this.#T = T;
            return this;
        }
        image() {
            const C = [], T = [];
            [1, 0, 3, 2, 5, 4, 7, 6].forEach((n, i, a) => {
                C[i] = a[this.#C[n]];
                T[i] = (3 - this.#T[n]) % 3;
            });
            this.#C = C, this.#T = T;
            return this;
        }
    }
    BaseRubik.prototype.length = 8;
    BaseRubik.prototype[Symbol.isConcatSpreadable] = true;

    class Turn extends BaseRubik {
        action(...divisors) {
            return super.copy().action(...divisors);
        }
        inverse() {
            return super.copy().inverse();
        }
        image() {
            return super.copy().image();
        }
        static C = [
            0, 16219978, 2469029,
            33104619, 17954269, 49605440,
            51565086, 34630144, 3470675,
            84669705, 36364435, 50607086,
            18222084, 52672894, 36822425,
            51396687, 70206073, 38451740,
            40288914, 53569564, 84835823,
            73463517, 71102743, 86465138,
        ].map((g) => new this(g));
        static _C = Array.from({ length: 8 }).map((_, i) => this.C.slice().sort((c1, c2) => c1[i] - c2[i]));
        static X = [this.C[14], this.C[18], this.C[8]];
        static Y = [this.C[6], this.C[9], this.C[3]];
        static Z = [this.C[4], this.C[15], this.C[13]];
        static R = [77350359, 68566824, 50861415].map((g) => new this(g));
        static U = [51438240, 84505680, 33067440].map((g) => new this(g));
        static F = [21433374, 84383208, 62951382].map((g) => new this(g));
        static L = [15944780, 20238498, 22807586].map((g) => new this(g));
        static D = [37179, 164025, 126846].map((g) => new this(g));
        static B = [4540624, 5469687, 929887].map((g) => new this(g));
    }
    class Rubik extends BaseRubik {
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
            ][this[0]] === this.position;
        }

        *similar(n = NaN, i = 0) {
            const set = new Set();
            for (const [t, self] of [this, this.copy().image(), this.copy().inverse(), this.copy().image().inverse()].entries()) if (!set.has(self.position)) for (const c of Turn.C) {
                const _r = c.action(self);
                for (const cT of function* () {
                    if (n === null || isNaN(n)) for (const cT of Turn.C) yield cT;
                    else yield Turn._C[i][_r.find(n)];
                }()) {
                    const r = _r.copy().action(cT);
                    const genotype = r.position;
                    if (set.has(genotype)) continue;
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
                    if (n === null || isNaN(n)) for (const cT of Turn.C) yield cT;
                    else yield Turn._C[i][_r.find(n)];
                }()) {
                    const r = _r.copy().action(cT);
                    const genotype = r.position;
                    if (set.has(genotype)) continue;
                    set.add(genotype);
                    yield { r, c: [c, cT], image: false, inverse: false };
                }
            }
        }
        *similarNoCongruence(n = NaN, i = 0) {
            const set = new Set();
            for (const [t, self] of [, this.copy().image(), this.copy().inverse(), this.copy().image().inverse()].entries()) if (self && !set.has(self.position)) for (const c of Turn.C) {
                const _r = c.action(self);
                for (const cT of function* () {
                    if (n === null || isNaN(n)) for (const cT of Turn.C) yield cT;
                    else yield Turn._C[i][_r.find(n)];
                }()) {
                    const r = _r.copy().action(cT);
                    const genotype = r.position;
                    if (set.has(genotype)) continue;
                    set.add(genotype);
                    yield { r, c: [c, cT], image: !!(t & 1), inverse: !!(t & 2) };
                }
            }
        }

        do(scr) {
            return this.action(...function* (arr, turn) {
                for (let offset = 0; offset < arr.length; offset++) {
                    if (arr[offset + 1] === '2') yield turn[arr[offset++]][1];
                    else if (arr[offset + 1] === '\'') yield turn[arr[offset++]][2];
                    else yield turn[arr[offset]][0];
                }
            }(`${scr}`.replace(/\s/g, '').split(''), Turn));
        }
    }
    BaseRubik.prototype.constructor = BaseRubik;
    BaseRubik[Symbol.species] = Rubik;
    Turn.prototype.constructor = Turn;
    Rubik.prototype.constructor = Rubik;
    Rubik.Turn = Turn;
    Rubik.Rubik = Rubik;

    return module.exports = Rubik;
});