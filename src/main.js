import { Experience } from './Experience/Experience'
import './style.css'

const startButton = document.getElementById('start-button');
const menuScreen = document.getElementById('menu-screen');

const startGame = () => {
    const experience = new Experience();

    document.body.classList.add('game-active');
    menuScreen?.remove();

    experience.canvasElement?.requestPointerLock?.();
};

startButton?.addEventListener('click', startGame);
