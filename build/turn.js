import { BaseRubik, copyRubik, iterator8 } from './base.js';
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
    Turn._C = freeze(iterator8.map((i) => freeze([...Turn.C].sort((c1, c2) => c1[i] - c2[i]))));
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
