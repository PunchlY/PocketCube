
const i8 = Object.freeze([...Array(8).keys()]);
const noop7 = Object.freeze(Array.from<number>({ length: 7 }));

type Li = [number, number, number, number, number, number, number, number];

function MOD(x: number, mod: number) {
    return mod - ((mod - (x % mod)) % mod);
}

const FrozenCopy = function (target: any, propertyKey, descriptor) {
    const fn = target[propertyKey];
    if (typeof fn === 'function') return {
        ...descriptor,
        value(this: Rubik) {
            return Reflect.apply(fn, Object.isFrozen(this) ? this.copy() : this, arguments);
        },
    };
} as MethodDecorator;

class Rubik {
    declare C: Li;
    declare T: Li;
    static from(position: number) {
        const rubik = new this();
        rubik.position = position;
        return rubik;
    }
    private set(C: Li, T: Li) {
        this.C = C;
        this.T = T;
        return this;
    }
    private _position?: number;
    private setPosition(position: number) {
        const _position = position = MOD(position, 88179840);
        const T: Li = [] as any, C: Li = [] as any;
        T.push((3 - noop7.reduce((p, c = position % 3) => {
            T.push(c);
            position /= 3, position |= 0;
            return p + c;
        }, 0) % 3) % 3);
        i8.forEach(function (this: number[], i) {
            C.push(this.splice(position % (8 - i), 1)[0]);
            position /= 8 - i, position |= 0;
        }, [...i8]);
        this.set(C, T);
        return _position;
    }
    private getPosition() {
        const list = [8];
        return this.T.slice(0, -1).reduceRight((p, c) => p * 3 + c, this.C.reduceRight((p, c, i) => {
            const o = list.findIndex((v) => c < v);
            list.splice(o, 0, c);
            return p * (8 - i) + o;
        }, 0));
    }

    get position() {
        return this._position ??= this.getPosition();
    }
    set position(position: number) {
        this._position = this.setPosition(position);
    }
    copy() {
        return new Rubik().set([...this.C], [...this.T]);
    }

    at(i: number) {
        return this.C[i] * 3 + this.T[i];
    }
    find(n: number) {
        const p = this.C.indexOf(((n / 3) | 0) % 8);
        return p * 3 + (3 + (n % 3) - this.T[p]) % 3;
    }

    @FrozenCopy
    action(...rubiks: (Rubik | Readonly<Rubik>)[]) {
        for (const { C: rC, T: rT } of rubiks) {
            const { C: tC, T: tT } = this.copy();
            rC.forEach((n, i) => {
                this.C[i] = tC[n];
                this.T[i] = (tT[n] + rT[i]) % 3;
            });
        }
        delete this._position;
        return this;
    }
    @FrozenCopy
    inverse() {
        const { C: tC, T: tT } = this.copy();
        tC.forEach((n, i) => {
            this.C[n] = i;
            this.T[n] = (3 - tT[i]) % 3;
        });
        delete this._position;
        return this;
    }
    @FrozenCopy
    image() {
        const { C: tC, T: tT } = this.copy();
        [1, 0, 3, 2, 5, 4, 7, 6].forEach((n, i, a) => {
            this.C[i] = a[tC[n]];
            this.T[i] = (3 - tT[n]) % 3;
        });
        delete this._position;
        return this;
    }
}

export { Rubik };
