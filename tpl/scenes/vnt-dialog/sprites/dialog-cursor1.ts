export class SceneDialogSpriteDialogCursor1 {

    onActivate(spr) {
		let chatbox = spr.scene.sprites["dialog-box1"];
		if (chatbox && chatbox.active) {
			spr.scene.timeout(500, () => {
				spr.active = false;
				spr.scene.timeout(300, () => {
					spr.active = chatbox.active && chatbox.custom.status == "done";
				});
			});
		}
		
    }

}
