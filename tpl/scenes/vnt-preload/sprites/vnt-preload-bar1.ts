
export class PreloadBar1 {
	
	nextPlotName = "";
	nextSceneName = "";
	preloadScenes = [];
	preloadPackFiles = [];

	times = 0;
	moveon = false;
	progress = 0;
	message = "Loading";
	
	onActivate(sprite) {
		
		this.times = 0;
		this.moveon = false;
		this.progress = 0;
		this.message = "Loading";
		
		let scene = sprite.scene;
		let bgspr = scene.spr("vnt-preload-bg1");
		let numspr = scene.spr("vnt-preload-num1");
		let barspr = scene.spr("vnt-preload-bar1");
		barspr.get("display").object.scale.x = 5;
		barspr.get("display").object.x = bgspr.get("display").object.x - 220 + 10;
		let preload = scene.game.lib("preload");
		scene.game.loadScenes(this.preloadScenes, () => {
			console.log("finished loading scenes");
			this.progress = 100;
			this.message = "Done";
			if (this.nextPlotName) {
				scene.timeout(50, () => scene.spr(this.nextPlotName).active = true);
			}
		}, (percentage) => {
			let progress = percentage / 100.0;
			barspr.get("display").object.scale.x = 420 * progress;
			numspr.get("display").object.text = percentage + "%";
			this.message = "Loading scenes";
			this.progress = Math.round(progress * 100);
		});
		
		this.moveon = true;
	}


}
