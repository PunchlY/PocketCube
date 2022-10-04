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
const RT = [
    M[14], M[18], M[8],
    M[6], M[9], M[3],
    M[4], M[15], M[13],
    M[8], M[18], M[14],
    M[3], M[9], M[6],
    M[13], M[15], M[4],
];
const _Rubik = require('../index');
const basisSolutionList = require('./solve.json');
class Turn extends _Rubik.Turn {
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
class Rubik extends _Rubik {
    static #basisSolutionList = basisSolutionList;
    solve(t = NaN) {
        const raw = (() => {
            const call = {};
            for (const { r, c: [c, cT], image, inverse } of this.similar(0)) {
                const e = this.constructor.#basisSolutionList[r.position];
                if (e === undefined) continue;
                let E = [].concat(e.split('')).map((v) => ~~v);
                image && (E = E.map((v) => (~~(v / 3) || 3) * 3 + (2 - v % 3)));
                !inverse && (E = E.reverse().map((v) => ~~(v / 3) * 3 + (2 - v % 3)));
                E = E.map(function (v) { return this[~~(v / 3)] * 3 + v % 3 }, M[((c) => image ? c.image()[0] : c[0])(inverse ? c.inverse() : cT)]);
                call.raw = E;
                break;
            }
            return call.raw;
        })();
        if (!(t === null || isNaN(t))) [...function* (t, i) {
            t &= (1 << i) - 1;
            while (i--) yield t & 1, t >>>= 1;
        }(t, raw.length)].forEach(function (b, i) {
            let v = raw[i];
            v = this[~~(v / 3)] * 3 + v % 3;
            raw[i] = b * 9 + v % 9;
            if (b ^ ~~(v / 9)) RT[v].map((_, i, a) => this[i] = a[this[i]]);
        }, M[0]);
        return raw.map((v) => Re[v]).join('');
    }
}
Turn.prototype.constructor = Turn;
Rubik.prototype.constructor = Rubik;
Turn[Symbol.species] = Rubik;
Rubik[Symbol.species] = Rubik;
Rubik.Turn = Turn;
Rubik.Rubik = Rubik;

module.exports = Rubik;