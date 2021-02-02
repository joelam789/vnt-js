export class SceneDialogSpriteButtonSave1 {

    onPointerup(spr, event) {
        //console.log("onClick - " + spr.name);
        spr.scene.sys("vnt").showSaveBox();
	}

}
