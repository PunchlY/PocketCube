import { Rubik, BaseRubik } from './index.js';
export interface SolveRubik {
    copy(): SolveRubik;
}
export declare class SolveRubik extends Rubik {
    static get [Symbol.species](): typeof SolveRubik;
    solve(t?: number): string;
}
export declare namespace SolveRubik {
    function from(rubik: BaseRubik | number): SolveRubik;
    function solve(scr: string, t?: number): string | false;
    function solveAll(scr: string, reverse?: boolean): Generator<string, boolean, unknown>;
}
export * from './index.js';
