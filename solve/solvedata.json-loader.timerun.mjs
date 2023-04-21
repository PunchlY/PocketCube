import { Rubik, Build } from '../build/index.js';

const dBit = 9;
function* min(/** @type {import('../build/index.js').Build} */rubik, /** @type {import('../build/index.js').Build} */build) {
    for (const n of [21, 22, 23])
        yield {
            position: rubik.copy().similar(n).position,
            build: build.copy().similar(n),
        };
}

const chs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/~!@#%^&*()-_ ?[]{}:;<>,."|`$';
const { length } = chs;
const mlength = Math.ceil(Math.log(88179840) / Math.log(length));

const ntoa = (/** @type {number} */n) =>
    [...(function* (n) {
        do { yield n % length; } while (n = Math.floor(n / length));
    })(n)].map((n) => chs[n]).join('');

export const en = (/** @type {Record<number, number[]>} */o) => {
    delete o[0];
    const /** @type {string[][]} */a = [];
    for (let rawPosition in o) {
        const rawBuild = o[rawPosition];
        const { position, build } = [
            ...min(new Rubik(rawPosition), new Build(rawBuild))
        ].sort((a, b) => a[0] - b[0])[0];
        const sBuild = ntoa(build.reduceRight((p, c) => p * 10 + c + 1 - dBit, 0));
        const sPosition = ntoa(position);
        (a[sPosition.length - 1 + (sBuild.length - 1) * mlength] ??= []).push(`${sPosition}${sBuild}`);
    }
    const /** @type {number[][]} */p = [];
    const /** @type {[string,[number,number][]]} */r = [
        a.map((s, i) => {
            if (!s.length) return '';
            p.push([s.length, i]);
            return s.join('');
        }).join(''),
        p,
    ];
    return r;
};

export const des = `(${((/** @type {string} */chs, /** @type {number} */length, /** @type {number} */mlength, /** @type {number} */dBit) => {
    const tab = Object.fromEntries([...chs].map((v, i) => [v, i]));
    const aton = (/** @type {string} */s) =>
        [...s].reduceRight((p, c) => p * length + tab[c], 0);

    const vfn = (/** @type {string} */v) =>
        [...(function* (n) {
            do { yield (n % 10) - 1 + dBit; } while ((n = Math.floor(n / 10)));
        })(aton(v))];
    const dsplit = function* (/** @type {string} */s, /** @type {number} */x, /** @type {number} */y) {
        for (let i = 0; i < s.length; i += x + y)
            yield [s.slice(i, i + x), s.slice(i + x, i + x + y)];
    };
    return (/** @type {string} */s, /** @type {[number,number][]} */n) => {
        const data = Object.fromEntries(function* () {
            for (const [length, i] of n) {
                const kl = (i % mlength) + 1, vl = ~~(i / mlength) + 1, dl = kl + vl, l = length * dl;
                for (const [k, v] of dsplit(s.slice(0, l), kl, vl))
                    yield [aton(k), vfn(v)];
                s = s.slice(l);
            }
        }());
        data[0] = [];
        return Object.freeze(data);
    };
}).toString()})(${[chs, length, mlength, dBit].map(JSON.stringify).join(',')})`;
