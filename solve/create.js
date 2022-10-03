const create = require('./solve').halfOrQuarter;

let n = 0, l = 0;
const json = {};
for (const { position, build } of create()) {
    json[position] = build;
    n++, l = build.length > l ? (console.log(l), build.length) : l;
}

console.log('size:', n);
console.log('length:', l);

const fs = require('fs');
fs.writeFileSync(__dirname + '/solve.json', JSON.stringify(json));
