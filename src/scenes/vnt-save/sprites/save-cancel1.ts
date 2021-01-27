export class SceneSaveSpriteButtonCancel1 {

    onPointerup(spr, event) {
        console.log("onClick - " + spr.name);
        spr.scene.sys("vnt").showSaveBox(false);
	}

}
