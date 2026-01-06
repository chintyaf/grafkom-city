// src/road-mode.js
import { loadTilesObject } from "./function.js";

// State untuk menyimpan pilihan user
let currentRoadType = "road_straight";
let currentDirection = "front"; // front, right, back, left

// Daftar tipe jalan yang tersedia di GLB
const ROAD_TYPES = [
    { name: "Straight", type: "road_straight" },
    { name: "Corner", type: "road_corner" },
    { name: "T-Split", type: "road_tsplit" },
    { name: "Intersection", type: "road_junction" }
];

// Setup UI khusus Mode Road
export function modeRoad(tiles, scene) {
    const uiContainer = document.getElementById("object-buttons");
    const statusDiv = document.getElementById("status");
    
    // Reset UI
    uiContainer.innerHTML = "";
    updateStatus(statusDiv);

    // 1. Buat Tombol ROTATE
    const btnRotate = document.createElement("button");
    btnRotate.innerText = "🔄 Rotate: " + currentDirection;
    btnRotate.className = "mode-btn";
    btnRotate.style.marginBottom = "10px";
    btnRotate.style.backgroundColor = "#ffc107";
    btnRotate.style.color = "black";
    
    btnRotate.onclick = () => {
        cycleDirection();
        btnRotate.innerText = "🔄 Rotate: " + currentDirection;
        updateStatus(statusDiv);
    };
    uiContainer.appendChild(btnRotate);
    uiContainer.appendChild(document.createElement("br"));

    // 2. Buat Tombol Tipe Jalan
    ROAD_TYPES.forEach((road) => {
        const btn = document.createElement("button");
        btn.innerText = road.name;
        btn.className = "obj-btn";
        if (currentRoadType === road.type) btn.style.border = "2px solid lime";

        btn.onclick = () => {
            currentRoadType = road.type;
            
            // Visual feedback tombol aktif
            const allBtns = document.querySelectorAll(".obj-btn");
            allBtns.forEach(b => b.style.border = "1px solid #ccc");
            btn.style.border = "2px solid lime";
            
            updateStatus(statusDiv);
        };
        uiContainer.appendChild(btn);
    });
}

// Fungsi helper untuk memutar arah
function cycleDirection() {
    const dirs = ["front", "right", "back", "left"];
    let idx = dirs.indexOf(currentDirection);
    idx = (idx + 1) % dirs.length;
    currentDirection = dirs[idx];
}

function updateStatus(el) {
    el.innerText = `Mode: Road | Type: ${currentRoadType} | Dir: ${currentDirection}`;
}

// Fungsi yang dipanggil saat user klik Tile di Main.js
export function placeRoad(tile, scene, tiles) {
    // Set data tile
    tile.userData.isEmpty = false;
    tile.userData.object = "roads";
    
    // Simpan tipe spesifik yang dipilih user (manual override)
    tile.userData.specificType = currentRoadType; 
    tile.userData.direction = currentDirection;

    // Bersihkan objek lama di tile ini jika ada
    if (tile.userData.instance.length > 0) {
        tile.userData.instance.forEach(obj => scene.remove(obj));
        tile.userData.instance = [];
    }

    // Load ulang visual
    loadTilesObject(tiles, scene);
}