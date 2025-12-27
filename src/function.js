import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const BUILDINGS = {
    big_building: [
        {
            model: "buildings/Big-Building.glb",
            offset: { x: 0, y: 0, z: 0 },
            scale: { x: 0.4, y: 0.4, z: 0.4 },
        },
    ],
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
    console.log("jalan");
    let loader = new GLTFLoader().load(path, function (result) {
        result.scene.position.y = 0.01;
        scene.add(result.scene);
    });
}

// Load model dari tile
function loadModelTile(tile, scene) {
    const object = BUILDINGS[tile.userData.object];

    if (tile.userData.object === "roads") {
        console.log("jalan roads");
        loadRoads(tile, scene);
    } else if (object) {
        console.log("load building");
        for (let obj of object) {
            new GLTFLoader().load(obj.model, function (result) {
                result.scene.position.y = 0.01;
                result.scene.position.x = tile.position.x - obj.offset.x;
                result.scene.position.z = tile.position.z - obj.offset.z;

                result.scene.rotation.y = objRotate(tile.userData.rotation);

                result.scene.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
                scene.add(result.scene);
            });
        }
    } else {
        console.log("Object not found in BUILDINGS:", tile.userData.object);
    }
}

// Handle logics for the road model



function loadRoads(tile, scene) {
    // GPT -> load model road bits
    // Model nya terdiri dari beberapa bagian
    // Minta GPT untuk bisa ngambil ke satu bagian
    console.log("jalan roads 2");
    let loader = new GLTFLoader().load(
        "roads/Road-Bits.glb",
        function (result) {
            result.scene.traverse((child) => {
                if (child.isMesh) {
                    console.log(child.name);
                }
            });

            const road = result.scene.children[0].getObjectByName("road_straight").clone();
            road.position.x = tile.position.x;
            road.position.z = tile.position.z;
            // road.rotation.z = Math.PI / 2;
            scene.add(road);
        }
    );
}

// Load semua object dari tiles
function loadTilesObject(tiles, scene) {
    for (let tile of tiles) {
        if (!tile.userData.isEmpty && tile.userData.object) {
            loadModelTile(tile, scene);
        }
    }
}

export { loadModel, loadModelTile, loadTilesObject };
