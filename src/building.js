import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { loadModelTile } from "./function.js";

export const BUILDINGS = {
    big_building: [
        {
            model: "buildings/Big-Building.glb",
            offset: { x: 0, y: 0, z: 0 },
            scale: { x: 0.4, y: 0.4, z: 0.4 },
        },
        {
            model: "buildings/ATM.glb",
            offset: { x: 0, y: 0, z: 2 },
            scale: { x: 1, y: 1, z: 1 },
        },
    ],
};

function addBuilding(tile, scene) {
    tile.userData.isEmpty = false;
    tile.userData.object = "roads";
    tile.userData.direction = "front";

    loadModelTile(tile, scene);
}

function removeBuilding(tile, scene) {
    if (!tile.userData.instance) {
        console.log("No instance to remove");
        return;
    }

    for (let ins of tile.userData.instance) {
        // GPT -> hapus instance dari scene
        scene.remove(ins);
    }

    tile.userData.isEmpty = true;
    tile.userData.object = null;
    tile.userData.direction = "";
    tile.userData.instance = [];

    loadModelTile(tile, scene);
}

function rotateBuilding(tile, scene, direction) {
    console.log("Rotating building on tile:", tile);
    if (!tile.userData.instance) {
        console.log("No instance to remove");
        return;
    }

    tile.userData.direction = direction;

    for (let ins of tile.userData.instance) {
        scene.remove(ins);
    }

    loadModelTile(tile, scene);
}


export { addBuilding, removeBuilding, rotateBuilding };
