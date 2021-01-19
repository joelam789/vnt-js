export class GamePlot {
    * onUpdate(sprite) {
        let game = sprite.game;
        let scene = sprite.scene;
        let tween = scene.sys("tween");
        let dialog = scene.spr("dialog-box1").code;
        if (true) {
            let oldBgName = scene.sys("vnt").getBackgroundImageName();
            let newBgName = "bg2";
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
        dialog.open(sprite, "Cindy Lam", ["你周末打算干什么去？", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "Jason Brown", ["我周末看看电视，然后就是去打球。", ]);
        yield sprite.plot.wait();
        if (true) {
            let oldImgName = "miki1";
            let oldImg = scene.spr(oldImgName);
            let newImgName = "miki2";
            let newImg = scene.spr(newImgName);
            newImg.active = true;
            newImg.get("display").object.x = oldImg.get("display").object.x;
            newImg.get("display").object.y = oldImg.get("display").object.y;
            oldImg.get("display").object.alpha = 1.0;
            newImg.get("display").object.alpha = 0.0;
            tween.get(oldImg.get("display").object).to({
                alpha: 0.0
            }, 1000).call(() => oldImg.active = false);
            tween.get(newImg.get("display").object).to({
                alpha: 1.0
            }, 1000).call(() => sprite.plot.signal());
            yield sprite.plot.wait();
        }
        dialog.open(sprite, "Cindy Lam", ["我和你不一样，我就是听听音乐，或者看看书。你喜欢看书吗？", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "Jason Brown", ["\"我也看，当时看的比较少。\"", ]);
        yield sprite.plot.wait();
        if (true) {
            let oldImgName = "miki2";
            let oldImg = scene.spr(oldImgName);
            tween.get(oldImg.get("display").object).to({
                x: -190
            }, 300).call(() => {
                oldImg.active = false;
                sprite.plot.signal();
            });
            yield sprite.plot.wait();
        }
        dialog.open(sprite, "???", ["好了，就先这样吧。。。", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "", ["(loop)", ]);
        yield sprite.plot.wait();
        sprite.active = false;
        scene.timeout(50, () => scene.spr("first-meet").active = true);
        return;
        sprite.active = false;
    }
}