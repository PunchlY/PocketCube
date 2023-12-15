import { similarly, TurnNames, Base, StringToTruns, congruent } from './util.js';
import { Rubik as BaseRubik } from './base.js';
import { Build, Position } from './build.js';
import solvedata from 'solvedata.json';

function solve(rubik: BaseRubik) {
    const { map, build } = solvedata;
    for (let { rubik: { position }, image, inverse, base, coordinate } of similarly(rubik, 15)) {
        if (!(position in build)) continue;
        const solve = Build.from(build[position].map((v) => Position[map[v]]));
        if (inverse) {
            base = base.inverse();
        } else {
            solve.inverse();
            base = coordinate;
        }
        if (image) {
            solve.image();
            base = base.image();
        }
        return solve.base(base.at(0));
    }
    return false;
}

class Rubik {
    #data?: BaseRubik;
    static *#toBaseRubik(rubiks: (Rubik | string)[]) {
        for (const rubik of rubiks) {
            if (rubik instanceof Rubik) {
                yield rubik.#data;
                continue;
            }
            yield* StringToTruns(rubik);
        }
    }
    static from(position: number) {
        const rubik = new this();
        rubik.#data = BaseRubik.from(position);
        return rubik;
    }
    get position() {
        const data = this.#data ??= BaseRubik.from(0);
        return data.position;
    }
    isReinstated() {
        const { C, T } = Base[this.#data?.at(0)!];
        for (const i of C.keys()) if (
            this.#data?.C[i] !== C[i] ||
            this.#data?.T[i] !== T[i]
        ) return false;
        return true;
    }
    *similarly(n: number, p?: number, c?: number) {
        for (const { rubik: baseRubik, image, inverse, base, coordinate } of similarly(this.#data ??= BaseRubik.from(0), n, p, c)) {
            const rubik = new Rubik();
            rubik.#data = baseRubik;
            yield {
                rubik,
                image,
                inverse,
                base: base.at(0),
                coordinate: coordinate.at(0),
            };
        }
    }
    *congruent(p?: number, c?: number) {
        for (const { rubik: baseRubik, base, coordinate } of congruent(this.#data ??= BaseRubik.from(0), p, c)) {
            const rubik = new Rubik();
            rubik.#data = baseRubik;
            yield {
                rubik,
                base: base.at(0),
                coordinate: coordinate.at(0),
            };
        }
    }
    copy() {
        const rubik = new Rubik();
        rubik.#data = this.#data?.copy();
        return rubik;
    }
    at(i: number) {
        const data = this.#data ??= BaseRubik.from(0);
        return data.at(i);
    }
    find(n: number) {
        const data = this.#data ??= BaseRubik.from(0);
        return data.find(n);
    }
    action(...rubiks: (Rubik | typeof TurnNames[number])[]): this;
    action(...rubiks: (Rubik | string)[]): this;
    action(...rubiks: (Rubik | string)[]) {
        const data = this.#data ??= BaseRubik.from(0);
        Reflect.apply(BaseRubik.prototype.action, data, [...Rubik.#toBaseRubik(rubiks)]);
        return this;
    }
    inverse() {
        const data = this.#data ??= BaseRubik.from(0);
        data.inverse();
        return this;
    }
    image() {
        const data = this.#data ??= BaseRubik.from(0);
        data.image();
        return this;
    }
    solve(bit?: number) {
        if (!this.#data) return '';
        const build = solve(this.#data);
        if (!build) return false;
        if (arguments.length) build.bits(bit!);
        return build.toString();
    }
}

export { Rubik, Rubik as default };
