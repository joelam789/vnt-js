export class SceneDialogSpriteDialogCursor1 {

    onActivate(spr) {
		let chatbox = spr.scene.sprites["vnt-dialog-box1"];
		if (chatbox && chatbox.active) {
			spr.get("display").object.alpha = 1.0;
		}
	}
	
	onUpdate(spr) {
		let chatbox = spr.scene.sprites["vnt-dialog-box1"];
		if (chatbox && chatbox.active) {
			let tween = spr.scene.sys("tween");
			let display = spr.get("display").object;
			if (display.alpha >= 1.0) {
				tween.get(display).to({alpha: 0.0}, 800, null);
			} else if (display.alpha <= 0.0) {
				tween.get(display).to({alpha: 1.0}, 1000, null);
			}
		}
	}

}
