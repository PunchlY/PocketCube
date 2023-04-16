import { BaseRubik } from './base.js';
import { Turn } from './turn.js';
export declare namespace Solve {
    const halfOrQuarter: () => AsyncGenerator<{
        position: number;
        build: number[];
    }, void, unknown>;
    const quarter: () => AsyncGenerator<{
        position: number;
        build: number[];
    }, void, unknown>;
    const transform: (raw: number[], { image, inverse, c: [c, cT], }: {
        image: boolean;
        inverse: boolean;
        c: readonly [Readonly<Turn>, Readonly<Turn>];
    }, t?: number) => number[];
    const stringify: (raw: number[], t?: number) => string;
}
export interface Rubik {
    solve(t?: number): string;
}
export declare class Rubik extends BaseRubik {
    static get [Symbol.species](): typeof Rubik;
    static from(rubik: BaseRubik | number): Rubik;
    copy(): Rubik;
    action(...rubiks: BaseRubik[]): this;
    inverse(): this;
    image(): this;
    isReinstated(): boolean;
    similar(n?: number, i?: number): Generator<{
        image: boolean;
        inverse: boolean;
        r: Rubik;
        c: readonly [Readonly<Turn>, Readonly<Turn>];
    }, void, unknown>;
    congruent(n?: number, i?: number): Generator<{
        image: boolean;
        inverse: boolean;
        r: Rubik;
        c: readonly [Readonly<Turn>, Readonly<Turn>];
    }, void, unknown>;
    similarNoCongruence(n?: number, i?: number): Generator<{
        image: boolean;
        inverse: boolean;
        r: Rubik;
        c: readonly [Readonly<Turn>, Readonly<Turn>];
    }, void, unknown>;
    do(scr: string): this;
}
export declare namespace Rubik {
    function solve(scr: string, t?: number): string | false;
    function solveAll(scr: string, reverse?: boolean): Generator<string, boolean, unknown>;
}
