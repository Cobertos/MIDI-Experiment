
var THREE = require("THREE");
var Promise = require("Bluebird");

var camera, scene, renderer, geometry, material, mesh=[], i, j, k, targetVal, currentVal=1, targetVal1, currentVal1=1;

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

    function makeSphere(scale) {
    	geometry = new THREE.SphereGeometry(100,2,2);
    material = new THREE.MeshNormalMaterial();

    m = new THREE.Mesh(geometry, material);
    scene.add(m);
    m.scale.setScalar(scale);
    m.baseScale = m.scale.clone();
    m.baseSpeed = scale;
    mesh.push(m);
    };
    for(var ii=0; ii<45; ii++) {
    	makeSphere(Math.random());
    }

    

		i = 0;
    j = 0;
    k = 0;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.document.body.appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate);
    render();

}

function render() {

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

function normalRandom() {
var n=(Math.random()+Math.random()+Math.random()+Math.random()+Math.random())-2.5
return n;
}

function box(num){
if(num>200){
num=200
}
else{
if(num<-200){
num=-200;
}}
return num;
}