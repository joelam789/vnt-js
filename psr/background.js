﻿
const fs = require("fs");
const version = "0.0.1";

function genJson(ctx, bgName, bgPath, isFirst, scaleX, scaleY) {
    if (ctx.subpath && ctx.setting) {
        let jsonobj = {
            //active: isFirst ? true : false, // just activate the first
            active: false, // no showing by default
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
        let jsonfile = ctx.subpath + "/" + bgName + ".json";
        fs.writeFileSync(jsonfile, jsonstr, 'utf8');
        ctx.json = jsonstr;
        if (isFirst) ctx.bg = bgName;
        if (!ctx.setting.sprites) ctx.setting.sprites = [];
        if (ctx.setting.sprites.indexOf(bgName) < 0)
            ctx.setting.sprites.push(bgName);
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