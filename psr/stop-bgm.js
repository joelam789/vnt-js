﻿
const version = "0.0.1";

exports.parse = function (content, ctx) {
    let line = Array.isArray(content) ? content[0] : content;
    let parts = line.split(' ');
    let target = parts.length > 2 ? parts[2].trim() : "";
    //if (!target) return ctx;
    let param1 = parts.length > 3 ? parts[3].trim() : "";
    //let fullname = ctx.sounds ? ctx.sounds.get(target) : null;
    if (ctx.script) {
        let code = "";
        code += 'scene.sys("vnt").stopBgm();';
        ctx.script += code;
    }
    return ctx;
}
