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
        this.loadMtl(uri + ".mtl", undefined, resolve, onProgress, reject);
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
        this.load(uri + ".obj", resolve, onProgress, reject, null, true );
    });
};