import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Load model dengan path
function loadModel(path, scene) {
    console.log("jalan");
    let loader = new GLTFLoader().load(path, function (result) {
        result.scene.position.y = 0.01;
        result.scene.position.x = tiles[0].data.positionX;
        result.scene.position.z = tiles[0].data.positionZ;
        result.scene.scale.set(0.5, 0.5, 0.5);
        scene.add(result.scene);
    });
}

// Load modwl dari tile
function loadModelTile(tile, scene) {
    console.log("jalan");
    new GLTFLoader().load(tile.data.object, function (result) {
        result.scene.position.y = 0.01;
        result.scene.position.x = tile.data.positionX;
        result.scene.position.z = tile.data.positionZ;
        result.scene.scale.set(0.43, 0.43, 0.4);
        scene.add(result.scene);
    });
}

function loadTilesObject(tiles, scene) {
    for(let tile of tiles) {
        if (!tile.data.isEmpty && tile.data.object) {
            loadModelTile(tile, scene);
        }
    }
    console.log("jalan");
}

export { loadModel, loadModelTile, loadTilesObject };