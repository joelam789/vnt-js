export class GamePlot {
    * onUpdate(sprite) {
        let game = sprite.game;
        let scene = sprite.scene;
        let tween = scene.sys("tween");
        let dialog = scene.sys("vnt").getDialog() ? scene.sys("vnt").getDialog().code : null;
        scene.sys("vnt").snapshot();
        dialog.open(sprite, "Cindy Lam", ["Bingo! I like comic books best!", ]);
        yield sprite.plot.wait();
        if (true) {
            let oldImgName = "miki2";
            let oldImg = scene.spr(oldImgName);
            tween.get(oldImg.get("display").object).to({
                x: 60,
                alpha: 0.0
            }, 400).call(() => {
                oldImg.active = false;
                sprite.plot.signal();
            });
            yield sprite.plot.wait();
        }
        dialog.open(sprite, "", ["... ...", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "", ["Okay, this is the ending... for now", ]);
        yield sprite.plot.wait();
        dialog.open(sprite, "", ["(next scene)", ]);
        yield sprite.plot.wait();
        sprite.active = false;
        if (true) {
            let trans: any = sprite.scene.systems["vtrans"];
            if (trans && !trans.isWorking()) {
                trans.callScene("scene2");
                return;
            }
        }
        sprite.active = false;
    }
}