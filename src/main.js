import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Import functions from other modules
import { setupScene, setupLighting, animate } from "./scene";
import { createPlane } from "./plane";
import { loadModelTile, loadTilesObject } from "./function";


// Setup scene, camera, renderer
const { scene, camera, renderer } = setupScene();

const GRID_SIZE = 10; // 20x20 tiles
const TILE_SIZE = 2; // Ukuran satu tile

const tiles = createPlane(scene, GRID_SIZE, TILE_SIZE);

setupLighting(scene);

let n = 55;
tiles[n].data.isEmpty = false;
tiles[n].data.object = "buildings/Big-Building.glb";
loadTilesObject(tiles, scene);

tiles[56].data.isEmpty = false;
tiles[56].data.object = "roads/Road-Bits.glb";
loadModelTile(tiles[56], scene);

const controls = new OrbitControls(camera, renderer.domElement);

animate(renderer, scene, camera, controls);

// ============================================
// RAYCASTER untuk KLIK
// ============================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedTile = null;

// Mouse Click (untuk select tile)
// window.addEventListener("click", (event) => {
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//     raycaster.setFromCamera(mouse, camera);
//     const intersects = raycaster.intersectObjects(tiles);

//     if (intersects.length > 0) {
//         const tile = intersects[0].object;

//         // Reset tile sebelumnya
//         if (selectedTile) {
//             // selectedTile.material.color.set(0x000000);
//             selectedTile.material.emissive.setHex(0x000000);
//         }

//         // console.log("Deselecting tile:", selectedTile.userData);
//         selectedTile = tile;
//         // tile.material.color.set(0x003300);
//         tile.material.emissive.setHex(0x003300); // hijau
//     }
// });


