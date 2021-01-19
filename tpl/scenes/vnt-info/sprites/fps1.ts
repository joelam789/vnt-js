
export class SceneInfoSpriteFps1 {
    onSceneActivate(sprite) {
        let bgcolor = sprite.scene.get("display").bgcolor;
        if (bgcolor == "#ffffff") sprite.get("display").object.style.fill = "#000000";
        else sprite.get("display").object.style.fill = "#ffffff";
    }
}
