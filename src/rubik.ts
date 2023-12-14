import { Rubik as BaseRubik, similarly, TurnNames, StringToTruns } from './util.js';
import { Build, Position } from './build.js';

let data: typeof import('solvedata.json') = import.meta.env?.RUBIKSOLVEDATA;

function solve(rubik: BaseRubik) {
    const { map, build } = data;
    for (let { rubik: { position }, image, inverse, base, coordinate } of similarly(rubik, 15)) {
        if (!(position in build)) continue;
        const solve = Build.from(build[position].map((v) => Position[map[v]]));
        if (inverse) {
            base.inverse();
        } else {
            solve.inverse();
            base = coordinate;
        }
        if (image) {
            solve.image();
            base.image();
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
        if (Object.isFrozen(this)) throw -1;
        const data = this.#data ??= BaseRubik.from(0);
        Reflect.apply(BaseRubik.prototype.action, data, [...Rubik.#toBaseRubik(rubiks)]);
        return this;
    }
    inverse() {
        if (Object.isFrozen(this)) throw -1;
        const data = this.#data ??= BaseRubik.from(0);
        data.inverse();
        return this;
    }
    image() {
        if (Object.isFrozen(this)) throw -1;
        const data = this.#data ??= BaseRubik.from(0);
        data.image();
        return this;
    }
    solve() {
        if (!this.#data) return '';
        const build = solve(this.#data);
        return build && build.toString();
    }
}

export { Rubik };
export default Rubik;
