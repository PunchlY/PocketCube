
declare module 'solvedata.json' {
    export const map: readonly number[];
    export const build: Record<number,readonly number[]>;
}

declare module 'solvedata.min.json' {
    export const map: string[];
    export const sBuild: string;
    export const pos: number[][];
}
