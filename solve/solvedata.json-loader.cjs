
/** @type {import('webpack').LoaderDefinition} */
module.exports = async function (source) {
    const { en, des } = await import('./solvedata.json-loader.timerun.mjs');
    return `export default (${des})(${en(JSON.parse(source)).map(JSON.stringify).join(',')})`;
};
