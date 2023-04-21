import { Rubik } from './rubik.js';
type Graph = readonly [number, number, number, number, number, number];
export declare class Build extends Array<number> {
    constructor(build: ArrayLike<number>);
    copy(): Build;
    mapping(graph: Graph): this;
    base(base: number): this;
    coordinate(coordinate: number): this;
    similar(base: number): this;
    image(): this;
    inverse(): this;
    bits(t: number): this;
    stringify(): string;
}
export interface Solver {
    solve(t?: number): string | false;
}
export declare function Solver(eT: number[], max?: number): Generator<{
    rubik: Readonly<Rubik>;
    build: number[];
}, void, unknown>;
export declare namespace Solver {
    let data: typeof import('./solvedata.json').default;
    function solveRaw(rubik: Rubik): false | Build;
    function solve(scr: string, t?: number): string | false;
    function solveAll(scr: string, reverse?: boolean): Generator<string, boolean, unknown>;
}
export {};
