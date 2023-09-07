import { Solver, Rubik } from '../build/index.js';

const turns = [
    Rubik.D[0], Rubik.D[2],
    Rubik.L[0], Rubik.L[2],
    Rubik.B[0], Rubik.B[2],
    Rubik.D[1], Rubik.L[1], Rubik.B[1],
];
let n = 0, l = 0;
/** @type {Record<number,number[]>} */
const builds = {};
for await (const { build, rubik: { position } } of Solver(turns, 11, 7)) {
    n++, l = build.length > l ? (console.log(l), build.length) : l;

    builds[position] = build;
}

console.log('size:', n);
console.log('length:', l);

import { writeFileSync } from 'fs';

const data = JSON.stringify({ map: turns.map((v) => v.position), build: builds });
writeFileSync(`${process.cwd()}/build/solvedata.json`, data);
