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
        dialog.open(sprite, "", ["This is a test for another scene", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "", ["... ...", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "Jenny Green", ["\"Okay, another test...\"", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "???", ["\"Yes. I am glad that you can get here!\"", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "", ["... ...", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "", ["... ...", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "", ["Another ending... for now", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "", ["(go back)", ]);
        yield sprite.plot.wait();
        sprite.active = false;
        if (true) {
            let trans: any = sprite.scene.systems["vtrans"];
            if (trans && !trans.isWorking()) {
                trans.callScene("scene1");
                return;
            }
        }
        sprite.active = false;
    }
}