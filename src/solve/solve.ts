import { Solver } from '../solver.js';
import { Rubik, Turns, similarly } from '../util.js';
import { Build, Position } from '../build.js';
import fs from 'fs/promises';

const builds: Record<number, number[]> = {};
const { turns, res } = Solver(7, true);
const posToIndex = new Map(turns.map((v, i) => [v, i] as const));
const buildToIndex = Turns.map(({ position }) => turns.indexOf(position));
for (const { build, position } of res) {
    const rubik = Rubik.from(position);
    const { position: index, image, inverse, base } = [...function* () {
        for (const { rubik: { position }, image, inverse, base } of similarly(rubik, 15, 7))
            yield { position, image, inverse, base };
    }()].sort(({ position: a }, { position: b }) => a - b)[0];
    if (position === index) {
        builds[position] = build.map((({ position }) => posToIndex.get(position)!));
        continue;
    }
    const solve = Build.from(build.map(({ position }) => Position[position]));
    if (image) solve.image();
    if (inverse) solve.inverse();
    solve.base(base.at(0)).bits(-1);
    builds[index] = solve.valueOf().map((v) => buildToIndex[v]);
}

const data: typeof import('solvedata.json') = {
    map: turns,
    build: builds,
};

fs.writeFile('solvedata.json', JSON.stringify(data));
