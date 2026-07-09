import * as THREE from 'three';
import { Experience } from './Experience';

export class Lights {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.setLights();
    }

    setLights() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 2);
        this.scene.add(this.ambientLight);

        this.sunLight = new THREE.DirectionalLight(0xfff4df, 3);
        this.sunLight.position.set(4, 6, 3);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 25;
        this.sunLight.shadow.camera.left = -10;
        this.sunLight.shadow.camera.right = 10;
        this.sunLight.shadow.camera.top = 10;
        this.sunLight.shadow.camera.bottom = -10;
        this.sunLight.shadow.bias = -0.0005;
        this.sunLight.shadow.normalBias = 0.02;
        this.scene.add(this.sunLight);
    }
}
