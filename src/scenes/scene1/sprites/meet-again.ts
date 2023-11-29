export class GamePlot {
    * onUpdate(sprite) {
        let game = sprite.game;
        let scene = sprite.scene;
        let tween = scene.sys("tween");
        let dialog = scene.sys("vnt").getDialog() ? scene.sys("vnt").getDialog().code : null;
        scene.sys("vnt").snapshot();
        if (true) {
            let oldBgName = scene.sys("vnt").getBackgroundImageName();
            let newBgName = "bg2";
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
        if (true) {
            let newImgName = "miki1";
            let newImg = scene.spr(newImgName);
            newImg.active = true;
            newImg.get("display").object.alpha = 0.0;
            newImg.get("display").object.x = 60;
            newImg.get("display").object.y = 520;
            tween.get(newImg.get("display").object).to({
                x: 160,
                alpha: 1.0
            }, 400).call(() => sprite.plot.signal());
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
        dialog.open(sprite, "Jason Brown", ["我也看，只是看的不多。", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "Cindy Lam", ["那你平时喜欢看哪些书呢？", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "Jason Brown", ["一些武侠小说呀，比如", "《射雕英雄传》、《神雕侠侣》、", "《书剑恩仇录》、《笑傲江湖》、", "《七剑下天山》、《白发魔女传》。。。", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "Jason Brown", ["还有一些科幻小说，比如", "《八十天环游世界》、《时间机器》、", "《科学怪人》、《太空漫游2001》、", "《指环王》、《哈利波特》...... 等等", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "Cindy Lam", ["那你读的书还真不少哟！", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "Jason Brown", ["嘿嘿，算半个小说迷吧", ]);
        yield sprite.plot.wait();
        sprite.active = false;
        scene.spr("night-talk").active = true;
    }
}