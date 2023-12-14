import data from './en.js';
import fs from 'fs/promises';

fs.writeFile('solvedata.min.json', JSON.stringify(data));
