import { Rubik } from '../dist/PocketCube.solve.min.mjs';

for (const solv of Rubik.solveAll(process.argv[2], true))
    console.log(new Rubik().do(process.argv[2]).do(solv).isReinstated());
