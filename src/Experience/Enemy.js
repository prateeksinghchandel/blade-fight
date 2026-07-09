import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationController } from './AnimationController';
import { Experience } from './Experience';

export class Enemy {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.loader = new GLTFLoader();
        this.isPositioned = false;
        this.animationController = null;

        this.setModel();
    }

    setModel() {
        this.loader.load('/models/samurai-model.glb', (gltf) => {
            this.model = gltf.scene;
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            this.animationController = new AnimationController(
                this.model,
                gltf.animations,
                'idle'
            );

            this.scene.add(this.model);
        });
    }

    setPosition() {
        const playerModel = this.experience.player?.model;

        if (!this.model || !playerModel) {
            return;
        }

        const playerPosition = new THREE.Vector3();
        const playerDirection = new THREE.Vector3();

        playerModel.getWorldPosition(playerPosition);
        playerModel.getWorldDirection(playerDirection);

        const enemyPosition = playerPosition
            .clone()
            .add(playerDirection.multiplyScalar(4));

        this.model.position.copy(enemyPosition);
        this.isPositioned = true;
    }

    update() {
        if (this.animationController) {
            this.animationController.update(this.experience.time.delta / 1000);
        }

        if (!this.isPositioned) {
            this.setPosition();
        }

    }
}
