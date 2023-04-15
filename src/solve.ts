import { Rubik, BaseRubik, Solve } from './index.js';
import basisSolution from './solvedata.json';

const { transform, stringify } = Solve;

const $solve = (rubik: Rubik) => {
    for (const data of rubik.similar(0)) {
        const { r: { position }, inverse } = data;
        if (!(position in basisSolution)) continue;
        data.inverse = !inverse;
        return transform([...basisSolution[position]], data);
    }
};

export interface SolveRubik {
    copy(): SolveRubik;
}
export class SolveRubik extends Rubik {
    static get [Symbol.species]() {
        return SolveRubik;
    }
    solve(t = NaN) {
        return stringify($solve(this), t);
    }
}
export namespace SolveRubik {
    export declare function from(rubik: BaseRubik | number): SolveRubik;
    export function solve(scr: string, t = NaN) {
        const rubik = new Rubik(0).do(scr);
        if (!rubik) return false;
        return stringify($solve(rubik), t);
    }
    export function* solveAll(scr: string) {
        const rubik = new Rubik(0).do(scr);
        if (!rubik) return false;
        const solve = $solve(rubik);
        for (let t = 0; t < 1 << solve.length; t++)
            yield stringify(solve, t);
    }
}

export * from './index.js';
