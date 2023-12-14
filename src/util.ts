
const i8 = Object.freeze([...Array(8).keys()]);
const noop7 = Object.freeze(Array.from<number>({ length: 7 }));

type Li = [number, number, number, number, number, number, number, number];

class Rubik {
    private declare C: Li;
    private declare T: Li;
    static from(position: number) {
        const rubik = new Rubik();
        rubik.position = position;
        return rubik;
    }
    private set(C: Li, T: Li) {
        this.C = C;
        this.T = T;
        return this;
    }
    private _position?: number;
    private setPosition(position: number) {
        const _position = position = (position & 2147483647) % 88179840;
        if (!position) {
            this.set([0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0]);
            return position;
        }
        const T: Li = [] as any, C: Li = [] as any;
        T.push((3 - noop7.reduce((p, c = position % 3) => {
            T.push(c);
            position /= 3, position |= 0;
            return p + c;
        }, 0) % 3) % 3);
        i8.forEach(function (this: number[], i) {
            C.push(this.splice(position % (8 - i), 1)[0]);
            position /= 8 - i, position |= 0;
        }, [...i8]);
        this.set(C, T);
        return _position;
    }
    private getPosition() {
        const list = [8];
        return this.T.slice(0, -1).reduceRight((p, c) => p * 3 + c, this.C.reduceRight((p, c, i) => {
            const o = list.findIndex((v) => c < v);
            list.splice(o, 0, c);
            return p * (8 - i) + o;
        }, 0));
    }

    get position() {
        return this._position ??= this.getPosition();
    }
    set position(position: number) {
        this._position = this.setPosition(position);
    }
    copy() {
        return new Rubik().set([...this.C], [...this.T]);
    }

    at(i: number) {
        return this.C[i] * 3 + this.T[i];
    }
    find(n: number) {
        const p = this.C.indexOf(((n / 3) | 0) % 8);
        return p * 3 + (3 + (n % 3) - this.T[p]) % 3;
    }

    action(...rubiks: Rubik[]) {
        for (const { C: rC, T: rT } of rubiks) {
            const { C: tC, T: tT } = this.copy();
            rC.forEach((n, i) => {
                this.C[i] = tC[n];
                this.T[i] = (tT[n] + rT[i]) % 3;
            });
        }
        delete this._position;
        return this;
    }
    inverse() {
        const { C: tC, T: tT } = this.copy();
        tC.forEach((n, i) => {
            this.C[n] = i;
            this.T[n] = (3 - tT[i]) % 3;
        });
        delete this._position;
        return this;
    }
    image() {
        const { C: tC, T: tT } = this.copy();
        [1, 0, 3, 2, 5, 4, 7, 6].forEach((n, i, a) => {
            this.C[i] = a[tC[n]];
            this.T[i] = (3 - tT[n]) % 3;
        });
        delete this._position;
        return this;
    }
}

const Base = [
    0, 16219978, 2469029,
    33104619, 17954269, 49605440,
    51565086, 34630144, 3470675,
    84669705, 36364435, 50607086,
    18222084, 52672894, 36822425,
    51396687, 70206073, 38451740,
    40288914, 53569564, 84835823,
    73463517, 71102743, 86465138,
].map(Rubik.from);
const BaseT = Base.map((CT) => Base[CT.find(0)]);
const _Base = i8.map((i) => [...Base].sort((c1, c2) => c1.at(i) - c2.at(i)));
const [X, Y, Z] = [
    [14, 18, 8],
    [6, 9, 3],
    [4, 15, 13],
].map((a) => a.map((n) => Base[n]) as [Rubik, Rubik, Rubik]);
const [R, U, F, L, D, B] = [
    [77350359, 68566824, 50861415],
    [51438240, 84505680, 33067440],
    [21433374, 84383208, 62951382],
    [15944780, 20238498, 22807586],
    [37179, 164025, 126846],
    [4540624, 5469687, 929887],
].map((T) => T.map(Rubik.from) as [Rubik, Rubik, Rubik]);

function fix(rubik: Rubik, base: number) {
    return Base[base].copy().action(rubik, BaseT[base]);
}

function* _congruent(rawRubik: Rubik, set: Set<number>, p?: number, c?: number) {
    for (const base of Base) {
        const baseRubik = base.copy().action(rawRubik);
        for (const coordinate of p === null || typeof p === 'undefined' ? Base : [_Base[p][baseRubik.find(c ?? p * 3)]]) {
            const rubik = baseRubik.copy().action(coordinate);
            const pos = rubik.position;
            if (set.has(pos)) continue;
            set.add(pos);
            yield { rubik, base, coordinate, position: pos };
        }
    }
}
function* congruent(rawRubik: Rubik, p?: number, c?: number) {
    yield* _congruent(rawRubik, new Set(), p, c);
}
function* similarly(rawRubik: Rubik, n: number, p?: number, c?: number) {
    const set = new Set<number>();
    for (const [t, rubik] of [
        (n & 1) && rawRubik,
        (n & 2) && rawRubik.copy().image(),
        (n & 4) && rawRubik.copy().inverse(),
        (n & 8) && rawRubik.copy().image().inverse(),
    ].entries()) {
        if (!rubik) continue;
        if (set.has(rubik.position)) continue;
        for (const data of _congruent(rubik, set, p, c))
            yield { ...data, image: !!(t & 1), inverse: !!(t & 2) };
    }
}

const Turns = [
    ...R, ...U, ...F,
    ...L, ...D, ...B,
    ...X, ...Y, ...Z,
];
enum TurnNames {
    'R', 'R2', 'R\'',
    'U', 'U2', 'U\'',
    'F', 'F2', 'F\'',
    'L', 'L2', 'L\'',
    'D', 'D2', 'D\'',
    'B', 'B2', 'B\'',
    'X', 'X2', 'X\'',
    'Y', 'Y2', 'Y\'',
    'Z', 'Z2', 'Z\'',
}

function* StringToTrunsIndex(str: string) {
    for (const [name] of String.prototype.matchAll.call(str, /[RUFLDBXYZ]['2]?/g))
        yield TurnNames[name as any] as unknown as number;
}
function* StringToTruns(str: string) {
    for (const index of StringToTrunsIndex(str))
        yield Turns[index];
}

export { i8 };
export { Rubik };
export { fix };
export { congruent, similarly };

export { Turns, TurnNames, StringToTrunsIndex, StringToTruns };

export { Base, BaseT };
export { X, Y, Z, R, U, F, L, D, B };
