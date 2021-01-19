
const version = "0.0.1";

exports.parse = function (content, ctx) {
    let line = Array.isArray(content) ? content[0] : content;
    let parts = line.split(' ');
    let target = parts.length > 2 ? parts[2].trim() : "";
    if (!target) return ctx;

    if (target == 'all') {
        if (ctx.script) {
            let code = "";
            code += 'for (let spr of scene.spriteList) {';
            code += 'if (!spr.template || spr.template != "vnt-img") continue;';
            code += 'spr.active = false;';
            code += '}'; // end for
            ctx.script += code;
        }
    } else {
        let param1 = parts.length > 3 ? parts[3].trim() : ""; // effect
        let param2 = parts.length > 4 ? parts[4].trim() : ""; // effect param1
        let param3 = parts.length > 5 ? parts[5].trim() : ""; // effect param2
        if (ctx.script) {
            let code = "if (true) {"; // so that we can "re-use" same var names
            code += 'let oldImgName = "' + target + '";';
            code += 'let oldImg = scene.spr(oldImgName);';

            if (param1 && param1 == 'to-left-right') {
                let startX = param2 && !isNaN(param2) ? param2 : '-200';
                let duration = param3 && !isNaN(param3) ? param3 : '1000';
                code += 'tween.get(oldImg.get("display").object)';
                code += '.to({x: ' + param2 + '}, ' + duration + ').call(() => {';
                code += "oldImg.active = false; sprite.plot.signal(); });"
                code += "yield sprite.plot.wait();"

            } else { // no effect
                code += 'oldImg.active = false;';
            }
            
            code += '}'; // end if true
            ctx.script += code;
        }
    }
    
    return ctx;
}
