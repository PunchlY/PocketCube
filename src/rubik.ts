import { Rubik as BaseRubik, R, U, F, L, D, B, X, Y, Z, Base, BaseT } from './util.js';

class Rubik {
    #data: BaseRubik;
    static from(position: number) {
        const rubik = new this();
        rubik.#data = new BaseRubik();
        rubik.#data.position = position;
        return rubik;
    }
    get position() {
        const data = this.#data ??= BaseRubik.from(0);
        return data.position;
    }
    copy() {
        const rubik = new Rubik();
        rubik.#data = this.#data.copy();
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
    action(...rubiks: (Rubik | string)[]) {
        if (Object.isFrozen(this)) throw false;
        const data = this.#data ??= BaseRubik.from(0);
        Reflect.apply(BaseRubik.prototype.action, data, rubiks.map((rubik) => {
            if (rubik instanceof Rubik) return rubik.#data;
        }));
        return this;
    }
    inverse() {
        if (Object.isFrozen(this)) throw false;
        const data = this.#data ??= BaseRubik.from(0);
        data.inverse();
        return this;
    }
    image() {
        if (Object.isFrozen(this)) throw false;
        const data = this.#data ??= BaseRubik.from(0);
        data.image();
        return this;
    }
    static {

        function create(data: BaseRubik) {
            const rubik = new Rubik();
            rubik.#data = data;
            return Object.freeze(rubik);
        }
    }
}

export { Rubik };
