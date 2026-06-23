import * as THREE from 'three';
import { Time } from './Utils/Time';
import { Sizes } from './Utils/Sizes';

export class Experience {
    constuctor(){
        if(Experience.instance) return Experience.instance;
        
        Experience.instance = this;
        this.init()
    }

    init(){
        this.canvasElement = document.getElementById("experience-canvas")

        this.scene = new THREE.Scene();
        this.time = new Time();
        this.sizes = new Sizes();
    
        this.time.on("update",()=>{
            this.update();
        });
        this.sizes.on("resize",()=>{
            this.resize();
        });
    }
    resize(){
        
    }

    update(){

    }
}