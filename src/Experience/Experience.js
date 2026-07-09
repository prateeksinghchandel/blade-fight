import * as THREE from 'three';
import { Time } from './Utils/Time';
import { Sizes } from './Utils/Sizes';
import { Camera } from './Camera';
import { Renderer } from './Renderer';
import { Lights } from './Lights';
import { Arena } from './Arena';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Input } from './Input';
import { HUD } from './HUD';

export class Experience {
    constructor(){
        if(Experience.instance) return Experience.instance;
        
        Experience.instance = this;
        this.init()
    }

    init(){
        this.canvasElement = document.getElementById("experience-canvas")

        this.scene = new THREE.Scene();
        this.time = new Time();
        this.sizes = new Sizes();
        this.health = {
            player: 100,
            enemy: 100,
        };
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.lights = new Lights();
        this.arena = new Arena();
        this.player = new Player();
        this.enemy = new Enemy();
        this.input = new Input();
        this.hud = new HUD();
    
        this.time.on("update",()=>{
            this.update();
        });
        this.sizes.on("resize",()=>{
            this.resize();
        });
    }
    resize(){
        this.camera.resize();
        this.renderer.resize();
    }

    update(){
        this.arena.update();
        this.enemy.update();
        this.player.update();
        this.camera.update();
        this.renderer.update();
        this.input.update();
        this.hud.update();
    }
}
