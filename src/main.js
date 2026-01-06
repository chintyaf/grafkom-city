import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/examples/jsm/Addons.js";

// GPT -> Integrasi antar module (Export, Import)
// utk memudahkan dalam pengelolaan kode

// Import functions from other modules
import { setupScene, setupLighting, animate } from "./scene";
import { createPlane } from "./plane";
import {
    loadModel,
    loadModelTile,
    loadTilesObject,
} from "./function";
import { addBuilding, removeBuilding, rotateBuilding } from "./building";

import { modeNature } from "./ui";
import { modeRoad, placeRoad } from "./road-mode.js";
import { modeBuilding, editBuilding } from "./building-mode";
import { updateCars } from "./car.js";

// Setup scene, camera, renderer
export var { scene, camera, renderer } = setupScene();

export const TILE_SIZE = 2; // Ukuran Tile
export const GRID_SIZE = 10; // 20x20 tiles

export var tiles = createPlane(scene, GRID_SIZE, TILE_SIZE);

setupLighting(scene);

// Example: Load models onto tiles
let n = 55;
tiles[n].userData.isEmpty = false;
tiles[n].userData.object = "big_building";
tiles[n].userData.direction = "right";

tiles[56].userData.isEmpty = false;
tiles[56].userData.object = "roads";

tiles[57].userData.isEmpty = false;
tiles[57].userData.object = "roads";

tiles[66].userData.isEmpty = false;
tiles[66].userData.object = "roads";

// tiles[55].userData.isEmpty = false;
// tiles[55].userData.object = "roads";

tiles[46].userData.isEmpty = false;
tiles[46].userData.object = "roads";

loadTilesObject(tiles, scene);
const controls = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();
let activeMode = "none"; // building, road, nature, none

function animateLoop() {
    requestAnimationFrame(animateLoop);
    
    // 1. Hitung waktu (detik) antar frame agar gerakan halus
    const delta = clock.getDelta(); 

    // 2. Update Orbit Controls
    controls.update();
    
    // 3. Update Logika Mobil (Spawn & Jalan)
    // Kirim 'tiles' agar mobil tau mana jalan, dan 'delta' agar speed konsisten
    updateCars(tiles, scene, delta);

    // 4. Render Scene
    renderer.render(scene, camera);
}
animateLoop();

// saveTiles(tiles);
//animate(renderer, scene, camera, controls);

//
// TESTING AREA
//

let btn_building = document.getElementById("btn-building");
let btn_road = document.getElementById("btn-road");
let btn_nature = document.getElementById("btn-nature");

btn_building.addEventListener("click", (event) => {
    modeBuilding(tiles, camera, scene);
});

btn_road.addEventListener("click", (event) => {
    activeMode = "road"; // Set mode
    modeRoad(tiles, scene);
});

btn_nature.addEventListener("click", (event) => {
    modeNature();
});

//
//
//
//
//
//
//
//
//
//

// ============================================
// RAYCASTER untuk KLIK
// ============================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedTile = null;

window.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * -2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(tiles);

    if (intersects.length > 0) {
        const tile = intersects[0].object;
        if (selectedTile) selectedTile.material.emissive.setHex(0x000000);
        selectedTile = tile;
        tile.material.emissive.setHex(0x003300);

        if (activeMode === "road") {
            placeRoad(tile, scene, tiles);
        } else if (activeMode === "building") {
            if (tile.userData.object && tile.userData.object !== "roads") {
                editBuilding(tile);
            }
        }
    }
});

// let clickTiles = (event) => {
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = (event.clientY / window.innerHeight) * -2 + 1;

//     raycaster.setFromCamera(mouse, camera);

//     // Hanya memilih objek plane (tiles)
//     const intersects = raycaster.intersectObjects(tiles);

//     if (intersects.length > 0) {
//         const tile = intersects[0].object;

//         // Reset tile sebelumnya
//         if (selectedTile) {
//             // selectedTile.material.color.set(0x000000);
//             selectedTile.material.emissive.setHex(0x000000);
//         }

//         selectedTile = tile;

//         if (selectedTile.userData.object) {
//             console.log("select tile yg ada objek : ", selectedTile);
//             editBuilding(selectedTile);
//             // window.removeEventListener("click", clickTiles);
//         }
//         // addBuilding(tile, scene, "roads");
//         // rotateBuilding(selectedTile, scene, "back");
//         // tile.material.color.set(0x003300);
//         tile.material.emissive.setHex(0x003300); // hijau

//         if (intersects.length > 0) {
//         const tile = intersects[0].object;

//         // Reset tile sebelumnya
//         if (selectedTile) {
//             selectedTile.material.emissive.setHex(0x000000);
//         }
//         selectedTile = tile;
//         tile.material.emissive.setHex(0x003300);

//         // --- LOGIKA KLIK BERDASARKAN MODE ---
        
//         if (activeMode === "road") {
//             // Panggil fungsi placeRoad dari road-mode.js
//             placeRoad(selectedTile, scene, tiles);
//         } 
//         else if (activeMode === "building") {
//             // Logika existing building
//             if (selectedTile.userData.object && selectedTile.userData.object !== "roads") {
//                 editBuilding(selectedTile);
//             }
//         }
//         // ------------------------------------
//     }
//     }
// };
// window.addEventListener("click", clickTiles);

function saveTiles(tiles) {
    // Extract only relevant data
    const tilesData = tiles.map((tile) => ({
        userData: tile.userData, // your custom data
    }));

    const blob = new Blob([JSON.stringify(tilesData, null, 2)], {
        type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tiles.json";
    link.click();
    URL.revokeObjectURL(link.href);
}
