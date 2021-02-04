
const version = "0.0.1";

exports.parse = function (content, ctx) {
    let line = Array.isArray(content) ? content[0] : content;
    let parts = line.split(' ');
    let btns = [];
    for (let i=2; i<parts.length; i++) {
        let btn = parts[i].trim();
        if (btn && btns.indexOf(btn) < 0) btns.push(btn);
    }
    //let target = parts.length > 2 ? parts[2].trim() : "";
    //if (!target) return ctx;
    //let param1 = parts.length > 3 ? parts[3].trim() : "";
    if (btns.length <= 0) return ctx;
    if (ctx.script) {

        let code = "";

        code += "if (true) {"; // so that we can "re-use" same var names
        code += 'let btns = [';
        for (let btn of btns) code += '"' + btn + '",';
        code += '];';
        code += 'for (let btn of btns) {';
        code += 'let btnSpr = scene.spr(btn);';
        code += 'let txtSpr = scene.spr(btn + "-text");';
        code += 'if (btnSpr) btnSpr.active = true;';
        code += 'if (txtSpr) txtSpr.active = true;';
        code += '}}';

        ctx.script += code;
    }
    return ctx;
}
