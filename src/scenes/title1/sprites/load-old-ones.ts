export class GamePlot {
    * onUpdate(sprite) {
        let game = sprite.game;
        let scene = sprite.scene;
        let tween = scene.sys("tween");
        let dialog = scene.sys("vnt").getDialog() ? scene.sys("vnt").getDialog().code : null;
        scene.sys("vnt").snapshot();
        scene.sys("vnt").showLoadBox();
        sprite.active = false;
        scene.sys("vnt").openPlot("common-end");
        return;
        sprite.active = false;
        scene.spr("start-new-game").active = true;
    }
}