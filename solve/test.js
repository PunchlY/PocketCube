import { Solver } from '../dist/PocketCube.solve.min.mjs';

const scr = process.argv[2] ?? '';
console.log(Solver.solve(scr, 0));
