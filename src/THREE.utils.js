import * as THREE from "three";
import "three-examples/loaders/LoaderSupport.js"; //Loads to THREE.LoaderSupport
import "three-examples/loaders/OBJLoader2.js"; //Loads to THREE.OBJLoader2
import "three-examples/loaders/MTLLoader.js"; //Loads to THREE.MTLLoader

/**Loads a .mtl asynchronously
 * @param {string} uri The path or the url to load from (node or browser respectively)
 * without the .mtl
 * @param {function} onProgress The function to call on progress
 * @returns {array} The mtlCreator to use for the obj
 */
THREE.OBJLoader2.prototype.loadMtlAsync = async function(uri, onProgress){
    return new Promise((resolve, reject)=>{
        this.loadMtl(uri, undefined, resolve, onProgress, reject);
    });
};

/**Loads a .obj asynchronously
 * @param {string} uri The path or the url to load from (node or browser respectively)
 * without the .obj
 * @param {function} onProgress The function to call on progress
 * @returns {THREE.OBJLoader2Return} The return from OBJLoader2, get the .obj from
 * `.detail.loaderRootNode`
 */
THREE.OBJLoader2.prototype.loadObjAsync = async function(uri, onProgress){
    return new Promise((resolve, reject)=>{
        this.load(uri, resolve, onProgress, reject, null, true );
    });
};

/**Loads a "scene". Also post-processes a bunch of shit for you. There's a .loadIds key
 * that will immediately have access to every name on the object and a .loadGroups key
 * that will have all the groups
 * @param {string} uriWithoutExt The uri without the extensions
 */
export async function loadScene(uriWithoutExt){
    let loader = new THREE.OBJLoader2();
    console.log(`Loading "${uriWithoutExt}.mtl"...`);
    let mtlCreator = await loader.loadMtlAsync(`${uriWithoutExt}.mtl`);
    console.log(`Loaded`);
    loader.setMaterials(mtlCreator);
    console.log(`Loading "${uriWithoutExt}.obj"...`);
    let obj = await loader.loadObjAsync(`${uriWithoutExt}.obj`);
    console.log(`Loaded`);
    obj = obj.detail.loaderRootNode;
    obj.loadIds = {};
    obj.loadGroups = {};

    obj.traverse((o)=>{
        if(typeof o !== "object") {
            return;
        }
        if(o.name) {
            let [name, group] = o.name.split("_");
            group = group ? group.split(".")[0] : name.split(".")[0];
            if(obj.loadIds[name]) {
                console.warn(`Duplicate named object ${o.name}`);
            }
            obj.loadIds[name] = o;
            obj.loadGroups[group] = obj.loadGroups[group] || [];
            obj.loadGroups[group].push(o);
        }
        //Translate the object into the proper position
        //because all the geometry loads in weird places
        if(o.geometry) {
            o.geometry.computeBoundingBox();
            let bb = o.geometry.boundingBox;
            let size = new THREE.Vector3();
            let center = new THREE.Vector3();
            bb.getSize(size);
            bb.getCenter(center)
            o.position.add(center);
            let n = center.negate();
            o.geometry.translate(n.x, n.y, n.z);
        }
    });

    return obj;
}