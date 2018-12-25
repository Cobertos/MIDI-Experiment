import * as THREE from "three";
import Stats from "stats.js";

import { Visual } from "../Visual";
import { TapTool } from "../../tools/TapTool";
import { FFTVisualTool } from "../../tools/FFTVisualTool";
import { MicTool } from "../../tools/MicTool";
import { SequencerTool } from "../../tools/SequencerTool";
import { SequencerVisualTool } from "../../tools/SequencerVisualTool";
import { TreadmillTool } from "../../tools/TreadmillTool";
import { IndustrialSceneFlavor } from "./IndustrialSceneFlavor";

export class IndustrialVisual extends Visual {

  init(renderer) {
    window.document.body.style.backgroundColor = "#000000";
    window.document.body.style.overflow = "hidden";

    this._tapTool = new TapTool(100, "k");
    this._micTool = new MicTool(2048);
    this._visTool = new FFTVisualTool(this._micTool.bins);
    this._stats = new Stats();
    this._visBox = document.createElement("div");
    this._visBox.style.position = "absolute";
    this._visBox.style.bottom = 0;
    this._visBox.style.left = 0;
    this._visBox.appendChild(this._visTool.dom);
    window.document.body.appendChild(this._visBox);
    window.document.body.appendChild(this._stats.dom);

    const cam = this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    cam.position.z = 5;
    cam.position.y = 2;
    cam.quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/8);
    const hemiLight = new THREE.HemisphereLight( 0xeeeeff, 0x080820, 1 );
    this.add( hemiLight );
    const pointLight = new THREE.PointLight( 0xeeeeff, 1 );
    pointLight.position.set(1,2,3);
    this.add( pointLight );

    let box3 = new THREE.Box3(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0));
    this._treadmill = new TreadmillTool(new THREE.Box3(
      new THREE.Vector3(-12,-12,-12),
      new THREE.Vector3(24,24,24)));
    let mss = Array.apply(null, { length: 3 }).map((_,idx)=>{
      let obj = new IndustrialSceneFlavor();
      obj.position.set(12*idx,0,0);
      obj.quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0), 3*Math.PI/2);
      box3.expandByObject(obj);
      return obj;
    });
    this._treadmill.add(...mss);
    this.add(this._treadmill);

    renderer.setClearColor(new THREE.Color(0.3,0.3,0.3,1.0));
    this._lastTime = Date.now();
  }

  render(renderer) {
    if(!this._micTool.isConstructed) {
      return; //Not done setting up
    }
    this._stats.begin();
    const time = Date.now();
    const delta = time - this._lastTime;

    const msp4b = 4 * this._tapTool.mspb; //ms in 4 beats
    const sp4b = msp4b / 1000; //s in 4 beatsty
    const treadmillSpeed = 12 / sp4b / 1000;//12 units per 4 beats in ms

    this._treadmill.position.setX(this._treadmill.position.x-(treadmillSpeed*delta));
    this._treadmill.update();
    this._treadmill.children.forEach((m)=>m.update());
    
    this._visTool.update(this._micTool.data);
    this._lastTime = time;

    renderer.render(this, this.camera);
    this._stats.end();
  }
}