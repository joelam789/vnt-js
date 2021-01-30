
export class VisualNovelTemplate implements OGE2D.Updater {

	name: string = "vnt";
	
	vnt: any = null;
	vars: any = null;
	scene: OGE2D.Scene = null;
	dialog: OGE2D.Sprite = null;
	savebox: OGE2D.Sprite = null;
	//loadbox: OGE2D.Sprite = null;
	saveitem: OGE2D.Sprite = null;
	loadsave: boolean = false;
	profile: any = null;
	gamepad: any = null;
	keyboard: any = null;
	holdon: boolean = false;

	init(game: OGE2D.Game): boolean {
		//this.clearSavedRecords();
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
		this.vars = scene.components["vars"];
		this.vnt = scene.components["vnt"];
		if (this.vnt) {
			if (this.vnt.dialog) this.dialog = scene.sprites[this.vnt.dialog];
			if (this.vnt.savebox) this.savebox = scene.sprites[this.vnt.savebox];
			//if (this.vnt.loadbox) this.loadbox = scene.sprites[this.vnt.loadbox];
			if (!this.vnt.times) this.vnt.times = 1;
			else this.vnt.times += 1;
		}
	}

	update(scene: OGE2D.Scene, time: number) {
		this.handleKeyboard(scene);
	}

	onSceneMapClick(scene, event) {
        //let pos = event.data.getLocalPosition(scene.components["display"].object);
        //console.log("scene onPointerdown: " + scene.name + " - x=" + pos.x + " , y=" + pos.y);
        if (this.dialog && this.dialog.active) {
			this.dialog.code.next();
		}
	}

	openPlot(plotName) {
		this.scene.timeout(50, () => this.scene.spr(plotName).active = true);
	}

	getDataNamePrefix() {
		return "vnt-" + this.scene.game.name + "-";
	}

	createTempPreviewCanvas(): HTMLCanvasElement {
		let gamew = this.scene.game.get("display").width;
        let gameh = this.scene.game.get("display").height;
		let canv = document.createElement("canvas");
        canv.id = "temp-canvas";
        canv.style.position = "absolute";
        canv.style.left = "250px";
        canv.style.top = "140px";
		canv.style.zIndex = "10";
		return canv;
	}

	screenshot() {

        let spr = this.savebox;

        let oldOne = document.getElementById("temp-canvas");
        if (oldOne) document.getElementById("game").removeChild(oldOne);

        let pixi = spr.game.get("display").pixi;
        let gamew = spr.game.get("display").width;
		let gameh = spr.game.get("display").height;
		
        let fullscr = pixi.renderer.plugins.extract.canvas(pixi.stage);

		let canv = this.createTempPreviewCanvas();
        canv.width = gamew * 3 / 8;
		canv.height = gameh * 3 / 8;
        canv.getContext("2d")
            .drawImage(fullscr, (fullscr.width-gamew)/2, (fullscr.height-gameh)/2,
                        gamew, gameh, 0, 0, canv.width, canv.height);
		
		let imgData = canv.toDataURL("image/jpeg", 1.0);
		localStorage.setItem(this.getDataNamePrefix() + "current-screenshot", imgData);

    }

	snapshot() {
		let newOne = { 
			bg: this.vnt && this.vnt.bg ? this.vnt.bg : null,
			bgm: this.vnt && this.vnt.bgm ? this.vnt.bgm : null,
			vnt: JSON.parse(JSON.stringify(this.scene.components["vnt"])),
			gvnt: JSON.parse(JSON.stringify(this.scene.game.components["vnt"])),
			vars: JSON.parse(JSON.stringify(this.scene.components["vars"])),
			gvars: JSON.parse(JSON.stringify(this.scene.game.components["vars"])),
			plot: "",
			displays: []
		};
		for (let spr of this.scene.spriteList) {
			if (!spr.template) continue;
			if (spr.template == "vnt-plot") {
				if (spr.active) newOne.plot = spr.name;
				continue;
			} else if (spr.template == "vnt-bg" || spr.template == "vnt-img") {
				let pixiSpr = spr.get("display").object;
				//console.log(spr.name, spr.active);
				let display = {
					spr: spr.name,
					active: spr.active,
					x: pixiSpr.x,
					y: pixiSpr.y,
					angle: pixiSpr.angle,
					alpha: pixiSpr.alpha,
					zIndex: pixiSpr.zIndex,
					visible: pixiSpr.visible,
					scale: {
						x: pixiSpr.scale.x,
						y: pixiSpr.scale.y
					},
					anchor: {
						x: pixiSpr.anchor.x,
						y: pixiSpr.anchor.y
					}
				};
				newOne.displays.push(display);
				continue;
			}
			
		}
		this.scene.game.components["snapshot"] = newOne;
		return newOne;
	}

