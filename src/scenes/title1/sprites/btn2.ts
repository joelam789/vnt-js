export class ButtonScript {
    onPointerup(sprite) {
        sprite.scene.timeout(50, () => sprite.scene.spr("load-old-ones").active = true);
    }
}