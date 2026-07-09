import { Experience } from './Experience';

export class HUD {
    constructor() {
        this.experience = new Experience();
        this.playerFill = document.getElementById('player-health-fill');
        this.enemyFill = document.getElementById('enemy-health-fill');
        this.playerBar = this.playerFill?.parentElement;
        this.enemyBar = this.enemyFill?.parentElement;
        this.lastPlayerHealth = null;
        this.lastEnemyHealth = null;

        this.syncFromState();
    }

    clampHealth(value) {
        return Math.max(0, Math.min(100, value));
    }

    setPlayerHealth(percent) {
        this.experience.health.player = this.clampHealth(percent);
        this.syncPlayerHealth();
    }

    setEnemyHealth(percent) {
        this.experience.health.enemy = this.clampHealth(percent);
        this.syncEnemyHealth();
    }

    syncFromState() {
        this.syncPlayerHealth();
        this.syncEnemyHealth();
    }

    syncPlayerHealth() {
        const value = this.clampHealth(this.experience.health.player);

        if (value === this.lastPlayerHealth) {
            return;
        }

        if (this.playerFill) {
            this.playerFill.style.width = `${value}%`;
        }

        if (this.playerBar) {
            this.playerBar.setAttribute('aria-valuenow', `${value}`);
        }

        this.lastPlayerHealth = value;
    }

    syncEnemyHealth() {
        const value = this.clampHealth(this.experience.health.enemy);

        if (value === this.lastEnemyHealth) {
            return;
        }

        if (this.enemyFill) {
            this.enemyFill.style.width = `${value}%`;
        }

        if (this.enemyBar) {
            this.enemyBar.setAttribute('aria-valuenow', `${value}`);
        }

        this.lastEnemyHealth = value;
    }

    update() {
        this.syncPlayerHealth();
        this.syncEnemyHealth();
    }
}
