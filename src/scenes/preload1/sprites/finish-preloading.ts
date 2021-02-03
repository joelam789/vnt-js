export class GamePlot {
    * onUpdate(sprite) {
        let game = sprite.game;
        let scene = sprite.scene;
        let tween = scene.sys("tween");
        let dialog = scene.sys("vnt").getDialog() ? scene.sys("vnt").getDialog().code : null;
        sprite.active = false;
        if (true) {
            let trans: any = sprite.scene.systems["vtrans"];
            if (trans && !trans.isWorking()) {
                trans.callScene("scene1");
                return;
            }
        }
        sprite.active = false;
        scene.spr("common-end").active = true;
    }
}