	getSnapshot() {
		return this.scene.game.components.snapshot;
	}

	restoreSnapshot(oldOne: any) {
		//console.log(oldOne);
		if (!this.scene || !oldOne) return;
		if (this.scene) this.scene.reset();
		if (oldOne.bgm) this.playBgm(oldOne.bgm);
		else this.stopBgm();
		if (!oldOne.displays || oldOne.displays.length <= 0) return;
		for (let display of oldOne.displays) {
			let spr = this.scene.spr(display.spr);
			let pixiSpr = spr ? spr.get("display").object : null;
			if (pixiSpr) {
				pixiSpr.x = display.x;
				pixiSpr.y = display.y;
				pixiSpr.angle = display.angle;
				pixiSpr.alpha = display.alpha;
				pixiSpr.zIndex = display.zIndex;
				pixiSpr.visible = display.visible;
				pixiSpr.scale.x = display.scale.x;
				pixiSpr.scale.y = display.scale.y;
				pixiSpr.anchor.x = display.anchor.x;
				pixiSpr.anchor.y = display.anchor.y;
			}
			if (spr) spr.active = display.active;
			
		}
		let activeBg = null;
		let activePlot = null;
		for (let spr of this.scene.spriteList) {
			if (oldOne.plot) {
				if (spr.template && spr.template == "vnt-plot") {
					spr.active = false;
					if (spr.name == oldOne.plot) activePlot = spr;
				}
			}
			if (oldOne.bg) {
				if (spr.template && spr.template == "vnt-bg") {
					spr.active = false;
					if (spr.name == oldOne.bg) activeBg = spr;
				}
			}
		}
		if (oldOne.vnt) {
			this.scene.components["vnt"] = oldOne.vnt;
			this.vnt = oldOne.vnt;
		}
		if (oldOne.gvnt) {
			this.scene.game.components["vnt"] = oldOne.gvnt;
		}
		if (oldOne.vars) {
			this.scene.components["vars"] = oldOne.vars;
			this.vars = oldOne.vars;
		}
		if (oldOne.gvars) {
			this.scene.game.components["vars"] = oldOne.gvars;
		}
		if (activeBg) {
			activeBg.active = true;
			activeBg.get("display").object.alpha = 1.0;
			activeBg.get("display").object.visible = true;
			this.setBackgroundImageName(activeBg.name);
		} else {
			this.setBackgroundImageName("");
		}
		if (activePlot) {
			this.scene.timeout(100, () => activePlot.active = true);
		}
	}

	getDialog() {
		return this.dialog;
	}

	getActivePlotName() {
		for (let spr of this.scene.spriteList) {
			if (!spr.template) continue;
			if (spr.template == "vnt-plot") {
				if (spr.active) return spr.name;
			}
		}
		return null;
	}

	clearSavedRecords() {
		let total = 4;
		for (let i=1; i<=total; i++) {
			let prefix = this.getDataNamePrefix() + "save-item" + i;
			localStorage.setItem(prefix + "-screenshot", "");
			localStorage.setItem(prefix + "-datetime", "");
			localStorage.setItem(prefix + "-plot", "");
		}
	}

