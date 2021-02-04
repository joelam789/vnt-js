export class GamePlot {
    * onUpdate(sprite) {
        let game = sprite.game;
        let scene = sprite.scene;
        let tween = scene.sys("tween");
        let dialog = scene.sys("vnt").getDialog() ? scene.sys("vnt").getDialog().code : null;
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
        if (true) {
            let btns = ["btn1", "btn2", ];
            for (let btn of btns) {
                let btnSpr = scene.spr(btn);
                let txtSpr = scene.spr(btn + "-text");
                if (btnSpr) btnSpr.active = true;
                if (txtSpr) txtSpr.active = true;
            }
        }
        sprite.active = false;
        scene.sys("vnt").openPlot("common-end");
        return;
        sprite.active = false;
        scene.spr("load-old-ones").active = true;
    }
}