export declare class Rubik {
    #private;
    static from(position: number): Rubik;
    get position(): number;
    isReinstated(): boolean;
    similarly(n: number, p?: number, c?: number): Generator<{
        rubik: Rubik;
        image: boolean;
        inverse: boolean;
        base: number;
        coordinate: number;
    }, void, unknown>;
    congruent(p?: number, c?: number): Generator<{
        rubik: Rubik;
        base: number;
        coordinate: number;
    }, void, unknown>;
    copy(): Rubik;
    at(i: number): number;
    find(n: number): number;
    action(...rubiks: (Rubik | keyof typeof TurnNames)[]): this;
    action(...rubiks: (Rubik | string)[]): this;
    inverse(): this;
    image(): this;
    solve(bit?: number): string | false;
}

declare enum TurnNames {
    'R' = 0,
    'R2' = 1,
    'R\'' = 2,
    'U' = 3,
    'U2' = 4,
    'U\'' = 5,
    'F' = 6,
    'F2' = 7,
    'F\'' = 8,
    'L' = 9,
    'L2' = 10,
    'L\'' = 11,
    'D' = 12,
    'D2' = 13,
    'D\'' = 14,
    'B' = 15,
    'B2' = 16,
    'B\'' = 17,
    'X' = 18,
    'X2' = 19,
    'X\'' = 20,
    'Y' = 21,
    'Y2' = 22,
    'Y\'' = 23,
    'Z' = 24,
    'Z2' = 25,
    'Z\'' = 26
}

export { }
