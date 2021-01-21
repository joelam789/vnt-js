
const version = "0.0.1";

exports.parse = function (lines, ctx) {
    let nameMap = ctx.vnts ? ctx.vnts.readKeyValues(lines, 1) : null;
    if (!nameMap) nameMap = new Map();
    if (!ctx.macros) ctx.macros = nameMap;
    else {
        nameMap.forEach((value, key) => {
            ctx.macros.set(key, value);
        });
    }
    return ctx;
}
