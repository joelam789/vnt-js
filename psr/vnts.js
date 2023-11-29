
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

processNormalLine = function (npc, line, last, ctx) {
    if (ctx && ctx.script) {
        let script = "";
        if (last) {
            script += 'dialog.open(sprite, "' + npc + '", [' ;
            script += '"' + line + '"';
            script += "]);yield sprite.plot.wait();";
        } else {
            script += 'dialog.open(sprite, "' + npc + '", [' ;
            script += '"' + line + '"';
            script += "], 50, true);yield sprite.plot.wait();";
        }
        ctx.script += script;
    }
}

processStyleLine = function (npc, line, last, ctx) {
    //console.log("processStyleLine - " + line);
    if (ctx && ctx.script) {
        let script = "";
        let parts = line.split("</style>");
        for (let i=0; i<parts.length; i++) {
            let part = parts[i];
            let isLastPart = i == parts.length - 1 && last;
            let pos = part.indexOf("<style");
            if (pos > 0) {
                let half = part.substring(0, pos);
                processNormalLine(npc, half, false, ctx);
                let lastPart = part.substring(pos);
                processStyleLine(npc, lastPart, isLastPart, ctx);
            } else if (pos == 0) {
                let posWords = part.indexOf(">");
                if (posWords <= 0) {
                    processNormalLine(npc, part, isLastPart, ctx);
                } else {
                    let color = '"#FFFFFF"';
                    let weigth = '"normal"';
                    let paramValue = "";
                    let paramPos = part.indexOf("=");
                    if (paramPos > 0) {
                        paramValue = part.substring(paramPos + 1, posWords).trim();
                        if (paramValue && ctx.styles) {
                            let value = ctx.styles.get(paramValue);
                            if (value) {
                                let settingParts = value.split(' ');
                                if (settingParts.length >= 1) color = '"' + settingParts[0] + '"';
                                if (settingParts.length >= 2) weigth = '"' + settingParts[1] + '"';
                            }
                        } 
                    }
                    let words = part.substring(posWords + 1);
                    if (isLastPart) {
                        script += 'dialog.open(sprite, "' + npc + '", [' ;
                        script += '"' + words + '"';
                        script += "], 50, false, " + color + ", "+ weigth +");yield sprite.plot.wait();";
                    } else {
                        script += 'dialog.open(sprite, "' + npc + '", [' ;
                        script += '"' + words + '"';
                        script += "], 50, true, " + color + ", "+ weigth +");yield sprite.plot.wait();";
                    }
                    ctx.script += script;
                }
            } else {
                processNormalLine(npc, part, isLastPart, ctx);
            }
        }
    }
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

        //script += 'dialog.open(sprite, "' + npc + '", [';
        //for (let line of words) script += '"' + line.replaceAll('"', '\\"') + '",';
        //script += "]);yield sprite.plot.wait();"
        while (words.length > 0) {

            //console.log(words.length);

            let line1 = words.shift().replaceAll('"', '\\"');
            let line2 = words.length > 0 ? words.shift().replaceAll('"', '\\"') : "";
            let line3 = words.length > 0 ? words.shift().replaceAll('"', '\\"') : "";
            let line4 = words.length > 0 ? words.shift().replaceAll('"', '\\"') : "";

            if ((line1.indexOf("<style") < 0 || line1.indexOf("</style>") < 0)
                && (line2.length <= 0 || line2.indexOf("<style") < 0 || line2.indexOf("</style>") < 0)
                && (line3.length <= 0 || line3.indexOf("<style") < 0 || line3.indexOf("</style>") < 0)
                && (line4.length <= 0 || line4.indexOf("<style") < 0 || line4.indexOf("</style>") < 0)) {
                //console.log("here???", line1);
                script = 'dialog.open(sprite, "' + npc + '", [';
                script += '"' + line1 + '",';
                if (line2.length > 0) script += '"' + line2 + '",';
                if (line3.length > 0) script += '"' + line3 + '",';
                if (line4.length > 0) script += '"' + line4 + '",';
                script += "]);yield sprite.plot.wait();";
                ctx.script += script;
            } else {
                //console.log("here");
                let isLastLine = line2.length <= 0 && line3.length <= 0 && line4.length <= 0;
                if (line1.indexOf("<style") >= 0 && line1.indexOf("</style>") > 0) processStyleLine(npc, line1, isLastLine, ctx);
                else processNormalLine(npc, line1, isLastLine, ctx);
                if (line2.length > 0) {
                    isLastLine = line3.length <= 0 && line4.length <= 0;
                    if (line2.indexOf("<style") >= 0 && line2.indexOf("</style>") > 0) processStyleLine(npc, line2, isLastLine, ctx);
                    else processNormalLine(npc, line2, isLastLine, ctx);
                }
                if (line3.length > 0) {
                    isLastLine = line4.length <= 0;
                    if (line3.indexOf("<style") >= 0 && line3.indexOf("</style>") > 0) processStyleLine(npc, line3, isLastLine, ctx);
                    else processNormalLine(npc, line3, isLastLine, ctx);
                }
                if (line4.length > 0) {
                    isLastLine = true;
                    if (line4.indexOf("<style") >= 0 && line4.indexOf("</style>") > 0) processStyleLine(npc, line4, isLastLine, ctx);
                    else processNormalLine(npc, line4, isLastLine, ctx);
                }
            }
        }
        
    }

    return ctx;
}



exports.processCommandLine = function (line, context) {
    //console.log("line", line);
    let parts = line.split(' ');
    if (parts.length <= 1) return context;
    context.command = parts[1].trim();
    let parser = context.parsers ? context.parsers.get(context.command) : null;
    if (!parser) {
        console.warn("command parser not found:", context.command);
        return context;
    } else {
        return parser.parse(line, context);
    }
    return context;
}

exports.processCommandSection = function (lines, context) {
    //console.log("lines", lines);
    let parts = lines[0].split(' ');
    if (parts.length <= 1) return context;
    context.section = parts[1].trim();
    context.command = parts[1].trim();
    let parser = context.parsers ? context.parsers.get(context.section) : null;
    if (!parser) {
        console.warn("command parser not found:", context.section);
        return context;
    } else {
        return parser.parse(lines, context);
    }
    return context;
}

exports.parse = function (content, ctx) {
    return ctx;
}
