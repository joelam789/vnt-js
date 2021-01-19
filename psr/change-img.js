
const version = "0.0.1";

exports.parse = function (content, ctx) {
    let line = Array.isArray(content) ? content[0] : content;
    let parts = line.split(' ');
    let keyword1 = parts.length > 2 ? parts[2].trim() : "";
    if (keyword1 != 'from') return ctx;
    let target1 = parts.length > 3 ? parts[3].trim() : ""; // old one
    if (!target1) return ctx;
    let keyword2 = parts.length > 4 ? parts[4].trim() : "";
    if (keyword2 != 'to') return ctx;
    let target2 = parts.length > 5 ? parts[5].trim() : ""; // new one
    if (!target2) return ctx;

    let param1 = parts.length > 6 ? parts[6].trim() : ""; // effect
    if (ctx.script) {
        let code = "if (true) {"; // so that we can "re-use" same var names
        code += 'let oldImgName = "' + target1 + '";';
        code += 'let oldImg = scene.spr(oldImgName);';
        code += 'let newImgName = "' + target2 + '";';
        code += 'let newImg = scene.spr(newImgName);';
        code += 'newImg.active = true;';
        code += 'newImg.get("display").object.x = oldImg.get("display").object.x;';
        code += 'newImg.get("display").object.y = oldImg.get("display").object.y;';
        if (!param1 || param1 != 'no-effect') {
            code += 'oldImg.get("display").object.alpha = 1.0;';
            code += 'newImg.get("display").object.alpha = 0.0;';
            code += 'tween.get(oldImg.get("display").object)';
            code += '.to({alpha: 0.0}, 1000).call(() => oldImg.active = false);';
            code += 'tween.get(newImg.get("display").object)';
            code += '.to({alpha: 1.0}, 1000).call(() => sprite.plot.signal());';
            code += "yield sprite.plot.wait();"
        } else {
            code += 'newImg.get("display").object.alpha = 1.0;';
            code += 'oldImg.active = false;';
        }
        
        code += '}'; // end if true
        ctx.script += code;
    }
    
    return ctx;
}
