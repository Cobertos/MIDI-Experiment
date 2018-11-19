import * as THREE from "three";

import { CubeHighlightMoverVisual } from "./visuals/CubeHighlightMoverVisual";

const renderer = new THREE.WebGLRenderer();
const visual = new CubeHighlightMoverVisual();

const refreshRendererSize = ()=>{
	renderer.setSize(window.innerWidth, window.innerHeight);
	window.document.body.appendChild(renderer.domElement);
};

document.addEventListener("DOMContentLoaded", function(event) {
	refreshRendererSize();
	window.addEventListener("resize", refreshRendererSize);

	console.log("=== VISUAL INIT ===")
	visual.init(renderer, JZZ);
	console.log("=== VISUAL RENDER ===");
	const loop = ()=>{
		requestAnimationFrame(loop);
		visual.render(renderer);
	};
	requestAnimationFrame(loop);
});

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

