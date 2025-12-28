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
            // result.scene.traverse((child) => {
            //     if (child.isMesh) {
            //         console.log(child.name);
            //     }
            // });

            // Check sekitar
            let top =
                tiles[tile.userData.index - GRID_SIZE].userData.object ===
                "roads";
            let right =
                tiles[tile.userData.index + 1].userData.object === "roads";
            let bottom =
                tiles[tile.userData.index + GRID_SIZE].userData.object ===
                "roads";
            let left =
                tiles[tile.userData.index - 1].userData.object === "roads";

            let connected = 0;
            if (top) connected++;
            if (right) connected++;
            if (bottom) connected++;
            if (left) connected++;

            let model = result.scene.children[0];

            let road_type;
            let road_dir = Math.PI * 2;

            if (connected === 2) {
                road_type = "road_corner";
            } else if (connected === 3) {
                // console.log(tile.userData.index, "Three connection", connected);
                road_type = "road_tsplit";

                if (right && left) {
                    if (bottom) {
                        road_dir = -Math.PI / 2;
                    } else if (top) {
                        road_dir = Math.PI / 2;
                    }
                }

                if (bottom & top) {
                    if (left) {
                        road_dir = Math.PI;
                    } else if (right) {
                        road_dir = Math.PI * 2;
                    }
                }
            } else if (connected === 4) {
                road_type = "road_junction";
            } else {
                if (right || left) {
                    road_dir = Math.PI / 2;
                }
                // console.log(tile.userData.index, "One connection", connected);
                road_type = "road_straight";
            }
            let road = model.getObjectByName(road_type).clone();

            road.position.x = tile.position.x;
            // console.log(road_dir);
            road.position.z = tile.position.z;
            road.rotation.z = road_dir;
            tile.userData.instance.push(road);
            scene.add(road);
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
