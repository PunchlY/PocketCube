import { Rubik } from './base.js';

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
const _Base = Array.from({ length: 8 }, (_, i) => [...Base].sort((c1, c2) => c1.at(i) - c2.at(i)));
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

export { fix };
export { congruent, similarly };

export { Turns, TurnNames, StringToTrunsIndex, StringToTruns };

export { Base, BaseT };
export { X, Y, Z, R, U, F, L, D, B };
