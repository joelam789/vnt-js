
const version = "0.0.1";

exports.parse = function (lines, ctx) {
    //console.log("image parser", lines);
    let nameMap = null;
    if (ctx.vnts) nameMap = ctx.vnts.readKeyValues(lines, 1);
    if (!nameMap) nameMap = new Map();
    if (!ctx.styles) ctx.styles = nameMap;
    else {
        nameMap.forEach((value, key) => {
            ctx.styles.set(key, value);
        });
    }
    //nameMap.forEach((value, key) => {
    //    let parts = value.split(' ');
    //    genJson(ctx, key, parts[0], parts[1], parts[2]);
    //});

    return ctx;
}
