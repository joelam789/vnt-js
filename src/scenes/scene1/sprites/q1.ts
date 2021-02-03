export class GamePlot {
    * onUpdate(sprite) {
        let game = sprite.game;
        let scene = sprite.scene;
        let tween = scene.sys("tween");
        let dialog = scene.sys("vnt").getDialog() ? scene.sys("vnt").getDialog().code : null;
        scene.sys("vnt").snapshot();
        dialog.open(sprite, "Cindy Lam", ["Then guess what kind of books I like to read?", ]);
        yield sprite.plot.wait();
        sprite.active = false;
        scene.sys("vnt").openPlot("try-to-guess");
        return;
        sprite.active = false;
        scene.spr("q2").active = true;
    }
}