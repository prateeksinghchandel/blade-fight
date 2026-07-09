import * as THREE from 'three';

const ACTION_CONFIG = {
    idle: {
        loop: THREE.LoopRepeat,
        clampWhenFinished: false,
    },
    frontwalk: {
        loop: THREE.LoopRepeat,
        clampWhenFinished: false,
    },
    backwalk: {
        loop: THREE.LoopRepeat,
        clampWhenFinished: false,
    },
    leftwalk: {
        loop: THREE.LoopRepeat,
        clampWhenFinished: false,
    },
    rightwalk: {
        loop: THREE.LoopRepeat,
        clampWhenFinished: false,
    },
    attack: {
        loop: THREE.LoopOnce,
        clampWhenFinished: true,
    },
    block: {
        loop: THREE.LoopOnce,
        clampWhenFinished: true,
    },
};

export class AnimationController {
    constructor(model, clips, defaultAction = 'idle') {
        this.model = model;
        this.mixer = new THREE.AnimationMixer(this.model);
        this.actions = {};
        this.currentActionName = null;

        clips.forEach((clip) => {
            const action = this.mixer.clipAction(clip);

            action.enabled = true;
            this.actions[clip.name] = action;
        });

        this.play(defaultAction, 0, true);
    }

    getAction(name) {
        return this.actions[name] || null;
    }

    play(name, fadeTime = 0.10, force = false) {
        const action = this.getAction(name);

        if (!action) {
            return null;
        }

        if (this.currentActionName === name && !force) {
            return action;
        }

        const previousAction = this.getAction(this.currentActionName);

        if (previousAction && previousAction !== action) {
            previousAction.fadeOut(fadeTime);
        }

        const actionConfig = ACTION_CONFIG[name] || ACTION_CONFIG.idle;

        action.reset();
        action.enabled = true;
        action.clampWhenFinished = actionConfig.clampWhenFinished;
        action.setLoop(actionConfig.loop, actionConfig.loop === THREE.LoopOnce ? 1 : Infinity);
        action.setEffectiveWeight(1);
        action.setEffectiveTimeScale(1);
        action.fadeIn(fadeTime);
        action.play();

        this.currentActionName = name;

        return action;
    }

    update(deltaTime) {
        this.mixer.update(deltaTime);
    }
}
