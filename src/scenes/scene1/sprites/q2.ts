export class GamePlot {
    * onUpdate(sprite) {
        let game = sprite.game;
        let scene = sprite.scene;
        let tween = scene.sys("tween");
        let dialog = scene.sys("vnt").getDialog() ? scene.sys("vnt").getDialog().code : null;
        scene.sys("vnt").snapshot();
        dialog.open(sprite, "Cindy Lam", ["Guess again!", ]);
        yield sprite.plot.wait();
        sprite.active = false;
        scene.spr("try-to-guess").active = true;
    }
}