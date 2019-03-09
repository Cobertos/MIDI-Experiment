import * as THREE from "three";
import Stats from "stats.js";

import { Visual } from "../Visual";
import { TapTool } from "../../tools/TapTool";
import { FFTVisualTool } from "../../tools/FFTVisualTool";
import { MicTool } from "../../tools/MicTool";
import { SequencerTool } from "../../tools/SequencerTool";
import { SequencerVisualTool } from "../../tools/SequencerVisualTool";
import { TreadmillTool } from "../../tools/TreadmillTool";
import { WorldSceneTreadmilled } from "./WorldSceneTreadmilled";

export class WorldVisual extends Visual {

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
    cam.position.y = 2;
    const hemiLight = new THREE.HemisphereLight( 0xeeeeff, 0x080820, 0.5 );
    this.add( hemiLight );
    const pointLight = new THREE.PointLight( 0xeeeeff, 0.5 );
    pointLight.position.set(1,2,3);
    this.add( pointLight );

    //Create the treadmill
    let box3 = new THREE.Box3(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0));
    this._treadmill = new TreadmillTool(new THREE.Box3(
      new THREE.Vector3(-30,-30,-100),
      new THREE.Vector3(30,30,0)));
    //Create the scene to be treadmilled
    this._scene = undefined;
    WorldSceneTreadmilled.load()
      .then((scene)=>{
        this._treadmill.add(...scene.children[0].children);
        //cam.position.copy(scene.loadIds.CAMERA);
        this._scene = scene;
      });
    this.add(this._treadmill);
    
    renderer.setClearColor(new THREE.Color(0.0,0.0,0.0,1.0));
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

    this._treadmill.position.setZ(this._treadmill.position.z-(treadmillSpeed*delta));
    this._treadmill.update();
    
    this._visTool.update(this._micTool.data);
    this._lastTime = time;

    let camOsc = Math.sin(this._tapTool.getFractionalBeat(8)*Math.PI*2);
    this.camera.position.x = camOsc*4;
    this.camera.quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/12*camOsc);

    let camOsc2 = Math.sin(this._tapTool.getFractionalBeat(4)*Math.PI*2);
    this.camera.position.y = camOsc2/2+1;

    if(this._scene) {
      this._scene.loadGroups.Rotator.forEach((b, idx, arr)=>{
        //let micIdx = Math.floor(this._micTool.data.length * idx/arr.length);
        //let mul = this._micTool.data[micIdx]/128;
        let sc = (Math.sin(Date.now()/1000*Math.PI*2/10+b.position.z/10)+1)/3+0.3;
        b.scale.set(sc,sc,1);
        b.material[0].color = new THREE.Color(sc,sc,sc);
        b.material[1].color = new THREE.Color(1,0,0);
      });
      this._scene.loadGroups.Icosphere.forEach((i)=>{
        i.material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        i.scale.set(0.2,0.2,1);
      });
    }

    renderer.render(this, this.camera);
    this._stats.end();
  }
}