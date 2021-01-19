
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
    //console.log("music parser", lines);
    let nameMap = null;
    if (ctx.vnts) nameMap = ctx.vnts.readKeyValues(lines, 1);
    if (!nameMap) nameMap = new Map();
    let isFirst = !ctx.musics || ctx.musics.size <= 0;
    if (!ctx.musics) ctx.musics = new Map();
    nameMap.forEach((value, key) => {
        ctx.musics.set(key, getNameFromUrl(value));
    });
    //console.log(ctx.musics);
    if (!ctx.setting.preload) ctx.setting.preload = {};
    if (!ctx.setting.preload.musics) ctx.setting.preload.musics = [];
    nameMap.forEach((value, key) => {
        if (isFirst) ctx.bgm = key;
        if (ctx.setting.preload.musics.indexOf(value) < 0)
            ctx.setting.preload.musics.push(value);
        isFirst = false;
    });

    return ctx;
}
