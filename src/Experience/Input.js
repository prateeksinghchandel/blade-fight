import { Experience } from './Experience';

export class Input {
    constructor() {
        this.experience = new Experience();
        this.canvas = this.experience.canvasElement;
        this.enabled = false;

        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
        };

        this.mouse = {
            left: false,
            right: false,
        };

        this.lookSensitivity = 0.0012;
        this.lookDeltaX = 0;
        this.attackPressed = false;
        this.blockMinimumDuration = 450;
        this.blockLockedUntil = 0;
        this.blockReleasePending = false;
        this.setListeners();
    }

    playPlayerAnimation(actionName, force = false) {
        const player = this.experience.player;
        const controller = player?.animationController;

        if (!controller) {
            return;
        }

        controller.play(actionName, 0.15, force);
    }

    getMovementAction() {
        if (this.keys.forward) {
            return 'frontwalk';
        }

        if (this.keys.backward) {
            return 'backwalk';
        }

        if (this.keys.left && this.keys.right) {
            return 'idle';
        }

        if (this.keys.left) {
            return 'leftwalk';
        }

        if (this.keys.right) {
            return 'rightwalk';
        }

        return 'idle';
    }

    isBlocking() {
        return this.mouse.right || (
            this.blockReleasePending &&
            this.experience.time.elapsed < this.blockLockedUntil
        );
    }

    consumeLookDeltaX() {
        const lookDeltaX = this.lookDeltaX;

        this.lookDeltaX = 0;

        return lookDeltaX;
    }

    canAttack() {
        const player = this.experience.player;
        const controller = player?.animationController;

        if (!player || !controller) {
            return false;
        }

        return !this.isBlocking() && !player.isAttacking && controller.currentActionName !== 'attack';
    }

    syncPlayerAnimation() {
        const player = this.experience.player;

        if (!player?.animationController) {
            return;
        }

        if (this.isBlocking()) {
            this.playPlayerAnimation('block');
            return;
        }

        if (player.isAttacking) {
            return;
        }

        const movementAction = this.getMovementAction();

        if (movementAction !== 'idle') {
            this.playPlayerAnimation(movementAction);
            return;
        }

        this.playPlayerAnimation('idle');
    }

    setListeners() {
        window.addEventListener('keydown', (event) => {
            if (!this.isActive()) {
                return;
            }

            switch (event.code) {
                case 'KeyW':
                    this.keys.forward = true;
                    this.syncPlayerAnimation();
                    break;
                case 'KeyS':
                    this.keys.backward = true;
                    this.syncPlayerAnimation();
                    break;
                case 'KeyA':
                    this.keys.left = true;
                    this.syncPlayerAnimation();
                    break;
                case 'KeyD':
                    this.keys.right = true;
                    this.syncPlayerAnimation();
                    break;
            }
        });

        window.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'KeyW':
                    this.keys.forward = false;
                    this.syncPlayerAnimation();
                    break;
                case 'KeyS':
                    this.keys.backward = false;
                    this.syncPlayerAnimation();
                    break;
                case 'KeyA':
                    this.keys.left = false;
                    this.syncPlayerAnimation();
                    break;
                case 'KeyD':
                    this.keys.right = false;
                    this.syncPlayerAnimation();
                    break;
            }
        });

        window.addEventListener('mousedown', (event) => {
            if (!this.isActive()) {
                return;
            }

            if (event.button === 0) {
                this.mouse.left = true;
                if (this.canAttack()) {
                    this.attackPressed = true;
                    this.playPlayerAnimation('attack', true);
                } else {
                    this.syncPlayerAnimation();
                }
            }

            if (event.button === 2) {
                this.mouse.right = true;
                this.blockReleasePending = false;
                this.blockLockedUntil = this.experience.time.elapsed + this.blockMinimumDuration;
                this.syncPlayerAnimation();
            }
        });

        window.addEventListener('mousemove', (event) => {
            if (!this.isActive()) {
                return;
            }

            this.lookDeltaX += event.movementX * this.lookSensitivity;
        });

        window.addEventListener('mouseup', (event) => {
            if (event.button === 0) {
                this.mouse.left = false;
            }

            if (event.button === 2) {
                this.mouse.right = false;
                if (this.experience.time.elapsed < this.blockLockedUntil) {
                    this.blockReleasePending = true;
                } else {
                    this.blockReleasePending = false;
                    this.syncPlayerAnimation();
                }
            }
        });

        window.addEventListener('blur', () => {
            this.reset();
        });

        window.addEventListener('contextmenu', (event) => {
            if (this.isActive()) {
                event.preventDefault();
            }
        });

        document.addEventListener('pointerlockchange', () => {
            this.enabled = document.pointerLockElement === this.canvas;

            if (!this.enabled) {
                this.resetMouse();
            }
        });
    }

    isActive() {
        return this.enabled && document.pointerLockElement === this.canvas;
    }

    resetMouse() {
        this.mouse.left = false;
        this.mouse.right = false;
        this.lookDeltaX = 0;
        this.attackPressed = false;
        this.blockReleasePending = false;
        this.blockLockedUntil = 0;
    }

    reset() {
        this.keys.forward = false;
        this.keys.backward = false;
        this.keys.left = false;
        this.keys.right = false;
        this.resetMouse();
        this.syncPlayerAnimation();
    }

    update() {
        if (this.blockReleasePending && this.experience.time.elapsed >= this.blockLockedUntil) {
            this.blockReleasePending = false;
            this.syncPlayerAnimation();
        }

        this.attackPressed = false;
    }
}
