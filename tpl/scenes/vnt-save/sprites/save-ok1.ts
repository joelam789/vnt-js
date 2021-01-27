export class SceneSaveSpriteButtonOK1 {

    onPointerup(spr, event) {
        console.log("onClick - " + spr.name);
        spr.scene.sys("vnt").runSaveLoad();
        spr.scene.sys("vnt").showSaveBox(false);
	}

}
