import * as THREE from "three";
window.THREE = THREE;

import { WorldVisual } from "./visuals/WorldVisual/WorldVisual";

const renderer = new THREE.WebGLRenderer();
const visual = window._debug_visual = new WorldVisual();

const refreshRendererSize = ()=>{
	renderer.setSize(window.innerWidth, window.innerHeight);
	window.document.body.appendChild(renderer.domElement);
};

document.addEventListener("DOMContentLoaded", function(event) {
	refreshRendererSize();
	window.addEventListener("resize", refreshRendererSize);

	console.log("=== VISUAL INIT ===")
	visual.init(renderer);
	console.log("=== VISUAL RENDER ===");
	const loop = ()=>{
		requestAnimationFrame(loop);
		visual.render(renderer);
	};
	requestAnimationFrame(loop);
});

