
export class Game1 {
	onInit(game) {
		console.log("loaded game: " + game.name);
		console.log("screen size: " + game.width + "x" + game.height);
	}
	sortObjects(obj) {
		obj.zOrder = obj.y;
	}
}
