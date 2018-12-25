import * as THREE from "three";
import "./OBJLoader2Interop.js";
import { PromiseProxy } from "../../utils.js";

let _scene;
async function loadScene(){
    if(_scene) {
        return _scene
            .then((o)=>o.clone());
    }
    _scene = new PromiseProxy();

    const url = "visuals/IndustrialVisual/assets";
    let loader = new THREE.OBJLoader2();
    let mtlCreator = await loader.loadMtlAsync(url);
    loader.setMaterials(mtlCreator);
    let obj = await loader.loadObjAsync(url);
    obj = obj.detail.loaderRootNode;
    _scene.resolve(obj);
    return obj;
}

export class IndustrialSceneFlavor extends THREE.Group {
    constructor(){
        super();
        this._movinObject = undefined;
        this._asyncConstructor();
    }

    async _asyncConstructor(){
        //Replaces an obj in the heirarchy with another obj
        //Passing to as null will remove from
        const replaceObj = (from, to)=>{
          if(to === null) {
            from.parent.remove(from);
            return;
          }
          from.children.slice().forEach((child)=>{
            to.add(child);
          });
          if(from.parent) {
            from.parent.add(to);
            from.parent.remove(from);
          }
        };

        let obj = await loadScene();
        this.add(obj);
        obj.children.forEach((testObj)=>{
            testObj.geometry.computeBoundingBox();
            if(testObj.name.slice(0,7) === "FIXTURE") {
                let g = new THREE.BoxBufferGeometry(1,1,1);
                let m = new THREE.MeshBasicMaterial({
                    color: 0xFF00FF
                });
                let newObj = new THREE.Mesh(g,m);
                testObj.geometry.boundingBox.getCenter(newObj.position);
                this._movinObject = newObj;
                replaceObj(testObj, newObj);
            }
            else {
                testObj.geometry.boundingBox.getCenter(testObj.position);
                let t = testObj.position.clone().negate();
                testObj.geometry.translate(t.x, t.y, t.z);
            }
        });
    }

    update(){
        if(this._movinObject) {
            this._movinObject.position.y += Math.random()/4-(0.125);
        }
        this.children[0].children.forEach((o)=>{
            if(!o.geometry.boundingBox) {
                o.geometry.computeBoundingBox();
            }
            let p = o.getWorldPosition(new THREE.Vector3())
                .add(o.geometry.boundingBox.getCenter(new THREE.Vector3()));
            //console.log(p.x);
            /*if(p.x > -0.5 &&
                p.x < 0.5) {
                o.material.color = new THREE.Color(0,1,0);
            }
            else {
                o.material.color = new THREE.Color(0,0,1);
            }*/
            o.material.needsUpdate = true;
        });
    }
}