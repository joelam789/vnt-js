
const version = "0.0.1";

exports.parse = function (lines, ctx) {

    let values = null;
    if (ctx.vnts) values = ctx.vnts.readKeyValues(lines, 1);
    if (!values || values.size <= 0) return ctx;
    
    let sceneNames = values.get("scenes") ? values.get("scenes").split(" ") : null;
    let nextPlotName = values.get("finish") ? values.get("finish") : null;
    if (!sceneNames || sceneNames.length <= 0 || !nextPlotName) return ctx;

    if (!ctx.setting.scenes) ctx.setting.scenes = [];
    if (ctx.setting.scenes.indexOf("vnt-preload") < 0)
        ctx.setting.scenes.push("vnt-preload");

    let code = "";
    if (ctx.script) {
        code += 'scene.sys("vnt").openPreload("' + nextPlotName + '", [';
        for (let sceneName of sceneNames) code += '"' + sceneName + '",';
        code += ']);';
        ctx.script += code;
    }

    return ctx;
}
