import { Solver } from '../build/solver.js';

let n = 0, l = 0;
/** @type {Record<number,number[]>} */
const json = {};
for await (const { build, rubik: { position } } of Solver([
    9, 11,
    12, 14,
    15, 17,
    10, 13, 16
], 11, 7)) {
    json[position] = build;

    n++, l = build.length > l ? (console.log(l), build.length) : l;

    // console.log(new Build(build).stringify());
}

console.log('size:', n);
console.log('length:', l);

import { writeFileSync } from 'fs';

const data = JSON.stringify(json);
writeFileSync(`${process.cwd()}/build/solvedata.json`, data);
