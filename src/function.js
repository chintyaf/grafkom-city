import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { BUILDINGS } from "./building.js";
import { GRID_SIZE, TILE_SIZE } from "./main.js";
import { selectDirection, modeBuilding } from "./building-mode.js";

const DIR = {
    front: Math.PI * 2,
    right: Math.PI / 2,
    back: Math.PI,
    left: -Math.PI / 2,
};

function objRotate(direction) {
    if (direction === "front") {
        return Math.PI * 2;
    } else if (direction === "right") {
        return Math.PI / 2;
    } else if (direction === "back") {
        return Math.PI;
    } else if (direction === "left") {
        return -Math.PI / 2;
    } else {
        return 0;
    }
}



// Load model secata general
function loadModel(path, scene) {
    let loader = new GLTFLoader().load(path, function (result) {
        result.scene.position.y = 0.01;
        scene.add(result.scene);
    });
}

// Load model dari tile
function loadModelTile(tile, scene) {
    const object = BUILDINGS[tile.userData.object];

    if (object) {
        for (let obj of object) {
            new GLTFLoader().load(obj.model, function (result) {
                let model = result.scene;

                model.position.y = 0.01;
                model.position.x = tile.position.x - obj.offset.x;
                model.position.z = tile.position.z - obj.offset.z;
                model.rotation.y = objRotate(tile.userData.direction);
                model.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);

                tile.userData.instance.push(model);
                scene.add(model);
            });
        }
    } else {
        console.log("Object not found in BUILDINGS:", tile.userData.object);
    }
}

// Handle logics for the road model
function loadRoads(tiles, tile, scene) {
    // GPT -> load model road bits
    // Model nya terdiri dari beberapa bagian
    // Minta untuk bisa ngambil ke satu bagian
    let loader = new GLTFLoader().load(
        "roads/Road-Bits.glb",
        function (result) {
            let model = result.scene.children[0];
            let road_type;
            let road_dir = Math.PI * 2;

            // --- LOGIKA BARU: Cek Manual Selection ---
            if (tile.userData.specificType) {
                // Jika user memilih manual lewat road-mode.js
                road_type = tile.userData.specificType;
                
                // Gunakan helper objRotate untuk konversi "front/left" ke Radian
                road_dir = objRotate(tile.userData.direction);

            } else {
                // --- LOGIKA LAMA (Auto Connect) ---
                // (Biarkan kode lama di sini sebagai fallback)
                let top = tiles[tile.userData.index - GRID_SIZE]?.userData.object === "roads";
                let right = tiles[tile.userData.index + 1]?.userData.object === "roads";
                let bottom = tiles[tile.userData.index + GRID_SIZE]?.userData.object === "roads";
                let left = tiles[tile.userData.index - 1]?.userData.object === "roads";

                let connected = 0;
                if (top) connected++;
                if (right) connected++;
                if (bottom) connected++;
                if (left) connected++;

                if (connected === 2) {
                    road_type = "road_corner";
                } else if (connected === 3) {
                    road_type = "road_tsplit";
                    // ... (logika rotasi auto tsplit lama) ...
                    if (right && left) { if (bottom) road_dir = -Math.PI / 2; else if (top) road_dir = Math.PI / 2; }
                    if (bottom & top) { if (left) road_dir = Math.PI; else if (right) road_dir = Math.PI * 2; }
                } else if (connected === 4) {
                    road_type = "road_junction";
                } else {
                    if (right || left) road_dir = Math.PI / 2;
                    road_type = "road_straight";
                }
            }
            // ------------------------------------------

            // Load Mesh sesuai tipe yang ditentukan
            let road = model.getObjectByName(road_type);
            
            // Error handling kalau nama mesh salah di GLB
            if(road) {
                let roadClone = road.clone();
                roadClone.position.x = tile.position.x;
                roadClone.position.z = tile.position.z;
                roadClone.rotation.z = road_dir; // Perhatikan: Road-Bits biasanya rotasi Z atau Y tergantung export
                
                // Fix posisi Y agar tidak flickering dengan tanah
                roadClone.position.y = 0.02; 

                tile.userData.instance.push(roadClone);
                scene.add(roadClone);
            } else {
                console.warn("Road Type not found in GLB:", road_type);
            }
        }
    );
}

// Load semua object dari tiles
function loadTilesObject(tiles, scene) {
    for (let tile of tiles) {
        if (!tile.userData.isEmpty && tile.userData.object) {
            if (tile.userData.object == "roads") {
                loadRoads(tiles, tile, scene);
            } else {
                loadModelTile(tile, scene);
            }
        }
    }
}

export { loadModel, loadModelTile, loadTilesObject };
