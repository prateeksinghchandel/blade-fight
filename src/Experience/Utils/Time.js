import * as THREE from 'three';
import { EventEmitter } from "events";

export class Time extends EventEmmiter {
    constuctor(){
        super();
        this.update();
    }

    update(){
        this.emit("update");
        window.requestAnimationFrame(()=>this.update());
    }
}
