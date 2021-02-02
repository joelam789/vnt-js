export class SceneSaveSpriteSaveItem4 {

    onPointerup(spr, event) {
        //console.log("onClick - " + spr.name);
		spr.scene.sys("vnt").selectSaveItem(spr);
	}

}
