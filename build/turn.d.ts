import { BaseRubik } from './base.js';
export interface Turn {
    readonly position: number;
}
export declare class Turn extends BaseRubik {
    constructor(position?: number);
    copy(): import("./index.js").Rubik;
    action(...rubiks: BaseRubik[]): import("./index.js").Rubik;
    inverse(): import("./index.js").Rubik;
    image(): import("./index.js").Rubik;
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
