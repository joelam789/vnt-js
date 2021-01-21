
const version = "0.0.1";

exports.parse = function (content, ctx) {
    let line = Array.isArray(content) ? content[0] : content;
    let parts = line.split(' ');
    let target = parts.length > 2 ? parts[2].trim() : "";
    if (!target) return ctx;

    if (target == 'none') {
        if (ctx.script) {
            let code = "";
            code += 'for (let spr of scene.spriteList) {';
            code += 'if (!spr.template || spr.template != "vnt-img") continue;';
            code += 'spr.active = false;';
            code += '}'; // end for
            ctx.script += code;
        }
    } else {
        let param1 = parts.length > 3 ? parts[3].trim() : ""; // x
        let param2 = parts.length > 4 ? parts[4].trim() : ""; // y
        let param3 = parts.length > 5 ? parts[5].trim() : ""; // effect
        let param4 = parts.length > 6 ? parts[6].trim() : ""; // effect param1
        let param5 = parts.length > 7 ? parts[7].trim() : ""; // effect param2
        if (ctx.script) {
            let code = "if (true) {"; // so that we can "re-use" same var names
            code += 'let newImgName = "' + target + '";';
            code += 'let newImg = scene.spr(newImgName);';
            code += 'newImg.active = true;';

            if (param3 && param3 == 'from-left-right') {
                let startX = param4 && !isNaN(param4) ? param4 : '-200';
                let duration = param5 && !isNaN(param5) ? param5 : '1000';
                code += 'newImg.get("display").object.alpha = 0.0;';
                code += 'newImg.get("display").object.x = ' + startX + ';';
                code += 'newImg.get("display").object.y = ' + param2 + ';';
                code += 'tween.get(newImg.get("display").object)';
                code += '.to({x: ' + param1 + ', alpha: 1.0}, ' + duration + ').call(() => sprite.plot.signal());';
                code += "yield sprite.plot.wait();"

            } else { // no effect
                code += 'newImg.get("display").object.alpha = 1.0;';
                code += 'newImg.get("display").object.x = ' + param1 + ';';
                code += 'newImg.get("display").object.y = ' + param2 + ';';
            }
            
            code += '}'; // end if true
            ctx.script += code;
        }
    }
    
    return ctx;
}
