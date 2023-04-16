import { Rubik, Solve } from './index.js';
import basisSolution from './solvedata.json';
const { transform, stringify } = Solve;
const $solve = (rubik) => {
    for (const data of rubik.similar(0)) {
        const { r: { position }, inverse } = data;
        if (!(position in basisSolution))
            continue;
        data.inverse = !inverse;
        return transform([...basisSolution[position]], data);
    }
};
export class SolveRubik extends Rubik {
    static get [Symbol.species]() {
        return SolveRubik;
    }
    solve(t = NaN) {
        return stringify($solve(this), t);
    }
}
(function (SolveRubik) {
    function solve(scr, t = NaN) {
        const rubik = new Rubik(0).do(scr);
        if (!rubik)
            return false;
        return stringify($solve(rubik), t);
    }
    SolveRubik.solve = solve;
    function* solveAll(scr, reverse = false) {
        const rubik = new Rubik(0).do(scr);
        if (!rubik)
            return false;
        const solve = $solve(rubik);
        const max = 1 << solve.length;
        for (let t = 0; t < max; t++)
            yield stringify(solve, reverse ? ~t : t);
    }
    SolveRubik.solveAll = solveAll;
})(SolveRubik || (SolveRubik = {}));
export * from './index.js';
