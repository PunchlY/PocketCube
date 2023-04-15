
const chs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/~!@#$%^&*()-_ ?[]{}:;<>,."`|';
const { length } = chs;
const mlength = Math.ceil(Math.log(88179840) / Math.log(length));

const ntoa = (/** @type {number} */n) =>
    [...(function* (n) {
        do { yield n % length; } while (n = Math.floor(n / length));
    })(n)].map((n) => chs[n]).join('');
const en = (/** @type {Record<number, number[]>} */o) => {
    delete o[0];
    const /** @type {string[][]} */a = [];
    for (let k in o) {
        let v = ntoa(o[k].reduceRight((p, c) => p * 10 + c + 1, 0));
        k = ntoa(k), (a[k.length - 1 + (v.length - 1) * mlength] ??= []).push(`${k}${v}`);
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

const des = `(${((/** @type {string} */chs, /** @type {number} */length, /** @type {number} */mlength) => {
    const tab = Object.fromEntries([...chs].map((v, i) => [v, i]));
    const aton = (/** @type {string} */s) =>
        [...s].reduceRight((p, c) => p * length + tab[c], 0);

    const vfn = (/** @type {string} */v) =>
        [...(function* (n) {
            do { yield (n % 10) - 1; } while ((n = Math.floor(n / 10)));
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
        return data;
    };
}).toString()})(${[chs, length, mlength].map(JSON.stringify).join(',')})`;

/** @type {import('webpack').LoaderDefinition} */
module.exports = function (source) {
    return `export default (${des})(${en(JSON.parse(source)).map(JSON.stringify).join(',')})`;
};
