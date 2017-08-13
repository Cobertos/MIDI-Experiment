
var THREE = require("THREE");
var Promise = require("Bluebird");

var camera, scene, renderer, geometry, material, mesh;

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    init();
animate();
  });


function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 500;
    scene.add(camera);

    geometry = new THREE.CubeGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial();

    mesh = window.mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.document.body.appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate);
    render();

}

function render() {

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;


    var scale = window.mesh.scale.x;
    var newVal = scale + ((window.scaleTarget || 1)  - scale)/2;
    mesh.scale.setScalar(newVal);
    material.color = new THREE.Color(newVal, newVal, newVal);

    renderer.render(scene, camera);

}

JZZ().openMidiIn().or('MIDI-In:  Cannot open!')
     .and(function(){ console.log('MIDI-In: ', this.name()); })
     .connect(function(msg){console.log(msg.toString());
     	if(msg[2]){
     		window.scaleTarget = msg[2]/127;
     	}
     });