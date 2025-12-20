import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ============================================
// KONFIGURASI
// ============================================
const GRID_SIZE = 20;        // 20x20 tiles (bisa ganti jadi 10)
const TILE_SIZE = 2;         // Ukuran satu tile
const COLOR_GROUND = 0x8B7355;      // Coklat tanah
const COLOR_HOVER = 0xFFFFAA;       // Kuning saat hover
const COLOR_SELECTED = 0x00FF00;    // Hijau saat diklik

// ============================================
// SETUP SCENE, CAMERA, RENDERER
// ============================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(25, 30, 25);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// ============================================
// ORBIT CONTROLS
// ============================================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2.5; // Limit rotasi bawah

// ============================================
// LIGHTING
// ============================================
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Directional Light (matahari)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(50, 50, 50);
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
scene.add(directionalLight);

// ============================================
// TEXTURE LOADER (RUMPUT(GRASS))
// ============================================
const grass_texture = new THREE.TextureLoader().load(
    "./assets/textures/Grass005/Grass005.png"
);

// ============================================
// CREATE GRID (LAHAN KOTA)
// ============================================
const tiles = [];           // Array untuk simpan semua tile
const tileMap = new Map();  // Map untuk akses tile by koordinat

function createGrid() {
    const totalSize = GRID_SIZE * TILE_SIZE;
    const offset = totalSize / 2 - TILE_SIZE / 2;
    
    // 1. Buat Ground Plane besar (base)
    const groundGeo = new THREE.PlaneGeometry(totalSize, totalSize);
    const groundMat = new THREE.MeshStandardMaterial({ 
        // map: grass_texture,
        color: COLOR_GROUND,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = -0.01;
    scene.add(ground);
    
    // 2. Buat individual tiles
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let z = 0; z < GRID_SIZE; z++) {
            // Geometry tile
            const tileGeo = new THREE.PlaneGeometry(TILE_SIZE - 0.1, TILE_SIZE - 0.1);
            const tileMat = new THREE.MeshStandardMaterial({ 
                // map: grass_texture,

                color: COLOR_GROUND,
                roughness: 0.6,
                metalness: 0.1
            });
            
            const tile = new THREE.Mesh(tileGeo, tileMat);
            tile.rotation.x = -Math.PI / 2;
            tile.position.x = x * TILE_SIZE - offset;
            tile.position.z = z * TILE_SIZE - offset;
            tile.position.y = 0;
            tile.receiveShadow = true;
            
            // Simpan data tile
            tile.userData = {
                gridX: x,
                gridZ: z,
                isEmpty: true,
                object: null,
                originalColor: COLOR_GROUND
            };
            
            scene.add(tile);
            tiles.push(tile);
            tileMap.set(`${x},${z}`, tile);
            
            // Buat border tile (garis grid)
            // const edges = new THREE.EdgesGeometry(tileGeo);
            // const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 });
            // const line = new THREE.LineSegments(edges, lineMat);
            // line.rotation.x = -Math.PI / 2;
            // line.position.copy(tile.position);
            // line.position.y += 0.01;
            // scene.add(line);
        }
    }
    
}

createGrid();

// ============================================
// RAYCASTER untuk KLIK & HOVER
// ============================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredTile = null;
let selectedTile = null;

// Mouse Move (untuk hover)
window.addEventListener('mousemove', (event) => {
    // Convert mouse ke normalized coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Check intersections
    const intersects = raycaster.intersectObjects(tiles);
    
    // Reset tile sebelumnya
    if (hoveredTile && hoveredTile !== selectedTile) {
        hoveredTile.material.color.setHex(hoveredTile.userData.originalColor);
    }
    
    // Highlight tile baru
    if (intersects.length > 0) {
        const tile = intersects[0].object;
        
        if (tile !== selectedTile) {
            hoveredTile = tile;
            tile.material.color.setHex(COLOR_HOVER);
        }
        
        // Update UI info
        updateTileInfo(tile);
    } else {
        hoveredTile = null;
        updateTileInfo(null);
    }
});

// Mouse Click (untuk select tile)
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(tiles);
    
    if (intersects.length > 0) {
        const tile = intersects[0].object;
        
        // Reset tile sebelumnya
        if (selectedTile) {
            selectedTile.material.color.setHex(selectedTile.userData.originalColor);
        }
        
        // Select tile baru
        selectedTile = tile;
        tile.material.color.setHex(COLOR_SELECTED);
    
    }
});

// Update UI dengan info tile
function updateTileInfo(tile) {
    const infoElement = document.getElementById('tile-info');
    
    if (tile) {
        const x = tile.userData.gridX;
        const z = tile.userData.gridZ;
        const status = tile.userData.isEmpty ? '✅ Kosong' : '❌ Terisi';
        
        infoElement.innerHTML = `
            <strong>Koordinat:</strong> (${x}, ${z})<br>
            <strong>Status:</strong> ${status}
        `;
    } else {
        infoElement.innerHTML = 'Hover mouse untuk melihat tile';
    }
}

// ============================================
// WINDOW RESIZE
// ============================================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// ANIMATION LOOP
// ============================================
function animate() {
    requestAnimationFrame(animate);
    
    controls.update();
    renderer.render(scene, camera);
}

animate();

