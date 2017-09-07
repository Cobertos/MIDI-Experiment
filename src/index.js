
import * as THREE from "three";
import Promise from "bluebird";

import { BallsVisual } from "./visuals/BallsVisual";
import { NullVisual } from "./visuals/NullVisual";

window.midium = {
	BallsVisual,
	NullVisual
}

const renderer = new THREE.WebGLRenderer();
let visual = new NullVisual();

document.addEventListener("DOMContentLoaded", function(event) {
	console.log("DOM fully loaded and parsed");
	init();
	requestAnimationFrame(renderLoop);
});


function init() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	window.document.body.appendChild(renderer.domElement);

	setVisual(new BallsVisual());
}

function setVisual(newVisual) {
	let toTeardown = visual;
	visual = { render : function(){} };
	toTeardown.teardown(renderer, JZZ).then(()=>{
		newVisual.init(renderer, JZZ);
		return newVisual;
	}).then((newVisual)=>{
		visual = newVisual;
	});
}

function renderLoop() {
	requestAnimationFrame(renderLoop);
	visual.render(renderer);
}

JZZ().openMidiIn().or('MIDI-In:  Cannot open!')
	 .and(function(){ console.log('MIDI-In: ', this.name()); })
	 .connect(function(msg){console.log(msg.toString());
		if(msg[1]){
			targetVal1 = msg[1]/127;
		}
		if(msg[2]){
			targetVal = msg[2]/127;
		}
	 });

