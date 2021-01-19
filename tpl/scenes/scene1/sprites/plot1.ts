
export class Plot1 {

    * onUpdate(sprite) {

        let scene = sprite.scene;
        let tween = scene.sys("tween");
        let motion = scene.sys("motion");
        let profile = scene.game.get("vnt");

        console.log("plot started - " + sprite.name);

        let dialog1 = scene.spr("dialog-box1").code;

        dialog1.open(sprite, "Kid", [
            "Here is my secret garden.",
            "I feel peaceful and calm everytime when I get here.",
        ]);
        yield sprite.plot.wait();

        dialog1.open(sprite, "Kid", [
            "You look not a bad guy.",
            "Could you please come and play with me?",
        ]);
        yield sprite.plot.wait();

        dialog1.open(sprite, "", [
            "Do you like farmers?"
        ], 50 , true);
        yield sprite.plot.wait();
        dialog1.answer(sprite, [
            "Yes.",
            "No.",
            "I won't tell you."
        ]);
        yield sprite.plot.wait();

        let responseWords = [
            "I am glad to hear that.",
            "You should get to know more about them.",
            "Okay..."
        ];
        dialog1.open(sprite, "???", [
            responseWords[dialog1.getChoice() - 1]
        ]);
        yield sprite.plot.wait();
    
        dialog1.close();

        console.log("plot ended - " + sprite.name);

        sprite.active = false;
    }

}
