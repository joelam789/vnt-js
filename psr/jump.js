
const version = "0.0.1";

exports.parse = function (content, ctx) {
    let line = Array.isArray(content) ? content[0] : content;
    let parts = line.split(' ');
    let labelName = parts.length > 2 ? parts[2].trim() : "";
    if (!labelName) return ctx;
    if (ctx.script) {
        let code = "sprite.active = false;";
        code += 'scene.sys("vnt").openPlot("' + labelName + '");';
        code += "return;";
        ctx.script += code;
    }
    return ctx;
}
