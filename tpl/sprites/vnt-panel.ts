
export class SpritePanel {

    prepareTexture(sprite) {
        let texId = sprite.scene.name + "." + (sprite.origin ? sprite.origin.name : sprite.name);
        let texObj = sprite.game.lib("image").getTexture(texId);
        if (texObj) return texObj;

        let mainColor = "rgba(127, 127, 127, 0.3)";
        let subColor = "rgba(127, 127, 127, 0)";

        let borderWidth = 30;
        let bodyWidth = 4;
        let totalWidth = borderWidth * 2 + bodyWidth;

        let canv = document.createElement('canvas');
        canv.width = totalWidth;
        canv.height = totalWidth;
        let ctx = canv.getContext("2d");
        ctx.clearRect(0, 0, totalWidth, totalWidth);

        let canv2 = document.createElement('canvas');
        canv2.width = borderWidth * 2;
        canv2.height = borderWidth * 2;
        let ctx2 = canv2.getContext("2d");
        ctx2.clearRect(0, 0, borderWidth * 2, borderWidth * 2);

        let grd2 = ctx2.createRadialGradient(borderWidth, borderWidth, borderWidth / 2,
        borderWidth, borderWidth, borderWidth);
        grd2.addColorStop(0, mainColor);
        grd2.addColorStop(1, subColor);

        // Fill with gradient
        ctx2.fillStyle = grd2;
        ctx2.fillRect(0, 0, borderWidth * 2, borderWidth * 2);

        ctx.drawImage(canv2, 0, 0, borderWidth, borderWidth, 0, 0, borderWidth, borderWidth);
        ctx.drawImage(canv2, borderWidth, 0, borderWidth, borderWidth,
        borderWidth + bodyWidth, 0, borderWidth, borderWidth);
        ctx.drawImage(canv2, 0, borderWidth, borderWidth, borderWidth,
        0, borderWidth + bodyWidth, borderWidth, borderWidth);
        ctx.drawImage(canv2, borderWidth, borderWidth, borderWidth, borderWidth,
        borderWidth + bodyWidth, borderWidth + bodyWidth, borderWidth, borderWidth);

        let grdTop = ctx.createLinearGradient(0, borderWidth / 2, 0, 0);
        grdTop.addColorStop(0, mainColor);
        grdTop.addColorStop(1, subColor);
        ctx.fillStyle = grdTop;
        ctx.fillRect(borderWidth, 0, bodyWidth, borderWidth / 2);

        let grdBottom = ctx.createLinearGradient(0, 0, 0, borderWidth / 2);
        grdBottom.addColorStop(0, mainColor);
        grdBottom.addColorStop(1, subColor);
        ctx.fillStyle = grdBottom;
        ctx.save();
        ctx.translate(0, borderWidth + bodyWidth + borderWidth / 2);
        ctx.fillRect(borderWidth, 0, bodyWidth, borderWidth / 2);
        ctx.restore();

        let grdLeft = ctx.createLinearGradient(borderWidth / 2, 0, 0, 0);
        grdLeft.addColorStop(0, mainColor);
        grdLeft.addColorStop(1, subColor);
        ctx.fillStyle = grdLeft;
        ctx.fillRect(0, borderWidth, borderWidth / 2, bodyWidth);

        let grdRight = ctx.createLinearGradient(0, 0, borderWidth / 2, 0);
        grdRight.addColorStop(0, mainColor);
        grdRight.addColorStop(1, subColor);
        ctx.fillStyle = grdRight;
        ctx.save();
        ctx.translate(borderWidth + bodyWidth + borderWidth / 2, 0);
        ctx.fillRect(0, borderWidth, borderWidth / 2, bodyWidth);
        ctx.restore();

        ctx.fillStyle = mainColor;
        ctx.fillRect(borderWidth, borderWidth / 2, bodyWidth, borderWidth / 2);
        ctx.fillRect(borderWidth, borderWidth + bodyWidth, bodyWidth, borderWidth / 2);
        ctx.fillRect(borderWidth / 2, borderWidth, borderWidth / 2, bodyWidth);
        ctx.fillRect(borderWidth + bodyWidth, borderWidth, borderWidth / 2, bodyWidth);
        ctx.fillRect(borderWidth, borderWidth, bodyWidth, bodyWidth);
		
        texObj = PIXI.Texture.from(canv);

        sprite.game.lib("image").setTexture(texId, texObj);
        return texObj;
    }

    onPointerdown(sprite, event) {
        console.log("[base] sprite onPointerdown: " + sprite.name);
    }
}
