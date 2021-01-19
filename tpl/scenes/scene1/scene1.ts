
export class Scene1 {

    sceneName: any = null;
    path: Array<any> = [];

    onInit(scene) {
        console.log("on scene init: " + scene.name);
    }

    onActivate(scene) {
        this.sceneName = scene.name;
        let vnt = scene.get("vnt");
        console.log("on scene activate: " + scene.name + " (" + vnt.times + ")");
    }

    
    onPointerdown(scene, event) {
        let pos = event.data.getLocalPosition(scene.components["display"].object);
        console.log("scene onPointerdown: " + scene.name + " - x=" + pos.x + " , y=" + pos.y);

        //let stage = scene.sys("stage");
        //stage.zoomTo(scene, 1.5, 1.5, pos.x, pos.y, 3000, () => {
        //    console.log("done");
        //    scene.timeout(2000, () => stage.zoom(scene, false));
        //});
        //if (scene.get("stage").shake) stage.shake(scene, false);
        //else stage.shake(scene, 8, -5, 5, 0, 0, 60, () => console.log("done"));

    }

}

