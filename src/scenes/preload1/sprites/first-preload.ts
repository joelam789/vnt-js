export class GamePlot {
    * onUpdate(sprite) {
        let game = sprite.game;
        let scene = sprite.scene;
        let tween = scene.sys("tween");
        let dialog = scene.sys("vnt").getDialog() ? scene.sys("vnt").getDialog().code : null;
        scene.sys("vnt").snapshot();
        if (true) {
            let trans: any = sprite.scene.systems["vtrans"];
            if (trans && trans.isWorking()) yield sprite.plot.wait("fade-in");
        }
        if (true) {
            let oldBgName = scene.sys("vnt").getBackgroundImageName();
            let newBgName = "bg1";
            if (oldBgName && oldBgName != newBgName) {
                scene.sys("vnt").setBackgroundImageName(newBgName);
                if (scene.spr(oldBgName).active) {
                    scene.spr(oldBgName).get("display").object.alpha = 1.0;
                    tween.get(scene.spr(oldBgName).get("display").object).to({
                        alpha: 0.0
                    }, 1000).call(() => scene.spr(oldBgName).active = false);
                }
                if (!scene.spr(newBgName).active) {
                    scene.spr(newBgName).active = true;
                    scene.spr(newBgName).get("display").object.alpha = 0.0;
                    tween.get(scene.spr(newBgName).get("display").object).to({
                        alpha: 1.0
                    }, 1000).call(() => sprite.plot.signal());
                    yield sprite.plot.wait();
                } else {
                    scene.spr(newBgName).active = true;
                    scene.spr(newBgName).get("display").object.alpha = 1.0;
                }
            } else {
                scene.spr(newBgName).active = true;
                scene.spr(newBgName).get("display").object.alpha = 1.0;
                scene.sys("vnt").setBackgroundImageName(newBgName);
            }
        }
        scene.sys("vnt").openPreload("finish-preloading", ["vnt-info", "vnt-dialog", "vnt-save", "title1", "scene1", "scene2", ]);
        sprite.active = false;
        scene.sys("vnt").openPlot("common-end");
        return;
        sprite.active = false;
        scene.spr("finish-preloading").active = true;
    }
}