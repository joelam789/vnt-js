
export class SpriteBox {

    prepareTexture(sprite) {
        let texId = sprite.scene.name + "." + (sprite.origin ? sprite.origin.name : sprite.name);
        let texObj = sprite.game.lib("image").getTexture(texId);
        if (texObj) return texObj;

        let pixi = sprite.game.get("display").pixi;
		let rect = new PIXI.Graphics();
        rect.lineStyle(4, 0xffffff, 0.8);
        rect.beginFill(0x0, 0.8);
        rect.drawRect(0, 0, 10, 10);
        rect.endFill();
        texObj = pixi.renderer.generateTexture(rect, PIXI.SCALE_MODES.NEAREST, 1);

		sprite.game.lib("image").setTexture(texId, texObj);
        return texObj;
    }

}
