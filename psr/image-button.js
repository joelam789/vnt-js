
const fs = require("fs");
const del = require('del');
const beautify = require('js-beautify');

const version = "0.0.1";

function genJson(ctx, spr, url, pos, scale, click = "") {
    if (spr && url && ctx.subpath && ctx.setting) {
        let jsonobj = {
            active: false,
            script: click ? true : false,
            template: "vnt-img",
            components:
            {
                graphic:
                {
                    image: url
                },
                display:
                {
                    x: pos.x,
                    y: pos.y,
                    scale:
                    {
                        x: scale.x,
                        y: scale.y
                    }

                },
                mouse:
                {
                    enabled: true,
                    shareable: false,
                    actions: click ? ["pointerup"] : [""]
                },
                event:
                {
                    onPointerup: click ? "onPointerup" : ""
                }
            }
        };
        let jsonstr = JSON.stringify(jsonobj, null, 4);
        let jsonfile = ctx.subpath + "/" + spr + ".json";
        fs.writeFileSync(jsonfile, jsonstr, 'utf8');
        if (!ctx.setting.sprites) ctx.setting.sprites = [];
        if (ctx.setting.sprites.indexOf(spr) < 0) ctx.setting.sprites.push(spr);
    }
    return ctx;
}

function genScript(ctx, spr, click) {
    if (ctx.subpath && spr && click) {
        let code = `export class ImageButtonScript {
                        onPointerup(sprite) {`;
        code += 'sprite.scene.timeout(50, () => sprite.scene.spr("' + click + '").active = true);';
        code += "}"; // end of function
        code += "}"; // end of class
        let jscode = beautify.js(code, { 
                                    indent_size: 4, 
                                    space_in_empty_paren: true,
                                    keep_array_indentation: true
                                });
        let jsfile = ctx.subpath + "/" + spr + ".ts";
        fs.writeFileSync(jsfile, jscode, 'utf8');
    }
    return ctx;
}

exports.parse = function (content, ctx) {

    let firstLine = Array.isArray(content) ? content[0] : content;
    let parts = firstLine.split(' ');
    let spr = parts.length > 2 ? parts[2].trim() : "";
    if (!spr) return ctx;

    let values = null;
    if (ctx.vnts && Array.isArray(content)) values = ctx.vnts.readKeyValues(content, 1);
    if (!values || values.size <= 0) return ctx;

    let url = "", click = "";
    let pos = { x: 0, y: 0 };
    let scale = { x: 1.0, y: 1.0 };

    if (values.has("url")) {
        url = values.get("url").trim();
    }

    if (values.has("pos")) {
        let nums = values.get("pos").split(' ');
        if (nums.length > 0) pos.x = parseFloat(nums[0]);
        if (nums.length > 1) pos.y = parseFloat(nums[1]);
    }

    if (values.has("scale")) {
        let nums = values.get("scale").split(' ');
        if (nums.length > 0) scale.x = parseFloat(nums[0]);
        if (nums.length > 1) scale.y = parseFloat(nums[1]);
    }

    if (values.has("click")) {
        click = values.get("click").trim();
    }

    ctx = genJson(ctx, spr, url, pos, scale, click);
    ctx = genScript(ctx, spr, click);

    return ctx;
}
