
const fs = require("fs");
const del = require('del');
const beautify = require('js-beautify');

const version = "0.0.1";

function genJson(ctx, spr, tpls, rect, text = "", click = "") {
    if (spr && tpls && tpls.length > 0 
        && ctx.subpath && ctx.setting) {
        let jsonobj = {
            active: false,
            script: click ? true : false,
            template: tpls[0],
            components:
            {
                display:
                {
                    x: rect.x,
                    y: rect.y,
                    width: rect.w,
                    height: rect.h
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

        if (text && tpls.length > 1) {
            let txtspr = spr + "-text";
            jsonobj = {
                active: false,
                script: false,
                template: tpls[1],
                components:
                {
                    text:
                    {
                        content: text
                    },
                    display:
                    {
                        parent: spr,
                        layer: "ui2",
                        x: rect.w / 2,
                        y: rect.h / 2,
                        anchor:
                        {
                            x: 0.5,
                            y: 0.5
                        }
                    },
                    mouse:
                    {
                        enabled: true,
                        shareable: false,
                        actions: [""]
                    }
                }
            };
            jsonstr = JSON.stringify(jsonobj, null, 4);
            jsonfile = ctx.subpath + "/" + txtspr + ".json";
            fs.writeFileSync(jsonfile, jsonstr, 'utf8');
            if (!ctx.setting.sprites) ctx.setting.sprites = [];
            if (ctx.setting.sprites.indexOf(txtspr) < 0) ctx.setting.sprites.push(txtspr);
        }
    }
    return ctx;
}

function genScript(ctx, spr, click) {
    if (ctx.subpath && spr && click) {
        let code = `export class ButtonScript {
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

    let tpls = [], text = "", click = "";
    let rect = { x: 0, y: 0, w: 120, h: 60 };

    if (values.has("tpl")) {
        tpls = values.get("tpl").split(' ');
    }

    if (values.has("rect")) {
        let nums = values.get("rect").split(' ');
        if (nums.length > 0) rect.x = parseFloat(nums[0]);
        if (nums.length > 1) rect.y = parseFloat(nums[1]);
        if (nums.length > 2) rect.w = parseFloat(nums[2]);
        if (nums.length > 3) rect.h = parseFloat(nums[3]);
    }

    if (values.has("text")) {
        text = values.get("text").trim();
    }

    if (values.has("click")) {
        click = values.get("click").trim();
    }

    ctx = genJson(ctx, spr, tpls, rect, text, click);
    ctx = genScript(ctx, spr, click);

    return ctx;
}
