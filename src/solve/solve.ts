import { Solver } from '../solver.js';
import fs from 'fs/promises';

const builds: Record<number, number[]> = {};
const { turns, res } = Solver(7, true);
const posToIndex = new Map(turns.map((v, i) => [v, i] as const));
for (const { build, position } of res) {
    builds[position] = build.map((({ position }) => posToIndex.get(position)!));
}

const data: typeof import('solvedata.json') = {
    map: turns,
    build: builds,
};

fs.writeFile('solvedata.json', JSON.stringify(data));
