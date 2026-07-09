import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationController } from './AnimationController';
import { Experience } from './Experience';

export class Player {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.loader = new GLTFLoader();
        this.animationController = null;
        this.isAttacking = false;
        this.moveSpeed = 3;

        this.setModel();
    }

    cancelAttack() {
        this.isAttacking = false;
    }

    applyLookRotation(lookDeltaX) {
        if (!this.model || !lookDeltaX) {
            return;
        }

        this.model.rotation.y -= lookDeltaX;
    }

    getMovementDirection(movementAction) {
        const forwardDirection = new THREE.Vector3();
        const rightDirection = new THREE.Vector3();
        const upDirection = new THREE.Vector3(0, 1, 0);

        this.model.getWorldDirection(forwardDirection);
        forwardDirection.y = 0;
        forwardDirection.normalize();

        rightDirection.crossVectors(upDirection, forwardDirection).normalize();

        switch (movementAction) {
            case 'frontwalk':
                return forwardDirection;
            case 'backwalk':
                return forwardDirection.negate();
            case 'leftwalk':
                return rightDirection;
            case 'rightwalk':
                return rightDirection.negate();
            default:
                return null;
        }
    }

    movePlayer(movementAction, deltaTime) {
        if (!this.model || !movementAction || movementAction === 'idle') {
            return;
        }

        const movementDirection = this.getMovementDirection(movementAction);

        if (!movementDirection) {
            return;
        }

        this.model.position.add(
            movementDirection.multiplyScalar(this.moveSpeed * deltaTime)
        );
        this.model.position.y = 0;
    }

    clampToArena() {
        const arenaBounds = this.experience.arena?.bounds;

        if (!this.model || !arenaBounds) {
            return;
        }

        this.model.position.x = THREE.MathUtils.clamp(
            this.model.position.x,
            arenaBounds.minX,
            arenaBounds.maxX
        );
        this.model.position.z = THREE.MathUtils.clamp(
            this.model.position.z,
            arenaBounds.minZ,
            arenaBounds.maxZ
        );
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

            this.animationController.mixer.addEventListener('finished', (event) => {
                if (event.action === this.animationController.getAction('attack')) {
                    this.cancelAttack();
                }
            });

            this.model.position.set(0, 0, 0);
            this.scene.add(this.model);
        });
    }

    update() {
        const input = this.experience.input;
        const deltaTime = this.experience.time.delta / 1000;
        const lookDeltaX = input.consumeLookDeltaX?.();

        if (this.animationController) {
            this.animationController.update(deltaTime);
        }

        if (!this.model || !input) {
            return;
        }

        this.applyLookRotation(lookDeltaX);

        if (input.isBlocking?.()) {
            this.cancelAttack();
            this.animationController?.play('block');
            return;
        }

        if (input.attackPressed && !this.isAttacking) {
            this.isAttacking = true;
            this.animationController?.play('attack');
            return;
        }

        if (this.isAttacking) {
            return;
        }

        const movementAction = input.getMovementAction?.();

        this.movePlayer(movementAction, deltaTime);
        this.clampToArena();

        if (movementAction && movementAction !== 'idle') {
            this.animationController?.play(movementAction);
            return;
        }

        this.animationController?.play('idle');
    }
}
