
const version = "0.0.1";

exports.parse = function (content, ctx) {
    let line = Array.isArray(content) ? content[0] : content;
    let parts = line.split(' ');
    let labelName = parts.length > 2 ? parts[2].trim() : "";
    if (!labelName) return ctx;
    let param1 = parts.length > 3 ? parts[3].trim() : "";
    if (ctx.script) {
        let code = "sprite.active = false;";
        if (!param1 || param1 != "no-effect") {
            code += 'if (true) {';
            code += 'let trans: any = sprite.scene.systems["vtrans"];';
            code += 'if (trans && !trans.isWorking()) {';
            code += 'trans.callScene("' + labelName + '");';
            code += "return;}}";
        } else {
            code += 'sprite.game.loadScene("' + labelName + '", (newScene) => {';
            code += 'if (newScene) {';
            code += 'newScene.game.scene = newScene;';
            code += 'newScene.reset();';
            code += "}});";
            code += "return;";
        }
        ctx.script += code;
    }
    return ctx;
}
