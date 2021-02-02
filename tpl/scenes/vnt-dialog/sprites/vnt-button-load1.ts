export class SceneDialogSpriteButtonLoad1 {

    onPointerup(spr, event) {
        //console.log("onClick - " + spr.name);
        spr.scene.sys("vnt").showLoadBox();
	}

}
