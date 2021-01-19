
const fs = require("fs");
const version = "0.0.1";

function genJson(ctx, imgName, imgPath, scaleX, scaleY) {
    if (ctx.subpath && ctx.setting) {
        let jsonobj = {
            active: false, // no showing by default
            script: false, // image should have no script
            template: "vnt-img",
            components:
            {
                graphic:
                {
                    image: imgPath
                },
                display: // center it (anchor is 0.5)
                {
                    x: ctx.game.width / 2,
                    y: ctx.game.height / 2,
                    scale:
                    {
                        x: 1.0,
                        y: 1.0
                    }
                }
            }
        };
        if (scaleX) jsonobj.components.display.scale.x = parseFloat(scaleX);
        if (scaleY) jsonobj.components.display.scale.y = parseFloat(scaleY);
        let jsonstr = JSON.stringify(jsonobj, null, 4);
        let jsonfile = ctx.subpath + "/" + imgName + ".json";
        fs.writeFileSync(jsonfile, jsonstr, 'utf8');
        ctx.json = jsonstr;
        if (!ctx.setting.sprites) ctx.setting.sprites = [];
        if (ctx.setting.sprites.indexOf(imgName) < 0)
            ctx.setting.sprites.push(imgName);
    }
    return ctx;
}

exports.parse = function (lines, ctx) {
    //console.log("image parser", lines);
    let nameMap = null;
    if (ctx.vnts) nameMap = ctx.vnts.readKeyValues(lines, 1);
    if (!nameMap) nameMap = new Map();
    if (!ctx.images) ctx.images = nameMap;
    else {
        nameMap.forEach((value, key) => {
            ctx.images.set(key, value);
        });
    }
    nameMap.forEach((value, key) => {
        let parts = value.split(' ');
        genJson(ctx, key, parts[0], parts[1], parts[2]);
    });

    return ctx;
}
