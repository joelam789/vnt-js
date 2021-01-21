
const fs = require("fs");
const del = require('del');

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

function processCommandLine(line, context) {
    if (context.vnts) {
        return context.vnts.processCommandLine(line, context);
    }
    return context;
}

function processCommandSection(lines, context) {
    if (context.vnts) {
        return context.vnts.processCommandSection(lines, context);
    }
    return context;
}

function processTextSection(lines, context) {
    //console.log("text", lines);
    if (context.vnts) {
        return context.vnts.genDialogScript(lines, context, processCommandLine);
    }
    return context;
}

function processScriptSection(lines, context = null) {
    //console.log(lines);
    if (!context) context = {};
    if (context) { // reset section and command names
        context.section = "";
        context.command = "";
    }
    if (lines && lines.length > 0) {
        let line = lines[0];
        let len = line.length;
        if (len >= 2 && line.charAt(0) == '#' && line.charAt(1) == '#') {
            return processCommandSection(lines, context);
        } else if (len >= 1 && line.charAt(0) == '#') {
            // just process first line and ignore others
            return processCommandLine(line, context);
        } else {
            return processTextSection(lines, context);
        }
    }
    return context;
}


exports.generate = function () {

    let context = {};
    let parsers = new Map();

    // load parsers ...

    let parserFolder = "./psr";
    let allParserFiles = fs.readdirSync( parserFolder );
    let parserScriptFiles = allParserFiles.filter( function( element ) {
        return element.match(/.*\.(js)/ig);
    });
    for (let item of parserScriptFiles) {
        parsers.set(item.substr(0, item.length - 3), require(parserFolder + "/" + item));
    }

    context.parsers = parsers;
    context.parsers.forEach((value, key) => {
        if (key == "vnts") context.vnts = value;
    });
    console.info("parsers loaded: ", Array.from(parsers.keys()));

    // remove all files and folders under ./src/  ... (should do it in gulpfile.js)
    // copy folders and files from ./tpl/ to ./src/  ... (should do it in gulpfile.js)

    // ...

    // set file paths ...

    let scriptFolder = "./txt";
    let configFileName = "config.json";
    let defaultGameName = "game";

    let srcFolder = "./src";
    let srcGameFolder = srcFolder + "/games";
    let srcSceneFolder = srcFolder + "/scenes";

    let configFilePath = scriptFolder + "/" + configFileName;

    // read ./txt/config.json
    // update ./src/games/game.json (create it if not exist)

    // read game setting from config.json
    if (!fs.existsSync(configFilePath)) {
        throw "config file does not exist: " + configFilePath;
    }
    let config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    if (!config || !config.game || !config.scene) {
        throw "invalid config file: " + configFilePath;
    }
    let gameName = config.game.name ? config.game.name : defaultGameName;
    let gameSettingFile = srcGameFolder + "/" + gameName + ".json";

    // update basic game setting
    let gameSetting = JSON.parse(JSON.stringify(config.game));
    if (fs.existsSync(gameSettingFile)) {
        let oldGameSetting = JSON.parse(fs.readFileSync(gameSettingFile, 'utf8'));
        mergeSimpleObject(oldGameSetting, gameSetting);
        gameSetting = oldGameSetting;
    }

    // get scene setting from config
    let sceneSetting = JSON.parse(JSON.stringify(config.scene));

    // get all .md files under ./txt/
    let allDataFiles = fs.readdirSync( scriptFolder );
    let scriptFiles = allDataFiles.filter(function( element ) {
        return element.match(/.*\.(md)/ig);
    });
    let scriptNames = [];
    for (let item of scriptFiles) scriptNames.push(item.substr(0, item.length - 3));
    let sceneFolders = fs.readdirSync( srcSceneFolder );

    // update scene list in game setting
    if (gameSetting.scenes) {
        for (let i = gameSetting.scenes.length - 1; i >= 0; i--) {
            if (scriptNames.indexOf(gameSetting.scenes[i]) < 0
                && sceneFolders.indexOf(gameSetting.scenes[i]) < 0)
                gameSetting.scenes.splice(i, 1);
        }
    }
    if (sceneSetting.ready && scriptNames.length > 0) {
        if (!gameSetting.scenes) gameSetting.scenes = [];
        for (let item of scriptNames) {
            if (gameSetting.scenes.indexOf(item) < 0)
                gameSetting.scenes.push(item);
        }
    }

    // output game setting
    fs.writeFileSync(gameSettingFile, JSON.stringify(gameSetting, null, 4), 'utf8');

    context.game = gameSetting;
    context.game.width = gameSetting.components.display.width;
    context.game.height = gameSetting.components.display.height;

    // read and process every .md file like this (loop) -
    for (let scriptFile of scriptFiles) {
    // (loop start)
    
        // reset current state
        context.bg = "";
        context.bgm = "";
        context.json = "";
        context.plot = "";
        context.script = "";

        // get current scene name
        let scriptName = scriptFile.substr(0, scriptFile.length - 3);
        
        // create following folders and files if not exist
        // ./src/scenes/scene1/
        // ./src/scenes/scene1/sprites/
        // ./src/scenes/scene1/scene1.json
        let outputMainFolder = srcSceneFolder + "/" + scriptName;
        let outputSubFolder = outputMainFolder + "/sprites";
        if (!fs.existsSync(outputMainFolder)) fs.mkdirSync(outputMainFolder);
        if (!fs.existsSync(outputSubFolder)) fs.mkdirSync(outputSubFolder);

        let mainSetting = JSON.parse(JSON.stringify(sceneSetting));
        context.setting = mainSetting;
        context.mainpath = outputMainFolder;
        context.subpath = outputSubFolder;
        
        // read ./txt/scene1.md
        let script = fs.readFileSync(scriptFolder + "/" + scriptFile, 'utf8');
        let lines = script.split('\n');

        // update scene content with ./txt/scene1.md

        let section = [];
        let commentMode = false;
        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('<!--') && line.endsWith('-->')) continue; // ignore comments
            if (commentMode) {
                if (line.endsWith('-->')) commentMode = false;
                continue;
            }
            if (line.startsWith('<!--')) {
                commentMode = true;
                continue;
            }
            if (line.startsWith('[//]:')) continue; // ignore comments
            
            if (line.length <= 0 && section.length > 0) {
                processScriptSection(section, context);
                section = [];
            } else if (line.length > 0) {
                section.push(line);
            }
        }

        //if (context.bg) {
        //    if (context.setting.components.vnt) {
        //        context.setting.components.vnt.bg = context.bg;
        //    }
        //}

        if (context.plot && context.vnts) {
            context.vnts.finishScript(context);
        }

        let mainSettingFile = outputMainFolder + "/" + scriptName + ".json";
        fs.writeFileSync(mainSettingFile, JSON.stringify(context.setting, null, 4), 'utf8');

    // (loop end)
    }

}
