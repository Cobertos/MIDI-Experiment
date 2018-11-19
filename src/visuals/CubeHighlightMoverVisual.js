import * as THREE from "three";

import { Visual } from "./Visual";
import { TapTool } from "../tools/TapTool";
import { FFTVisualTool } from "../tools/FFTVisualTool";
import { MicTool } from "../tools/MicTool";

function normalRandom() {
	var n=(Math.random()+Math.random()+Math.random()+Math.random()+Math.random())-2.5;
	return n;
}

function randomRange(a,b) {
	return Math.random()*(b-a)+a;
}

const g2 = new THREE.BoxBufferGeometry(1,1,1);
export class CubeGridCube extends THREE.Mesh {
	constructor() {
		super(
			g2,
			new THREE.MeshStandardMaterial({
				color: new THREE.Color(Math.random(),0,1)
			}));
	}
}

export class CubeHighlightMoverVisual extends Visual {

	init() {
		window.document.body.style.backgroundColor = "#000000";
		window.document.body.style.overflow = "hidden";

		this._tapTool = new TapTool(111, "k");
		this._micTool = new MicTool(2048);
		this._visTool = new FFTVisualTool(this._micTool.bins);
		this._visTool.dom.style.position = "absolute";
		this._visTool.dom.style.left = 0;
		this._visTool.dom.style.bottom = 0;
		window.document.body.appendChild(this._visTool.dom);

		const scene = this.scene = new THREE.Scene();

		const camera = this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.z = 5;
		scene.add(camera);

		let l = this.l = new THREE.PointLight( 0xddddee, 1 );
		l.position.set(0,0,2);
		scene.add(l);

		//Make a grid of cubes
		this.cubes = Array.apply(null, {length: 20}).map((_, y, yA)=>{
			return Array.apply(null, {length: 20}).map((_2, x, xA)=>{
				let c = new CubeGridCube();
				c.position.set(1.5*x - (yA.length/2*1.5),1.5*y - (xA.length/2*1.5),0);
				c._position = c.position.clone();
				scene.add(c);
				return c;
			});
		});

		this._cubeLastIndexOffset = new THREE.Vector2(0,0);
		this._cubeTargetIndexOffset = new THREE.Vector2(10,10);
		this._targetCube = undefined;
		this._colorShiftColor = new THREE.Color();

		this.cubeOffset = this._tapTool.onceEvery(2,0, ()=>{
			//Copy the old one
			this._cubeLastIndexOffset.copy(this._cubeTargetIndexOffset);
			//Int -2 to 2 inclusive
			const genOffsetInt = ()=>{
				return Math.round(Math.random()*5)-3;
			};
			
			let v2 = new THREE.Vector2(genOffsetInt(),genOffsetInt());
			this._cubeTargetIndexOffset.add(v2);
			if(this._cubeTargetIndexOffset.x > 20 || this._cubeTargetIndexOffset.x < 0) {
				this._cubeTargetIndexOffset.x += v2.x *-2;
			}
			if(this._cubeTargetIndexOffset.y > 20 || this._cubeTargetIndexOffset.y < 0) {
				this._cubeTargetIndexOffset.y += v2.y *-2;
			}
			if(this._targetCube) {
				this._targetCube.material._color = new THREE.Color(0,0,0);
			}
			this._targetCube = this.getCubeFromIndex(this._cubeTargetIndexOffset);
		});
		this.cubeLock = this._tapTool.onceEvery(2,1,()=>{
			if(this._targetCube) {
				this._targetCube.material = new THREE.MeshBasicMaterial();
				this._targetCube.material._color = new THREE.Color(1,1,1);
				this._targetCube.material.needsUpdate = true;
			}
		});
		this.colorShift = this._tapTool.onceEvery(4,0,()=>{
			//Color Shift everything
			let which = Math.floor(Math.random()*3);
			if(which === 0) {
				this._colorShiftColor = new THREE.Color(Math.random(),0,1);
			}
			else if(which === 1) {
				this._colorShiftColor = new THREE.Color(0,Math.random(),1);
			}
			else {
				this._colorShiftColor = new THREE.Color(Math.random(),1,0);
			}
			this.cubes.forEach((xArr, y, yArr)=>{
				xArr.forEach((cube, x)=>{
					if(!cube.material._color) {
						
						if(which === 0) {
							cube.material.color = new THREE.Color(Math.random(),0,1);
						}
						else if(which === 1) {
							cube.material.color = new THREE.Color(0,Math.random(),1);
						}
						else {
							cube.material.color = new THREE.Color(Math.random(),1,0);
						}
					}
				});
			});
		});
	}

	getCubeFromIndex(offsetv2) {
		return this.cubes[offsetv2.y][offsetv2.x];
	}

	render(renderer) {
		if(!this._micTool.isConstructed) {
			return; //Not done setting up
		}
		const flashLenMS = 400;

		this._visTool.update(this._micTool.data);

		this.cubeLock();
		this.cubeOffset();
		this.colorShift();

		let fadeOffsetMS = 300;
		let tween = 1-Math.min(this._tapTool.getNextBeatTime(2) - Date.now(), fadeOffsetMS)/fadeOffsetMS;
		let lastOffset = this.getCubeFromIndex(this._cubeLastIndexOffset).position.clone();
		let targetOffset = this.getCubeFromIndex(this._cubeTargetIndexOffset).position.clone();
		let cubeOffset = lastOffset.clone()
			.add(targetOffset
				.sub(lastOffset)
				.multiplyScalar(tween*tween*tween));
		this.camera.position.setX(cubeOffset.x);
		this.camera.position.setY(cubeOffset.y);

		let d = 1 - Math.min((Date.now() - this._tapTool.getLastBeatTime()) / flashLenMS, 1);
		this.cubes.forEach((xArr, y, yArr)=>{
			xArr.forEach((cube, x)=>{
				if(cube === this._targetCube) {
					this.l.position.copy(this._targetCube.position);
					this.l.position.setZ(this.l.position.z+2);
				}
			});
		});

		renderer.setClearColor(this._colorShiftColor.clone().multiplyScalar(d));

		//var s = this.dataArray[7]/256;

		renderer.render(this.scene, this.camera);
	}
}