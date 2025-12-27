import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Source
import { setupScene, setupLighting, animate } from "./scene";
import { createPlane } from "./plane";

const { scene, camera, renderer } = setupScene();

const GRID_SIZE = 10; // 20x20 tiles
const TILE_SIZE = 2; // Ukuran satu tile

const tiles = createPlane(scene, GRID_SIZE, TILE_SIZE);

setupLighting(scene);

const controls = new OrbitControls(camera, renderer.domElement);

animate(renderer, scene, camera, controls);

// ============================================
// RAYCASTER untuk KLIK
// ============================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedTile = null;

// Mouse Click (untuk select tile)
window.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(tiles);

    if (intersects.length > 0) {
        const tile = intersects[0].object;

        // Reset tile sebelumnya
        if (selectedTile) {
            // selectedTile.material.color.set(0x000000);
            selectedTile.material.emissive.setHex(0x000000);
        }

        selectedTile = tile;
        // tile.material.color.set(0x003300);
        tile.material.emissive.setHex(0x003300); // hijau
    }
});
