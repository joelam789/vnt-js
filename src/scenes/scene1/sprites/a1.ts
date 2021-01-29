export class GamePlot {
    * onUpdate(sprite) {
        let game = sprite.game;
        let scene = sprite.scene;
        let tween = scene.sys("tween");
        let dialog = scene.sys("vnt").getDialog().code;
        scene.sys("vnt").snapshot();
        dialog.open(sprite, "Cindy Lam", ["No, not historical stories", ]);
        yield sprite.plot.wait();
        sprite.active = false;
        scene.sys("vnt").openPlot("q2");
        return;
        sprite.active = false;
        scene.spr("a2").active = true;
    }
}