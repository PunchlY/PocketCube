import { BaseRubik, copyRubik, iterator8 } from './base.js';

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
