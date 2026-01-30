import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';

export class Ocean {
    constructor(scene) {
        this.scene = scene;
        this.water = null;
    }

    createOcean() {
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

        this.water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load('/textures/waternormals.jpg', function (texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f, 
                distortionScale: 3.7, 
                fog: this.scene.fog !== undefined
            }
        );

        this.water.rotation.x = -Math.PI / 2; 
        this.water.position.y = -2.5; 
        
        this.scene.add(this.water);
    }

    updateWater(time) {
        if (this.water) {
            // biar ombak nya gerak
            this.water.material.uniforms['time'].value += 1.0 / 60.0;
        }
    }
}