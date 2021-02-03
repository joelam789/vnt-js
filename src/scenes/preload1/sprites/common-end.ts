export class GamePlot {
    * onUpdate(sprite) {
        let game = sprite.game;
        let scene = sprite.scene;
        let tween = scene.sys("tween");
        let dialog = scene.sys("vnt").getDialog() ? scene.sys("vnt").getDialog().code : null;
        sprite.active = false;
    }
}