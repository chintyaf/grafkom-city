// src/ui.js
import * as THREE from "three";
import { scene, camera, tiles } from "./main.js";

// ===============================
// STATE
// ===============================
let currentMode = null;
let previewObject = null;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ===============================
// WAJIB ADA (DIPANGGIL DARI MAIN / HTML)
// ===============================
export function modeRoad() {
    currentMode = "road";
    removePreview();
    console.log("Mode Road");
}

export function modeNature() {
    currentMode = "nature";
    createPreview("nature");
    console.log("Mode Nature");
}

export function modeBuildingUI() {
    currentMode = "building";
    createPreview("building");
    console.log("Mode Building");
}

// ===============================
// PREVIEW OBJECT
// ===============================
function createPreview(type) {
    removePreview();

    let geometry;
    if (type === "building") {
        geometry = new THREE.BoxGeometry(1, 2, 1);
    } else {
        geometry = new THREE.ConeGeometry(0.8, 2, 8);
    }

    const material = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.5,
    });

    previewObject = new THREE.Mesh(geometry, material);
    previewObject.position.y = 1;
    scene.add(previewObject);
}

function removePreview() {
    if (!previewObject) return;
    scene.remove(previewObject);
    previewObject = null;
}

// ===============================
// MOUSE MOVE → RAYCAST KE TILE
// ===============================
window.addEventListener("mousemove", (event) => {
    if (!previewObject) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(tiles);
    if (intersects.length > 0) {
        const tile = intersects[0].object;
        previewObject.position.set(
            tile.position.x,
            1,
            tile.position.z
        );
    }
});

// ===============================
// CLICK → PLACE (DUMMY)
// ===============================
window.addEventListener("click", () => {
    if (!previewObject) return;
    if (currentMode === "road") return;

    const placed = previewObject.clone();
    placed.material = previewObject.material.clone();
    placed.material.opacity = 1;
    placed.material.transparent = false;

    scene.add(placed);
});
