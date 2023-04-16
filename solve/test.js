import { SolveRubik } from '../dist/PocketCube.solve.min.mjs';

for (const solv of SolveRubik.solveAll('RUFR2U', true))
    console.log(solv);
