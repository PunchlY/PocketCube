export { type BaseRubik };
interface BaseRubik extends ArrayLike<number>, Iterable<number> {
    position: number;
    readonly 0: number;
    readonly 1: number;
    readonly 2: number;
    readonly 3: number;
    readonly 4: number;
    readonly 5: number;
    readonly 6: number;
    readonly 7: number;
}
declare class BaseRubik {
    constructor(position?: number);
    at(i: number): number;
    find(n: number): number;
    [Symbol.iterator](): Generator<number, void, unknown>;
}
export interface Turn {
    readonly position: number;
}
export declare class Turn extends BaseRubik {
    constructor(position?: number);
    copy(): Rubik;
    action(...rubiks: BaseRubik[]): Rubik;
    inverse(): Rubik;
    image(): Rubik;
}
export declare namespace Turn {
    type RTurn = Readonly<Turn>;
    type Turns = readonly [RTurn, RTurn, RTurn];
    type C = readonly [...Turns, ...Turns, ...Turns, ...Turns, ...Turns, ...Turns, ...Turns, ...Turns];
    type _C = readonly [C, C, C, C, C, C, C, C];
    export const C: readonly [Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>, Readonly<Turn>];
    export const _C: _C;
    export const X: readonly [Readonly<Turn>, Readonly<Turn>, Readonly<Turn>];
    export const Y: readonly [Readonly<Turn>, Readonly<Turn>, Readonly<Turn>];
    export const Z: readonly [Readonly<Turn>, Readonly<Turn>, Readonly<Turn>];
    export const R: Turns;
    export const U: Turns;
    export const F: Turns;
    export const L: Turns;
    export const D: Turns;
    export const B: Turns;
    export {};
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
