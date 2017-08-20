
var THREE = require("THREE");
var Promise = require("Bluebird");

import { BallsVisual } from "./BallsVisual";

const renderer = new THREE.WebGLRenderer();
let visual = new BallsVisual();
visual.init();

document.addEventListener("DOMContentLoaded", function(event) {
	console.log("DOM fully loaded and parsed");
	init();
	requestAnimationFrame(renderLoop);
});


function init() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	window.document.body.appendChild(renderer.domElement);
}

function setVisual(newVisual) {
	let toTeardown = visual;
	visual = { render : function(){} };
	toTeardown.teardown(renderer, JZZ).then(()=>{
		return newVisual.init(renderer, JZZ);
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

