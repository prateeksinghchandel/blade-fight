import * as THREE from 'three';
import { EventEmitter } from "events";

export class Time extends EventEmitter {
    constructor(){
        super();
        this.current = performance.now();
        this.previous = this.current;
        this.delta = 0;
        this.elapsed = 0;
        this.update();
    }

    update(){
        this.current = performance.now();
        this.delta = this.current - this.previous;
        this.previous = this.current;
        this.elapsed += this.delta;
        this.emit("update");
        window.requestAnimationFrame(()=>this.update());
    }
}
