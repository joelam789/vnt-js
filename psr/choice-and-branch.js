
const version = "0.0.1";

exports.parse = function (lines, ctx) {
    if (ctx.script) {
        let script = "";
        let words = [], plots =[];
        let parts = lines[0].trim().split(' ');
        for (let i=2; i<parts.length; i++) {
            let plotName = parts[i].trim();
            if (plotName) plots.push(plotName);
        }
        for (let i=1; i<lines.length; i++) {
            words.push(lines[i]);
        }

        script += 'dialog.answer(sprite, [';
        while (words.length > 0) {
            script += '"' + words.shift().replaceAll('"', '\\"') + '",';
        }
        script += "]);yield sprite.plot.wait('vnt-answer');";

        //script += "console.log(dialog.getChoice());";

        script += 'if (dialog.getChoice() > 0) { let vnt_plot_names = [';
        while (plots.length > 0) {
            script += '"' + plots.shift().replaceAll('"', '\\"') + '",';
        }
        script += "];";
        script += "sprite.active = false;";
        script += 'scene.sys("vnt").openPlot(vnt_plot_names[dialog.getChoice() - 1]);';
        script += "return; }";
        
        ctx.script += script;
    }
    return ctx;
}
