import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Load model dengan path
function loadModel(path, scene) {
    console.log("jalan");
    let loader = new GLTFLoader().load(path, function (result) {
        result.scene.position.y = 0.01;
        result.scene.position.x = tiles[0].position.x;
        result.scene.position.z = tiles[0].position.z;
        // result.scene.rotation.z = Math.PI / 2; // Rotate 180 degrees
        result.scene.scale.set(0.5, 0.5, 0.5);
        scene.add(result.scene);
    });
}

// Load modwl dari tile
function loadModelTile(tile, scene) {
    console.log("jalan");
    new GLTFLoader().load(tile.userData.object, function (result) {
        result.scene.position.y = 0.01;
        result.scene.position.x = tile.position.x;
        result.scene.position.z = tile.position.z;

        // Front : Math.PI * 2
        // Right : Math.PI / 2
        // Back : Math.PI
        // Left : -Math.PI / 2
        result.scene.rotation.y = Math.PI * 2; // right

        result.scene.scale.set(0.43, 0.43, 0.4);
        scene.add(result.scene);
    });
}

function loadRoads(path, scene) {
    // GPT -> load model road bits
    // Model nya terdiri dari beberapa bagian
    // Minta GPT untuk bisa ngambil ke satu bagian
    let loader = new GLTFLoader().load(
        "roads/Road-Bits.glb",
        function (result) {
            result.scene.traverse((child) => {
                if (child.isMesh) {
                    console.log(child.name);
                }
            });
            const straight =
                result.scene.children[0].getObjectByName("road_straight");
            console.log(straight);
            straight.position.x = tiles[56].tile.position.x;
            straight.position.z = tiles[56].tile.position.z;
            straight.rotation.z = Math.PI / 2;
            const road = straight.clone();
            scene.add(road);
        }
    );
}

function loadTilesObject(tiles, scene) {
    for (let tile of tiles) {
        if (!tile.userData.isEmpty && tile.userData.object) {
            loadModelTile(tile, scene);
        }
    }
    console.log("jalan");
}

export { loadModel, loadModelTile, loadTilesObject };
