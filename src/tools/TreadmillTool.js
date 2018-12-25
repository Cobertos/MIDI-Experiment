import * as THREE from "three";
import { mod } from "../utils";

export class TreadmillTool extends THREE.Group {
    constructor(bounds) {
        super();
        this.bounds = bounds || new THREE.Box3(
            new THREE.Vector3(0,0,0),
            new THREE.Vector3(1,1,1));
    }

    update() {
        this.children.forEach((o)=>{
            if(this.bounds.containsPoint(o.getWorldPosition(new THREE.Vector3()))) {
                return; //continue
            }

            //Wrap each component into the bounds
            let size = this.bounds.getSize(new THREE.Vector3());
            const wrapComponent = (which)=>{
                return mod((o.getWorldPosition(new THREE.Vector3())[which] - this.bounds.min[which]) //Substract min (get it in a 0 -> +Which range)
                    , size[which]) //Do the modulo wrapping
                    + this.bounds.min[which]; //Readd the min
            }
            //console.log(wrapComponent("x"), wrapComponent("y"), wrapComponent("z"));
            o.position.setX(wrapComponent("x") - this.position.x);
            o.position.setY(wrapComponent("y") - this.position.y);
            o.position.setZ(wrapComponent("z") - this.position.z);
        });
    }

}