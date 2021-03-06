﻿
const version = "0.0.1";

function mergeSimpleObject(baseOne, newOne) {
    if (baseOne && newOne) {
        for (let key of Object.keys(newOne)) {
            if (baseOne[key]) {
                if (Array.isArray(baseOne[key]) && Array.isArray(newOne[key])) {
                    baseOne[key] = newOne[key];
                } else if (typeof baseOne[key] == "object" && typeof newOne[key] == "object") {
                    mergeSimpleObject(baseOne[key], newOne[key]);
                } else baseOne[key] = newOne[key];
            } else baseOne[key] = newOne[key];
        }
    }
}

exports.parse = function (lines, ctx) {
    //console.log("var parser", lines);
    let nameMap = null;
    if (ctx.vnts) nameMap = ctx.vnts.readKeyValues(lines, 1);
    if (!nameMap) nameMap = new Map();
    let isFirst = !ctx.variables || ctx.variables.size <= 0;
    if (!ctx.variables) ctx.variables = new Map();
    nameMap.forEach((value, key) => {
        ctx.variables.set(key, value);
    });
    //console.log(ctx.variables);
    let existingVars = ctx.setting.components["vars"];
    if (!existingVars) existingVars = {};
    let currentVars = {};
    nameMap.forEach((value, key) => {
        if (value && value == "null") currentVars[key] = null;
        else if (value) {
            if ((value.startsWith('"') && value.endsWith('"'))
                || (value.startsWith("'") && value.endsWith("'"))) {
                currentVars[key] = value.substring(1, value.length - 1);
            } else if (!isNaN(value)) {
                currentVars[key] = parseFloat(value);
            } else {
                currentVars[key] = value.toString();
            }
        }
    });
    mergeSimpleObject(existingVars, currentVars);
    ctx.setting.components["vars"] = existingVars;

    //console.log(ctx.setting.components["vars"]);

    return ctx;
}
