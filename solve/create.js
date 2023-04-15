import { Solve } from '../build/index.js';

let n = 0, l = 0;
const json = {};
for await (const { position, build } of Solve.halfOrQuarter()) {
    json[position] = build;
    n++, l = build.length > l ? (console.log(l), build.length) : l;
}

console.log('size:', n);
console.log('length:', l);

import { writeFileSync } from 'fs';

const data = JSON.stringify(json);
writeFileSync(`${process.cwd()}/src/solvedata.json`, data);
