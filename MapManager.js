import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class MapManager {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
        
        const limit = 49.0;
        this.boundaries = {
            minX: -limit, maxX: limit,
            minZ: -limit, maxZ: limit
        };  
    }

    createLevel() {
        // trotoar abu
        const cityBaseGeometry = new THREE.BoxGeometry(100, 0.4, 100); 
        const cityBaseMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x999999,
        });
        const cityBase = new THREE.Mesh(cityBaseGeometry, cityBaseMaterial);
        cityBase.position.y = -0.2; 
        cityBase.receiveShadow = true;
        this.scene.add(cityBase);

        this.loadFences();
    }

    loadFences() {
        this.loader.load('models/Fence.glb', (gltf) => {
            const fenceModel = gltf.scene;
            
            const scale = 0.5; 
            fenceModel.scale.set(scale, scale, scale);

            const fenceWidth = 1.96; 
            const boundarySize = 50; 
            fenceModel.position.y = 0; 
            // helper pager --GPT
            const placeSide = (startX, startZ, count, rotationY, axis) => {
                for (let i = 0; i < count; i++) {
                    const fence = fenceModel.clone();
                    
                    if (axis === 'x') {
                        fence.position.set(startX + (i * fenceWidth), 0, startZ);
                    } else {
                        fence.position.set(startX, 0, startZ + (i * fenceWidth));
                    }
                    
                    fence.rotation.y = rotationY;
                    this.scene.add(fence);
                }
            };

            // jumlah pager per sisi
            const countPerSide = (boundarySize * 2) / fenceWidth;

            // Sisi Depan (Z positif)
            placeSide(-boundarySize, boundarySize, countPerSide, 0, 'x');
            // Sisi Belakang (Z negatif)
            placeSide(-boundarySize, -boundarySize, countPerSide, Math.PI, 'x');
            // Sisi Kanan (X positif)
            placeSide(boundarySize, -boundarySize, countPerSide, Math.PI / 2, 'z');
            // Sisi Kiri (X negatif)
            placeSide(-boundarySize, -boundarySize, countPerSide, -Math.PI / 2, 'z');

        }, undefined, (error) => {
            console.error('Error loading fence:', error);
        });
    }

    checkCollision(objectToCheck) {
        if (!objectToCheck) return;

        const x = objectToCheck.position.x;
        const z = objectToCheck.position.z;

        // Cek X
        if (x < this.boundaries.minX) {
            objectToCheck.position.x = this.boundaries.minX;
        }
        if (x > this.boundaries.maxX) {
            objectToCheck.position.x = this.boundaries.maxX;
        }

        // Cek Z
        if (z < this.boundaries.minZ) {
            objectToCheck.position.z = this.boundaries.minZ;
        }
        if (z > this.boundaries.maxZ) {
            objectToCheck.position.z = this.boundaries.maxZ;
        }
    }
}