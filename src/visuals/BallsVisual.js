import * as THREE from "three";
import Promise from "bluebird";
import $ from "jquery";

import { Visual } from "./Visual";
import { ManagedData } from "../ManagedData";

var camera, scene, renderer, geometry, material, mesh=[], i=0, j=0, k=0, targetVal, currentVal=1, targetVal1, currentVal1=1;


/*class BPMTool {
	constructor() {
		this._max = 0;
		this._bpm = undefined;
	}

	audioFrame(data) {
		const samples = 50;
		const stepSize = Math.ceil(data.length/samples);
		for(var i=0;i<data.length;i++) {
			this._max = Math.max(data[i*stepSize], this._max);


		}
	}
}*/

function normalRandom() {
	var n=(Math.random()+Math.random()+Math.random()+Math.random()+Math.random())-2.5;
	return n;
}

function randomRange(a,b) {
	return Math.random()*(b-a)+a;
}

let g = new THREE.SphereBufferGeometry(25,2,2);
export class Ball extends THREE.Mesh {
	constructor(dir) {
		super(
			g,
			new THREE.MeshBasicMaterial({
				color: new THREE.Color(Math.random(),1,1)
			}));
		this.dir = dir.clone();
		this.balls = undefined;
	}

	birth(amnt) {
		if(!this.balls && amnt) {
			var a = [];
			for(var i=0;i<amnt;i++){
				a.push("");
			}
			this.balls = a.map(()=>{
				let dir = new THREE.Vector3(
					randomRange(-1,1),
					randomRange(-1,1),
					randomRange(-1,1))
						.normalize();
				let b = new Ball(dir);
				this.parent.add(b);
				b.position.copy(this.position);
				return b;
			});
		}
		else if(this.balls) {
			this.balls.forEach((b)=>b.birth(amnt));
		}
	}

	step(amnt) {
		this.position.add(
			this.dir.clone().multiplyScalar(amnt));
		if(this.balls){
		this.balls.forEach((b)=>b.step(amnt));
		}
	}

	forEach(func) {
		func(this);
		if(this.balls){
		this.balls.forEach((b)=>b.forEach(func));
	}
	}

	del() {

	}
}

export class BallsVisual extends Visual {

	init() {
		var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		var analyzer = this.analyzer = audioCtx.createAnalyser();

		var stream = navigator.mediaDevices.getUserMedia({
			audio: true
		})
		.then((stream)=>{
		/* use the stream */
		var source = audioCtx.createMediaStreamSource(stream);
		source.connect(analyzer);
		analyzer.connect(audioCtx.destination);
		analyzer.fftSize = 2048;
		var bufferLength = analyzer.frequencyBinCount;
		var dataArray = this.dataArray = new Uint8Array(bufferLength);
		})
		.catch((err)=>{
		console.error("AAAAAAAA", err)
		});

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.z = 500;
		scene.add(camera);

		this.ball = new Ball(new THREE.Vector3(0,0.1,0));
		scene.add(this.ball);

		//GUI
		this.data = new ManagedData({
			ballSize : { //MidiChannelOption
				channel : 0
			}
		});

		this.gui = this.data.gui();
		$("body").append(this.gui.domElement);
		$(this.gui.domElement).css("z-index", 20);
	}

	teardown() {

	}

	render(renderer) {
		if(this.analyzer && this.dataArray) {
			this.analyzer.getByteTimeDomainData(this.dataArray);
		}

		let isKick = this.dataArray[0] > 170;
		if(isKick) {
			let a = Math.floor(randomRange(1,3)-0.7);
			this.ball.birth(a);
		}

		this.ball.step(2);
		var s = this.dataArray[7]/256;
		this.ball.forEach((b)=>{
			var s2 = s-Math.random()/8;
			b.scale.set(s2,s2,s2);
		});

		renderer.render(scene, camera);
	}
}