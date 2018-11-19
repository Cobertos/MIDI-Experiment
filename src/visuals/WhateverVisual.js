import * as THREE from "three";
import $ from "jquery";

import { Visual } from "./Visual";
//import { ManagedData } from "../ManagedData";

var camera, scene, renderer, geometry, material, mesh=[], i=0, j=0, k=0, targetVal, currentVal=1, targetVal1, currentVal1=1;


function normalRandom() {
	var n=(Math.random()+Math.random()+Math.random()+Math.random()+Math.random())-2.5;
	return n;
}

function box(num){
	return Math.max(Math.min(num, 200), -200);
}

function makeSphere(scale) {
	geometry = new THREE.SphereGeometry(100,2,2);
	material = new THREE.MeshNormalMaterial();

	let m = new THREE.Mesh(geometry, material);
	m.scale.setScalar(scale);
	m.baseScale = m.scale.clone();
	m.baseSpeed = scale;
	return m;
};

export class BallsVisual extends Visual {

	init() {
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.z = 500;
		scene.add(camera);

		for(var ii=0; ii<45; ii++) {
			let m = makeSphere(Math.random());
			scene.add(m);
			mesh.push(m);
		}

		//GUI
		/*this.data = new ManagedData({
			ballSize : { //MidiChannelOption
				channel : 0
			}
		});

		this.gui = this.data.gui();
		$("body").append(this.gui.domElement);
		$(this.gui.domElement).css("z-index", 20);*/
	}

	teardown() {

	}

	render(renderer) {
		currentVal = currentVal + ((targetVal || 1)  - currentVal)/2;
		currentVal1 = currentVal1 + ((targetVal1 || 1)  - currentVal1)/2;

		mesh.forEach(function(m){
			m.scale.x = (m.baseScale.x + currentVal1) % 1;
			m.scale.y = (m.baseScale.y + currentVal1) % 1;
			m.scale.z = (m.baseScale.z + currentVal1) % 1;
			i=normalRandom();
			j=normalRandom();
			k=normalRandom();
			m.rotation.x += Math.random()/1000+0.01;
			m.rotation.y += Math.random()/1000+0.02;
			m.rotation.z += Math.random()/1000+ 0.01;
			m.position.set(box(m.position.x+5*i*currentVal), box(m.position.y+5*j*currentVal), box(m.position.z+5*k*currentVal));
		});

		renderer.render(scene, camera);
	}
}