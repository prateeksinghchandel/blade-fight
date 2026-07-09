import * as THREE from 'three';
import { Experience } from './Experience';

export class Camera {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.target = null;
        this.offset = new THREE.Vector3(0, 2.7, 6.5);
        this.lookAtOffset = new THREE.Vector3(0, 1.4, 0);
        this.positionLerpFactor = 0.12;
        this.lookAtLerpFactor = 0.18;
        this.currentLookAt = new THREE.Vector3();
        this.hasFollowedTarget = false;
        this.zoomStartTime = performance.now();
        this.zoomDuration = 1000;
        this.zoomStartFactor = 0.45;
        this.zoomEndFactor = 1;

        this.setInstance();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.aspect,
            0.1,
            100
        );

        this.instance.position.set(0, 1.5, 5);
        this.scene.add(this.instance);
    }

    resize() {
        this.instance.aspect = this.sizes.aspect;
        this.instance.updateProjectionMatrix();
    }

    update() {
        const playerModel = this.experience.player?.model;

        if (!playerModel) {
            return;
        }

        this.target = playerModel;

        const targetPosition = new THREE.Vector3();
        const targetDirection = new THREE.Vector3();

        this.target.getWorldPosition(targetPosition);
        this.target.getWorldDirection(targetDirection);

        const zoomProgress = Math.min(
            (performance.now() - this.zoomStartTime) / this.zoomDuration,
            1
        );
        const zoomEase = zoomProgress * zoomProgress * (3 - 2 * zoomProgress);
        const zoomFactor = THREE.MathUtils.lerp(
            this.zoomStartFactor,
            this.zoomEndFactor,
            zoomEase
        );

        const desiredPosition = targetPosition
            .clone()
            .add(
                new THREE.Vector3(
                    0,
                    this.offset.y * zoomFactor,
                    0
                )
            )
            .add(targetDirection.multiplyScalar(-this.offset.z * zoomFactor));

        const desiredLookAt = targetPosition.clone().add(this.lookAtOffset);

        if (!this.hasFollowedTarget) {
            this.instance.position.copy(desiredPosition);
            this.currentLookAt.copy(desiredLookAt);
            this.hasFollowedTarget = true;
            this.instance.lookAt(this.currentLookAt);
            return;
        }

        this.instance.position.lerp(desiredPosition, this.positionLerpFactor);
        this.currentLookAt.lerp(desiredLookAt, this.lookAtLerpFactor);
        this.instance.lookAt(this.currentLookAt);
    }
}
