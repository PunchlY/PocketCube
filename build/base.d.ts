import { type Rubik } from './index.js';
export declare const __config: {
    species: typeof Rubik;
    solve: Record<number, readonly number[]>;
};
export declare const iterator8: number[];
type L = [number, number, number, number, number, number, number, number];
export declare const copy: (...ls: L[]) => L[];
export declare const CTMap: WeakMap<BaseRubik, [L, L]>;
export interface BaseRubik extends ArrayLike<number>, Iterable<number> {
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
export declare class BaseRubik {
    constructor(position?: number);
    at(i: number): number;
    find(n: number): number;
    [Symbol.iterator](): Generator<number, void, unknown>;
}
export declare function copyRubik(rubik: BaseRubik, constructor?: typeof Rubik): Rubik;
export declare function action<T extends BaseRubik>(self: T, rubiks: Iterable<BaseRubik>): T;
export {};
