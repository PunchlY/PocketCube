const Rubik = require('../index');

Rubik.basisSolutionList = require('./solve.json');
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
Rubik.prototype.solve = function (t = NaN) {
    const raw = (() => {
        const call = {};
        for (const { r, c: [c, cT], image, inverse } of this.similar(0)) {
            const e = this.constructor.basisSolutionList[r.position];
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
};

module.exports = Rubik;