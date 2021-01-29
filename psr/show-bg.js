
const version = "0.0.1";

exports.parse = function (content, ctx) {
    let line = Array.isArray(content) ? content[0] : content;
    let parts = line.split(' ');
    let target = parts.length > 2 ? parts[2].trim() : "";
    if (!target) return ctx;
    let param1 = parts.length > 3 ? parts[3].trim() : "";
    if (ctx.script) {
        let code = "if (true) {"; // so that we can "re-use" same var names
        code += 'let oldBgName = scene.sys("vnt").getBackgroundImageName();';
        code += 'let newBgName = "' + target + '";';
        //code += 'console.log(oldBgName, newBgName);';
        code += 'if (oldBgName && oldBgName != newBgName) { ';
        code += 'scene.sys("vnt").setBackgroundImageName(newBgName);';
        // fade out
        if (!param1 || param1 != "no-effect") {
            // fade-out current bg by default
            code += 'if (scene.spr(oldBgName).active) { ';
            //code += 'console.log("fade out old one - " + oldBgName);';
            code += 'scene.spr(oldBgName).get("display").object.alpha = 1.0;';
            code += 'tween.get(scene.spr(oldBgName).get("display").object)';
            code += '.to({alpha: 0.0}, 1000).call(';
            code += '() => scene.spr(oldBgName).active = false);';
            code += '}'; // end if old bg is active
        } else {
            code += 'scene.spr(oldBgName).active = false;';
        }
        // fade in
        if (!param1 || param1 != "no-effect") {
            // fade-in target bg by default
            code += 'if (!scene.spr(newBgName).active) { ';
            //code += 'console.log("fade in new one - " + newBgName);';
            code += 'scene.spr(newBgName).active = true;';
            code += 'scene.spr(newBgName).get("display").object.alpha = 0.0;';
            code += 'tween.get(scene.spr(newBgName).get("display").object)';
            code += '.to({alpha: 1.0}, 1000).call(';
            code += '() => sprite.plot.signal());';
            code += "yield sprite.plot.wait();"
            code += '} else {'; // end if new bg is not active
            code += 'scene.spr(newBgName).active = true;';
            code += 'scene.spr(newBgName).get("display").object.alpha = 1.0;';
            code += '}';
        } else {
            code += 'scene.spr(newBgName).active = true;';
            code += 'scene.spr(newBgName).get("display").object.alpha = 1.0;';
        }
        //code += 'scene.sys("vnt").setBackgroundImageName(newBgName);';
        code += '} else {'; // end if oldBgName != newBgName 
        code += 'scene.spr(newBgName).active = true;';
        code += 'scene.spr(newBgName).get("display").object.alpha = 1.0;';
        code += 'scene.sys("vnt").setBackgroundImageName(newBgName);';
        code += '}}';
        
        ctx.script += code;
    }
    return ctx;
}
