export class GamePlot {
    * onUpdate(sprite) {
        let game = sprite.game;
        let scene = sprite.scene;
        let tween = scene.sys("tween");
        let dialog = scene.sys("vnt").getDialog() ? scene.sys("vnt").getDialog().code : null;
        dialog.answer(sprite, ["historical stories", "science fictions", "horror stories", "fairy tales", "comics", ]);
        yield sprite.plot.wait('vnt-answer');
        if (dialog.getChoice() > 0) {
            let vnt_plot_names = ["a1", "a2", "a3", "a4", "a5", ];
            sprite.active = false;
            scene.sys("vnt").openPlot(vnt_plot_names[dialog.getChoice() - 1]);
            return;
        }
        sprite.active = false;
        scene.spr("a1").active = true;
    }
}