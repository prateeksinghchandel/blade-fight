import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// setup
const loader = new GLTFLoader();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9ed5ff);
const canvas = document.getElementById("experience-canvas")
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//resize handling
function handleResize(){
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect=sizes.width / sizes.height
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height)
}
window.addEventListener("resize",handleResize)

// perspective camera 
const fov = 75;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov,sizes.width/ sizes.height, near, far);

// camera positioning
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0)

// lighting
const light = new THREE.AmbientLight(0xFFFFFF, 5);
scene.add(light);

// loading plane-land
loader.load( 'models/Plane-land.glb', function ( gltf ) {

  scene.add( gltf.scene );

}, undefined, function ( error ) {

  console.error( error );

} );

// showing everything
function animate( time ) {
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );