
const version = "0.0.1";

function getNameFromUrl(url) {
    let name = "";
    //let path = url.replace(/\\/g, "/");
    let startPos = url.lastIndexOf("/"), endPos = url.lastIndexOf(".");
    if (endPos > startPos && endPos > 0) {
        if (startPos < 0) startPos = -1;
        name = url.substring(startPos+1, endPos);
    } else if (startPos >= 0) {
        startPos = url.lastIndexOf("=");
        if (startPos > 0) name = url.substring(startPos+1).trim();
    }
    return name;
}

exports.parse = function (lines, ctx) {
    //console.log("voice parser", lines);
    let nameMap = null;
    if (ctx.vnts) nameMap = ctx.vnts.readKeyValues(lines, 1);
    if (!nameMap) nameMap = new Map();
    let isFirst = !ctx.sounds || ctx.sounds.size <= 0;
    if (!ctx.sounds) ctx.sounds = new Map();
    nameMap.forEach((value, key) => {
        ctx.sounds.set(key, getNameFromUrl(value));
    });
    //console.log(ctx.sounds);
    if (!ctx.setting.preload) ctx.setting.preload = {};
    if (!ctx.setting.preload.sounds) ctx.setting.preload.sounds = [];
    nameMap.forEach((value, key) => {
        if (isFirst) ctx.bgm = key;
        if (ctx.setting.preload.sounds.indexOf(value) < 0)
            ctx.setting.preload.sounds.push(value);
        isFirst = false;
    });

    return ctx;
}
