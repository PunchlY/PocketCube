import type { Solver } from './solver.js';
type L = [number, number, number, number, number, number, number, number];
declare const CTMap: WeakMap<Rubik | Readonly<Rubik>, CT>;
export type CT = [L, L];
export declare const CT: typeof CTMap.get;
export declare const isNumber: (n: any) => n is number;
export declare namespace Rubik {
    interface Similar {
        rubik: Readonly<Rubik>;
        image: boolean;
        inverse: boolean;
        base: Readonly<Rubik>;
        coordinate: Readonly<Rubik>;
    }
    interface Congruent extends Similar {
        image: false;
        inverse: false;
    }
}
export interface Rubik extends Solver, ArrayLike<number>, Iterable<number> {
    readonly 0: number;
    readonly 1: number;
    readonly 2: number;
    readonly 3: number;
    readonly 4: number;
    readonly 5: number;
    readonly 6: number;
    readonly 7: number;
}
export declare class Rubik {
    static get [Symbol.species](): typeof Rubik;
    constructor(position?: number);
    get position(): number;
    get length(): number;
    get [Symbol.isConcatSpreadable](): boolean;
    at(i: number): number;
    find(n: number): number;
    [Symbol.iterator](): Generator<number, void, unknown>;
    readonly(): Readonly<this>;
    copy(): Rubik;
    action(...rubiks: (Rubik | Readonly<Rubik>)[]): Rubik | this;
    inverse(): Rubik | this;
    image(): Rubik | this;
    similar(base: number): Rubik | this;
    static from(rubik: Rubik | number): Rubik;
    do(scr: string): Rubik | this;
    isReinstated(): boolean;
    similarly(n?: number, i?: number): Generator<Rubik.Similar, void, unknown>;
    congruent(n?: number, i?: number): Generator<Rubik.Congruent, void, unknown>;
    similarlyNoCongruent(n?: number, i?: number): Generator<Rubik.Similar, void, unknown>;
    solve(t?: number): string | false;
}
export declare namespace Rubik {
    export const isReadonly: (rubik: Rubik | Readonly<Rubik>) => boolean;
    export const readonly: <T extends Rubik>(rubik: T | Readonly<T>) => Readonly<T>;
    const Turn: (g: number) => Readonly<Rubik>;
    type Turn = Readonly<Rubik>;
    type Turns = readonly [Turn, Turn, Turn];
    type Base = readonly [...Turns, ...Turns, ...Turns, ...Turns, ...Turns, ...Turns, ...Turns, ...Turns];
    type _Base = readonly [Base, Base, Base, Base, Base, Base, Base, Base];
    export const Base: readonly [Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>];
    export const BaseT: readonly [Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>, Readonly<Rubik>];
    export const _Base: _Base;
    export const X: Turns, Y: Turns, Z: Turns;
    export const R: Turns, U: Turns, F: Turns, L: Turns, D: Turns, B: Turns;
    export {};
}
export {};
