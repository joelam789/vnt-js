
const version = "0.0.1";

exports.parse = function (lines, ctx) {
    //console.log("character parser", lines);
    let nameMap = ctx.vnts ? ctx.vnts.readKeyValues(lines, 1) : null;
    //console.log(nameMap);
    if (!nameMap) nameMap = new Map();
    if (!ctx.characters) ctx.characters = nameMap;
    else {
        nameMap.forEach((value, key) => {
            ctx.characters.set(key, value);
        });
    }
    return ctx;
}
