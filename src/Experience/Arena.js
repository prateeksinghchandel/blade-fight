import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Experience } from './Experience';

export class Arena {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.loaders = new GLTFLoader();
        this.bounds = null;
        this.boundaryPadding = 2;

        this.setModel();
    }

    setModel() {
        this.loaders.load('/models/Plane-land.glb', (gltf) => {
            this.model = gltf.scene;
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.receiveShadow = true;
                    child.castShadow = true;
                }
            });

            this.model.position.set(0, 0, 0);
            this.scene.add(this.model);

            const bounds = new THREE.Box3().setFromObject(this.model);
            const center = new THREE.Vector3();
            const size = new THREE.Vector3();

            bounds.getCenter(center);
            bounds.getSize(size);

            const halfWidth = Math.max(size.x / 2 - this.boundaryPadding, 0);
            const halfDepth = Math.max(size.z / 2 - this.boundaryPadding, 0);

            this.bounds = {
                minX: center.x - halfWidth,
                maxX: center.x + halfWidth,
                minZ: center.z - halfDepth,
                maxZ: center.z + halfDepth,
            };
        });
    }

    update() {
        // Reserved for future arena animations or environmental effects.
    }
}
