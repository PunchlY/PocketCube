import { Solver, Build } from '../build/solver.js';

let n = 0, l = 0;
/** @type {Record<number,import('../build/solver.js').Build>} */
const json = {};
for await (const { build, rubik } of Solver([
    0, 2,
    3, 5,
    6, 8,
    1, 4, 7
], 11)) {
    json[rubik.position] = build;

    n++, l = build.length > l ? (console.log(l), build.length) : l;

    // console.log(new Build(build).stringify());
}

console.log('size:', n);
console.log('length:', l);

import { writeFileSync } from 'fs';

const data = JSON.stringify(json);
writeFileSync(`${process.cwd()}/build/solvedata.json`, data);
