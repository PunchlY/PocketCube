
declare module 'solvedata.json' {
    export const map: number[];
    export const build: Record<number, number[]>;
}

declare module 'solvedata.min.json' {
    export const map: string[];
    export const sBuild: string;
    export const pos: [number, number][];
}
