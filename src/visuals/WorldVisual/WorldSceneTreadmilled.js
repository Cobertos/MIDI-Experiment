import * as THREE from "three";
import { loadScene } from "../../THREE.utils.js";

export class WorldSceneTreadmilled extends THREE.Group {
    constructor(scene){
        super();
        this.add(scene);
    }

    static async load(){
        let scene = await loadScene("visuals/WorldVisual/world");
        let t = new WorldSceneTreadmilled(scene);
        t.loadIds = scene.loadIds;
        t.loadGroups = scene.loadGroups;
        return t;
    }
}