	showSaveLoad(wantToSave: boolean = true, visible: boolean = true) {
		let total = 4;
		if (this.scene && this.savebox && visible) {
			this.loadsave = !wantToSave;
			if (wantToSave) this.screenshot();
			for (let i=1; i<=total; i++) {
				let savedt = localStorage.getItem(this.getDataNamePrefix() 
													+ "save-item" + i + "-datetime");
				if (!savedt) savedt = "(Empty)";
				let text1 = this.scene.spr("save-item" + i + "-text1");
				if (text1) text1.get("display").object.style.fontWeight = "normal";
				let text2 = this.scene.spr("save-item" + i + "-text2");
				if (text2) {
					text2.get("display").object.style.fontWeight = "normal";
					text2.get("display").object.text = savedt;
				}
			}
			let title = this.scene.spr("save-title1");
			if (title) title.get("display").object.text = this.loadsave ? "Load Game" : "Save Game";
		}
		this.saveitem = null;
		if (this.savebox) this.savebox.active = visible;
		let oldOne = document.getElementById("temp-canvas");
		if (oldOne) document.getElementById("game").removeChild(oldOne);
	}

	showSaveBox(visible: boolean = true) {
		this.showSaveLoad(true, visible);
	}
	showLoadBox(visible: boolean = true) {
		//if (this.loadbox) this.loadbox.active = visible;
		this.showSaveLoad(false, visible);
	}

	selectSaveItem(item) {
		if (!item) return;
		let total = 4;
		for (let i=1; i<=total; i++) {
			let text1 = item.scene.spr("save-item" + i + "-text1");
			let text2 = item.scene.spr("save-item" + i + "-text2");
			if (text1) text1.get("display").object.style.fontWeight = "normal";
			if (text2) text2.get("display").object.style.fontWeight = "normal";
		}
		item.scene.spr(item.name + "-text1").get("display").object.style.fontWeight = "bold";
		item.scene.spr(item.name + "-text2").get("display").object.style.fontWeight = "bold";
		this.saveitem = item;

		let saveimg = localStorage.getItem(this.getDataNamePrefix() + item.name + "-screenshot");
		if (saveimg) {
			//console.log("vnt-" + item.name + "-screenshot", saveimg);
			let needNewCanvas = false;
			let gamew = item.game.get("display").width;
        	let gameh = item.game.get("display").height;
			let canv = document.getElementById("temp-canvas") as HTMLCanvasElement;
        	if (!canv) {
				needNewCanvas = true;
				canv = this.createTempPreviewCanvas();
			}
			let img = new Image();
			img.onload = () => {
				let pvcanv = document.getElementById("temp-canvas") as HTMLCanvasElement;
				if (pvcanv) {
					pvcanv.width = img.width;
					pvcanv.height = img.height;
					pvcanv.getContext("2d").drawImage(img, 0, 0);
				}
			};
			img.src = saveimg;
			if (canv && needNewCanvas) document.getElementById("game").appendChild(canv);

		} else {
			console.log("Data not found: " + this.getDataNamePrefix() + item.name + "-screenshot");
			let oldOne = document.getElementById("temp-canvas");
			if (oldOne) document.getElementById("game").removeChild(oldOne);
		}
	}

	saveToItem() {
		let nowdt = new Date();
		let item = this.saveitem;
		if (item) {
			let prefix = this.getDataNamePrefix();
			let imgData = localStorage.getItem(prefix + "current-screenshot");
			localStorage.setItem(prefix + item.name + "-screenshot", imgData);
			localStorage.setItem(prefix + item.name + "-plot", JSON.stringify(this.getSnapshot()));
			localStorage.setItem(prefix + item.name + "-datetime", nowdt.toISOString());
			console.log("Saved game to " + item.name);
		}
	}

	loadFromItem() {
		let item = this.saveitem;
		let plotData = item ? localStorage.getItem(this.getDataNamePrefix() + item.name + "-plot") : null;
		let plotState = plotData ? JSON.parse(plotData) : null;
		if (plotState) {
			this.restoreSnapshot(plotState);
			console.log("Loaded game from " + item.name);
		} else {
			console.log("No game record loaded");
		}
	}

	runSaveLoad() {
		if (this.loadsave) this.loadFromItem();
		else this.saveToItem();
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
			if (this.isAnswering() && false) {
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

