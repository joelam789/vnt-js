
const fs = require("fs");
const del = require('del');
const beautify = require('js-beautify');

const version = "0.0.1";

exports.readKeyValues = function (lines, startIdx, endIdx = -1, callback = null) {
    if (!lines || startIdx < 0 || startIdx > lines.length-1) return null;
    if (!isNaN(endIdx) && endIdx >= 0 && startIdx > endIdx) return null;
    let map = new Map();
    let lastIdx = endIdx < 0 ? lines.length-1 : endIdx;
    for (let i=startIdx; i<=lastIdx; i++) {
        let line = lines[i].trim();
        let idx = line.indexOf('=');
        if (idx > 0) {
            let key = line.substring(0, idx).trim();
            let value = key.length > 0 ? line.substring(idx+1).trim() : "";
            if (value.length > 0) {
                map.set(key, value);
                if (callback) callback(map, key, value);
            }
        }
    }
    return map;
}

exports.finishScript = function (ctx, nextOne = null) {
    if (ctx.plot && ctx.subpath && ctx.script) {
        let endcode = "sprite.active = false;";
        if (nextOne) endcode += 'scene.spr("' + nextOne + '").active = true;';
        endcode += "}}";
        let jscode = beautify.js(ctx.script + endcode, { 
                                    indent_size: 4, 
                                    space_in_empty_paren: true,
                                    keep_array_indentation: true
                                });
        let jsfile = ctx.subpath + "/" + ctx.plot + ".ts";
        fs.writeFileSync(jsfile, jscode, 'utf8');
    }
    return ctx;
}

exports.genDialogScript = function(lines, ctx, callback) {
    if (ctx.script) {
        let npc = "", script = "";
        let words = [], cmds =[];
        let first = lines[0].trim();
        if (ctx.characters && ctx.characters.has(first)) {
            npc = ctx.characters.get(first);
        }
        if (npc.length > 0 ) npc = npc.replaceAll('"', '\\"');
        for (let i = npc.length > 0 ? 1 : 0; i<lines.length; i++) {
            if (lines[i].startsWith('# ')) cmds.push(lines[i]);
            else words.push(lines[i]);
        }
        if (callback) for (let line of cmds) ctx = callback(line, ctx);
        script += 'dialog.open(sprite, "' + npc + '", [';
        for (let line of words) script += '"' + line.replaceAll('"', '\\"') + '",';
        script += "]);yield sprite.plot.wait();"
        ctx.script += script;
    }
    return ctx;
}

exports.parse = function (content, ctx) {
    return ctx;
}
