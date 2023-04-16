import { Rubik } from '../dist/PocketCube.solve.min.mjs';

for (const solv of Rubik.solveAll('RUFR2U', true))
    console.log(solv);
