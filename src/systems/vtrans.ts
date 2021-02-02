
export class VntTransition implements OGE2D.Updater {

    name: string = "vtrans";

    private _game: OGE2D.Game = null;
    private _stage: any = null;
    private _dark: PIXI.Sprite = null;
    private _pixi: PIXI.Application = null;
    private _target: string = "";

    init(game: OGE2D.Game): boolean {
        this._game = game;
        this._pixi = game.components["display"].pixi;
        this._stage = game.components["display"].object;

        let rect = new PIXI.Graphics();
        rect.beginFill(0x0); // black
        rect.drawRect(0, 0, 1, 1);
        rect.endFill();
        let tex = this._pixi.renderer.generateTexture(rect, PIXI.SCALE_MODES.NEAREST, 1);
        this._dark = new PIXI.Sprite(tex);

        //this._dark.x = this._dark.y = 0;
        //this._dark.width = this._dark.height = 1;
        this._dark.scale.set(game.width, game.height);
        let layers = game.components["display"].layers;
        let keys = layers ? Object.keys(layers) : [];
        //if (keys.length > 0) this._dark.displayGroup = new PIXI.DisplayGroup(keys.length + 1, false);
        if (keys.length > 0) {
            this._dark.parentGroup = new PIXI.display.Group(keys.length + 1, false);
            this._stage.addChild(new PIXI.display.Layer(this._dark.parentGroup));
        }
        return true;
    }

    isWorking(): boolean {
        return this._target && this._target.length > 0;
    }

    getActivePlotName(scene: OGE2D.Scene) {
		for (let spr of scene.spriteList) {
			if (!spr.template) continue;
			if (spr.template == "vnt-plot") {
				if (spr.active) return spr.name;
			}
		}
		return null;
	}

    callScene(sceneName: string, onReady?: (nextScene: OGE2D.Scene)=>void, time?: number) {
        let duration = time ? time / 2 : 1000;
        if (this._target && this._target.length > 0) return;
        let tweenOut: any = this._game.scene.systems["tween"];
        if (tweenOut && sceneName && this._game.scene.name != sceneName) {
            this._target = sceneName;
            this._dark.alpha = 0.0;
            this._stage.addChild(this._dark);
            tweenOut.get(this._dark).to({alpha: 1.0}, duration).call(() => {
                let vnt: any = this._game.scene.systems["vnt"];
                if (vnt) vnt.stopBgm();
                if (this._target && this._target == sceneName) {
                    this._game.loadScene(sceneName, (scene) => {
                        if (scene) {
                            if (onReady) onReady(scene);
                            this._stage.removeChild(this._dark);
                            this._game.scene = scene;
                            this._game.scene.reset();
                            let tweenIn: any = this._game.scene.systems["tween"];
                            if (tweenIn) {
                                this._dark.alpha = 1.0;
                                this._stage.addChild(this._dark);
                                tweenIn.get(this._dark).to({alpha: 0.0}, duration).call(() => {
                                    this._stage.removeChild(this._dark);
                                    let plotSprName = this.getActivePlotName(this._game.scene);
                                    //console.log("active plot - " + plotSprName);
                                    if (plotSprName) this._game.scene.spr(plotSprName).plot.signal("fade-in");
                                    this._target = "";
                                });
                            } else this._target = "";
                        } else this._target = "";
                    });
                }
            });
        }
        
    }
	
}

