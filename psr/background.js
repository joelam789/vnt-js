
const fs = require("fs");
const version = "0.0.1";

function genJson(ctx, bgName, bgPath, isFirst, scaleX, scaleY) {
    if (ctx.subpath && ctx.setting) {
        let jsonobj = {
            //active: false, // no showing by default
            active: isFirst ? true : false, // just activate the first
            script: false, // image should have no script
            template: "vnt-bg",
            components:
            {
                graphic:
                {
                    image: bgPath
                },
                display: // center it (anchor is 0.5)
                {
                    x: ctx.game.width / 2,
                    y: ctx.game.height / 2,
                    visible: true,
                    alpha: 1.0,
                    scale:
                    {
                        x: scaleX ? parseFloat(scaleX) : 1.0,
                        y: scaleY ? parseFloat(scaleY) : 1.0
                    }
                }
            }
        };
        let jsonstr = JSON.stringify(jsonobj, null, 4);
        let jsonfile = ctx.subpath + "/" + bgName + ".json";
        fs.writeFileSync(jsonfile, jsonstr, 'utf8');
        ctx.json = jsonstr;

        // add it to scene
        if (isFirst) ctx.bg = bgName;
        if (!ctx.setting.sprites) ctx.setting.sprites = [];
        if (ctx.setting.sprites.indexOf(bgName) < 0)
            ctx.setting.sprites.push(bgName);

        // try to preload it btw
        if (!ctx.setting.preload) ctx.setting.preload = {};
        if (!ctx.setting.preload.images) ctx.setting.preload.images = [];
        if (ctx.setting.preload.images.indexOf(bgPath) < 0)
            ctx.setting.preload.images.push(bgPath);
    }
    return ctx;
}

exports.parse = function (lines, ctx) {
    //console.log("background parser", lines);
    let nameMap = null;
    if (ctx.vnts) nameMap = ctx.vnts.readKeyValues(lines, 1);
    if (!nameMap) nameMap = new Map();
    let isFirst = !ctx.backgrounds || ctx.backgrounds.size <= 0;
    if (!ctx.backgrounds) ctx.backgrounds = nameMap;
    else {
        nameMap.forEach((value, key) => {
            ctx.backgrounds.set(key, value);
        });
    }
    nameMap.forEach((value, key) => {
        let parts = value.split(' ');
        genJson(ctx, key, parts[0], isFirst, parts[1], parts[2]);
        isFirst = false;
    });

    return ctx;
}
