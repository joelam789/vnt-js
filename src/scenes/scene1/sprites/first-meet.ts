export class GamePlot {
    * onUpdate(sprite) {
        let game = sprite.game;
        let scene = sprite.scene;
        let tween = scene.sys("tween");
        let dialog = scene.spr("dialog-box1").code;
        if (true) {
            let oldBgName = scene.sys("vnt").getBackgroundImageName();
            let newBgName = "bg1";
            if (oldBgName && oldBgName != newBgName) {
                scene.spr(oldBgName).get("display").object.alpha = 1.0;
                tween.get(scene.spr(oldBgName).get("display").object).to({
                    alpha: 0.0
                }, 1000).call(() => scene.spr(oldBgName).active = false);
                scene.spr(newBgName).active = true;
                scene.spr(newBgName).get("display").object.alpha = 0.0;
                tween.get(scene.spr(newBgName).get("display").object).to({
                    alpha: 1.0
                }, 1000).call(() => sprite.plot.signal());
                yield sprite.plot.wait();
                scene.sys("vnt").setBackgroundImageName(newBgName);
            } else if (!oldBgName) {
                scene.spr(newBgName).active = true;
                scene.spr(newBgName).get("display").object.alpha = 1.0;
                scene.sys("vnt").setBackgroundImageName(newBgName);
            }
        }
        scene.sys("vnt").playBgm("easy-lemon");
        for (let spr of scene.spriteList) {
            if (!spr.template || spr.template != "vnt-img") continue;
            spr.active = false;
        }
        dialog.open(sprite, "", ["ready?", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "", ["let's start ...", ]);
        yield sprite.plot.wait();
        if (true) {
            let newImgName = "miki1";
            let newImg = scene.spr(newImgName);
            newImg.active = true;
            newImg.get("display").object.alpha = 1.0;
            newImg.get("display").object.x = -190;
            newImg.get("display").object.y = 320;
            tween.get(newImg.get("display").object).to({
                x: 160
            }, 300).call(() => sprite.plot.signal());
            yield sprite.plot.wait();
        }
        scene.sys("vnt").playVoice("v-01");
        dialog.open(sprite, "Cindy Lam", ["\"Hello~\"", ]);
        yield sprite.plot.wait();
        scene.sys("vnt").stopVoice();
        dialog.open(sprite, "Jason Brown", ["\"How are you?\"", ]);
        yield sprite.plot.wait();
        scene.sys("vnt").playVoice("v-02");
        dialog.open(sprite, "Cindy Lam", ["\"I'm good thank you.\"", ]);
        yield sprite.plot.wait();
        scene.sys("vnt").stopVoice();
        dialog.open(sprite, "Jason Brown", ["\"That's great to hear.\"", ]);
        yield sprite.plot.wait();
        if (true) {
            let oldImgName = "miki1";
            let oldImg = scene.spr(oldImgName);
            tween.get(oldImg.get("display").object).to({
                x: -190
            }, 300).call(() => {
                oldImg.active = false;
                sprite.plot.signal();
            });
            yield sprite.plot.wait();
        }
        dialog.open(sprite, "???", ["So it's the end ... ?", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "???", ["Or still needs something more ... ?", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "", ["... ...", ]);
        yield sprite.plot.wait();
        sprite.active = false;
        scene.spr("meet-again").active = true;
    }
}