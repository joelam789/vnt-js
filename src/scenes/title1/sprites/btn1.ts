export class ImageButtonScript {
    onPointerup(sprite) {
        sprite.scene.timeout(50, () => sprite.scene.spr("start-new-game").active = true);
    }
}