import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


// ============================================
// STATE & ASSETS
// ============================================
const state = {
    currentMode: null,
    currentObject: null,
};

const assets = {
    building: [
        {
            id: "house",
            name: "House",
            path: "./assets/models/house.glb",
            scale: 1.0,
        },
        {
            id: "apartment",
            name: "Apartment",
            path: "./assets/models/apartment.glb",
            scale: 1.2,
        },
        {
            id: "shop",
            name: "Shop",
            path: "./assets/models/shop.glb",
            scale: 0.9,
        },
    ],
    road: [
        {
            id: "straight",
            name: "Straight",
            path: "./assets/models/road_straight.glb",
            scale: 1.0,
        },
        {
            id: "corner",
            name: "Corner",
            path: "./assets/models/road_corner.glb",
            scale: 1.0,
        },
    ],
    nature: [
        {
            id: "tree",
            name: "Tree",
            path: "./assets/models/tree.glb",
            scale: 0.8,
        },
        {
            id: "bush",
            name: "Bush",
            path: "./assets/models/bush.glb",
            scale: 0.6,
        },
        {
            id: "rock",
            name: "Rock",
            path: "./assets/models/rock.glb",
            scale: 0.5,
        },
    ],
};

// ============================================
// TEXTURES
// ============================================
const textureLoader = new THREE.TextureLoader();
const grass_color = textureLoader.load(
    "./assets/textures/Grass005/Grass005_4K-JPG_Color.jpg"
);
const grass_normal = textureLoader.load(
    "./assets/textures/Grass005/Grass005_4K-JPG_NormalGL.jpg"
);
const grass_roughness = textureLoader.load(
    "./assets/textures/Grass005/Grass005_4K-JPG_Roughness.jpg"
);
const grass_ao = textureLoader.load(
    "./assets/textures/Grass005/Grass005_4K-JPG_AmbientOcclusion.jpg"
);

// ============================================
// GLTF LOADER
// ============================================
const gltfLoader = new GLTFLoader();
const modelCache = new Map();

function loadModel(path, scale = 1.0) {
    return new Promise((resolve, reject) => {
        if (modelCache.has(path)) {
            const cached = modelCache.get(path);
            const clone = cached.scene.clone();
            resolve({ scene: clone, scale });
            return;
        }

        gltfLoader.load(
            path,
            (gltf) => {
                modelCache.set(path, gltf);
                const clone = gltf.scene.clone();
                resolve({ scene: clone, scale });
            },
            undefined,
            (error) => {
                console.error(`Error loading ${path}:`, error);
                reject(error);
            }
        );
    });
}

function standardizeModel(model, scale) {
    model.scale.set(scale, scale, scale);
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    const box = new THREE.Box3().setFromObject(model);
    model.position.y = -box.min.y;
    return model;
}


// ============================================
// PLACEMENT
// ============================================
let previewObject = null;

async function createPreview(assetInfo) {
    if (previewObject) {
        scene.remove(previewObject);
        previewObject = null;
    }

    try {
        const { scene: model, scale } = await loadModel(
            assetInfo.path,
            assetInfo.scale
        );
        previewObject = standardizeModel(model, scale);

        previewObject.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone();
                child.material.transparent = true;
                child.material.opacity = 0.6;
            }
        });

        previewObject.visible = false;
        scene.add(previewObject);
    } catch (error) {
        console.error("Preview error:", error);
    }
}

async function placeObject(tile, assetInfo) {
    if (!tile.userData.isEmpty) return false;

    try {
        const { scene: model, scale } = await loadModel(
            assetInfo.path,
            assetInfo.scale
        );
        const finalObject = standardizeModel(model, scale);

        finalObject.position.copy(tile.position);
        finalObject.position.y = 0;
        scene.add(finalObject);

        tile.userData.isEmpty = false;
        tile.userData.object = finalObject;

        return true;
    } catch (error) {
        console.error("Place error:", error);
        return false;
    }
}

// ============================================
// RAYCASTER
// ============================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredTile = null;

window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(tiles);

    if (hoveredTile) {
        hoveredTile.material.opacity = 0.0;
    }

    if (intersects.length > 0) {
        const tile = intersects[0].object;
        hoveredTile = tile;

        tile.material.opacity = 0.3;
        tile.material.color.setHex(tile.userData.isEmpty ? 0x00ff00 : 0xff0000);

        if (previewObject) {
            previewObject.position.copy(tile.position);
            previewObject.position.y = 0;
            previewObject.visible = true;
        }
    } else {
        if (previewObject) previewObject.visible = false;
        hoveredTile = null;
    }
});

window.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(tiles);

    if (intersects.length > 0 && state.currentObject) {
        const tile = intersects[0].object;
        const asset = getAssetInfo(state.currentObject);
        if (asset) placeObject(tile, asset);
    }
});

// ============================================
// UI FUNCTIONS
// ============================================
function updateObjectButtons(mode) {
    const container = document.getElementById("object-buttons");
    container.innerHTML = "";

    const list = assets[mode] || [];
    list.forEach((asset) => {
        const btn = document.createElement("button");
        btn.textContent = asset.name;
        btn.className = "object-btn";
        btn.onclick = () => selectObject(asset.id);
        container.appendChild(btn);
    });
}

function updateStatus() {
    const statusEl = document.getElementById("status");
    statusEl.textContent = `Mode: ${state.currentMode || "-"} | Object: ${
        state.currentObject || "-"
    }`;
}

function getAssetInfo(objectId) {
    for (const category in assets) {
        const asset = assets[category].find((a) => a.id === objectId);
        if (asset) return asset;
    }
    return null;
}

window.setMode = function (mode) {
    state.currentMode = mode;
    state.currentObject = null;

    document
        .querySelectorAll(".mode-btn")
        .forEach((btn) => btn.classList.remove("active"));
    document.getElementById(`btn-${mode}`).classList.add("active");

    if (previewObject) {
        scene.remove(previewObject);
        previewObject = null;
    }

    updateObjectButtons(mode);
    updateStatus();
};

window.selectObject = async function (objectId) {
    state.currentObject = objectId;

    document
        .querySelectorAll(".object-btn")
        .forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");

    const asset = getAssetInfo(objectId);
    if (asset) await createPreview(asset);

    updateStatus();
};

// ============================================
// RESIZE
// ============================================
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// ANIMATE
// ============================================
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
updateStatus();
