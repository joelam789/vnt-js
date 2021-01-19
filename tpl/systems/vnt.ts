
export class VisualNovelTemplate implements OGE2D.Updater {

	name: string = "vnt";
	
	vnt: any = null;
	scene: OGE2D.Scene = null;
	dialog: OGE2D.Sprite = null;
	profile: any = null;
	gamepad: any = null;
	keyboard: any = null;
	holdon: boolean = false;

	init(game: OGE2D.Game): boolean {
		this.profile = game.components.vnt;
		console.log("vnt system is loaded successfully");
		return true;
	}

	activate(scene: OGE2D.Scene) {
		this.dialog = null;
		this.holdon = false;
		this.scene = scene;
		this.gamepad = scene.systems["gamepad"];
		this.keyboard = scene.systems["keyboard"];
		this.vnt = scene.components["vnt"];
		if (this.vnt) {
			if (this.vnt.dialog) this.dialog = scene.sprites[this.vnt.dialog];
			if (!this.vnt.times) this.vnt.times = 1;
			else this.vnt.times += 1;
		}
	}

	update(scene: OGE2D.Scene, time: number) {
		this.handleKeyboard(scene);
	}

	getBackgroundImageName() {
		if (this.vnt) return this.vnt.bg;
		return "";
	}

	setBackgroundImageName(imgName: string) {
		if (this.vnt) this.vnt.bg = imgName;
	}

	playBgm(bgmName: string) {
		if (this.scene && this.vnt && bgmName) {
			if (this.vnt.bgm && this.vnt.bgm != bgmName) {
				this.scene.game.lib("audio").musics[this.vnt.bgm].stop();
				this.scene.game.lib("audio").musics[bgmName].volume = 1.0;
				this.scene.game.lib("audio").musics[bgmName].play();
				this.vnt.bgm = bgmName;
			} else if (!this.vnt.bgm) {
				this.scene.game.lib("audio").musics[bgmName].volume = 1.0;
				this.scene.game.lib("audio").musics[bgmName].play();
				this.vnt.bgm = bgmName;
			}
		}
	}

	stopBgm() {
		if (this.scene && this.vnt && this.vnt.bgm) {
			this.scene.game.lib("audio").musics[this.vnt.bgm].stop();
			this.vnt.bgm = "";
		}
	}

	playVoice(voiceName: string) {
		if (this.scene && this.vnt && voiceName) {
			if (this.vnt.voice && this.vnt.voice != voiceName) {
				this.scene.game.lib("audio").sounds[this.vnt.voice].stop();
				this.scene.game.lib("audio").sounds[voiceName].volume = 1.0;
				this.scene.game.lib("audio").sounds[voiceName].play();
				this.vnt.voice = voiceName;
			} else if (!this.vnt.voice) {
				this.scene.game.lib("audio").sounds[voiceName].volume = 1.0;
				this.scene.game.lib("audio").sounds[voiceName].play();
				this.vnt.voice = voiceName;
			}
		}
	}

	stopVoice() {
		if (this.scene && this.vnt && this.vnt.voice) {
			this.scene.game.lib("audio").sounds[this.vnt.voice].stop();
			this.vnt.voice = "";
		}
	}

	checkMovementControl() {
		if (!this.keyboard) return null;
		if (this.keyboard.keys["ArrowUp"]) return "up";
		else if (this.keyboard.keys["ArrowDown"]) return "down";
		else if (this.keyboard.keys["ArrowLeft"]) return "left";
		else if (this.keyboard.keys["ArrowRight"]) return "right";
		return "";
	}

	checkActionControl() {
		if (!this.keyboard) return null;
		if (this.keyboard.keys[" "] || this.keyboard.keys["Enter"]) return "check";
		//else if (this.keyboard.keys["Escape"]) return "menu";
		return "";
	}

	isTalking() {
		return this.dialog && this.dialog.active;
	}

	isAnswering() {
		return this.dialog && this.dialog.active 
				&& this.dialog.code && this.dialog.code.isAnswering();
	}

	selectAnswer() {
		if (this.dialog && this.dialog.active && this.dialog.code) this.dialog.code.selectAnswer();
	}

	handleKeyboard(scene: OGE2D.Scene) { // handle (virtual) controller

		if (scene.paused) return;

		if (this.keyboard == undefined || this.keyboard == null) return;
		if (this.profile == undefined || this.profile == null) return;
		if (this.profile.controllable !== true) return;

		if (this.gamepad) {
			let firstGamepad = this.gamepad.getFirstGamepad();
			if (firstGamepad) {
				this.keyboard.keys["ArrowUp"] = firstGamepad.keys["up"];
				this.keyboard.keys["ArrowDown"] = firstGamepad.keys["down"];
				this.keyboard.keys["ArrowLeft"] = firstGamepad.keys["left"];
				this.keyboard.keys["ArrowRight"] = firstGamepad.keys["right"];
				this.keyboard.keys[" "] = firstGamepad.keys["b0"];
				this.keyboard.keys["Escape"] = firstGamepad.keys["b1"];
			}
		}

		let jbuttons = (window as any).vbuttons;
		if (jbuttons) {
			let isUp = jbuttons.up;
			let isDown = jbuttons.down;
			let isLeft = jbuttons.left;
			let isRight = jbuttons.right;
			if (isUp || isDown || isLeft || isRight) {
				this.keyboard.keys["ArrowUp"] = isUp;
				this.keyboard.keys["ArrowDown"] = isDown;
				this.keyboard.keys["ArrowLeft"] = isLeft;
				this.keyboard.keys["ArrowRight"] = isRight;
			} else {
				this.keyboard.keys["ArrowUp"] = false;
				this.keyboard.keys["ArrowDown"] = false;
				this.keyboard.keys["ArrowLeft"] = false;
				this.keyboard.keys["ArrowRight"] = false;
			}
			this.keyboard.keys[" "] = jbuttons.b1 === true;
			this.keyboard.keys["Escape"] = jbuttons.b2 === true;
		}

		let profile = scene.game.get("vnt");
		let speed = profile ? profile.movespeed : 1;
		let dir = this.checkMovementControl();
		let act = this.checkActionControl();
		let walking = false;
		let talking = this.isTalking();
		//console.log(act, talking);

		if (talking && !this.holdon) {
			if (this.isAnswering()) {
				if (dir && (dir == "up" || dir == "down")) {
					this.dialog.code.moveCursor(dir);
					this.holdon = true;
					scene.timeout(200, () => this.holdon = false);
				}
				if (act && !this.holdon) {
					this.selectAnswer();
					this.holdon = true;
					scene.timeout(200, () => this.holdon = false);
				}
			}
		}
		if (act && !this.holdon) {
			if (talking) {
				this.dialog.code.next();
				this.holdon = true;
				scene.timeout(500, () => this.holdon = false);
			} else if (!walking) {
				// ...
			}
		}
	}

}

