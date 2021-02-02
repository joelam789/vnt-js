
const fs = require("fs");
const del = require('del');

const version = "0.0.1";

function genJson(ctx) {
    if (ctx.plot && ctx.subpath && ctx.setting) {
        let jsonobj = {
            active: ctx.script ? false : true, // just activate the first
            script: true, // plot must have script
            template: "vnt-plot"
        };
        let jsonstr = JSON.stringify(jsonobj, null, 4);
        let jsonfile = ctx.subpath + "/" + ctx.plot + ".json";
        fs.writeFileSync(jsonfile, jsonstr, 'utf8');
        ctx.json = jsonstr;
        if (!ctx.setting.sprites) ctx.setting.sprites = [];
        if (ctx.setting.sprites.indexOf(ctx.plot) < 0)
            ctx.setting.sprites.push(ctx.plot);
    }
    return ctx;
}

function genScriptStart(ctx, skipSavepoint = false) {
    if (ctx.plot && ctx.subpath) {

        let jscode = `export class GamePlot {
                        * onUpdate(sprite) {
                            let game = sprite.game;
                            let scene = sprite.scene;
                            let tween = scene.sys("tween");
                            let dialog = scene.sys("vnt").getDialog().code;`;
        if (!skipSavepoint) jscode += 'scene.sys("vnt").snapshot();';
        if (!ctx.script) { // if it's the first plot ...
            jscode += 'if (true) {';
            jscode += 'let trans: any = sprite.scene.systems["vtrans"];';
            jscode += 'if (trans && trans.isWorking()) yield sprite.plot.wait("fade-in");';
            jscode += "}";
        }
        ctx.script = jscode;
    }
    return ctx;
}

function genScriptEnd(ctx, nextOne = null) {
    if (ctx && ctx.plot && ctx.vnts) {
        return ctx.vnts.finishScript(ctx, nextOne);
    }
    return ctx;
}

exports.outputJson = function(ctx) {
    return genJson(ctx);
}

exports.outputScriptStart = function(ctx) {
    genScriptStart(ctx);
}

exports.outputScriptEnd = function(ctx) {
    genScriptEnd(ctx);
}

exports.parse = function (content, ctx) {
    let line = Array.isArray(content) ? content[0] : content;
    let parts = line.split(' ');
    let labelName = parts.length > 2 ? parts[2].trim() : "";
    let param1 = parts.length > 3 ? parts[3].trim() : "";
    if (!labelName) return ctx;
    let lastLabel = ctx.plot ? ctx.plot : "";
    if (lastLabel) genScriptEnd(ctx, labelName);
    ctx.plot = labelName;
    genJson(ctx);
    genScriptStart(ctx, param1 && param1 == "no-savepoint");
    return ctx;
}
