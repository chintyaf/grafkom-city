import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ============================================
// 1. KONFIGURASI
// ============================================
const GRID_SIZE = 20;       // 20x20 tiles (bisa ganti jadi 10)
const TILE_SIZE = 2;        // Ukuran satu tile
const COLOR_ROAD = 0x333333; // Warna aspal
const COLOR_GROUND = 0x8B7355;      // Coklat tanah
const COLOR_HOVER = 0xFFFFAA;       // Kuning saat hover
const COLOR_SELECTED = 0x00FF00;    // Hijau saat diklik

// State (GPT)
const state = {
    currentMode: 'road', 
    currentObject: null, 
    rotation: 0 // 0 - 3
};

const assets = {
    road: [
        { id: 'straight', name: 'Straight', type: 'procedural' },
        { id: 'corner', name: 'Corner', type: 'procedural' }
    ],
    building: [
        { id: 'house', name: 'House', type: 'placeholder' },
        { id: 'shop', name: 'Shop', type: 'placeholder' }
    ],
    nature: [
        { id: 'tree', name: 'Tree', type: 'placeholder' }
    ]
};

// ============================================
// 2. SCENE SETUP
// ============================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);   // Sky blue

const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000);
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

/// ============================================
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
// TEXTURE LOADER
// ============================================
const textureLoader = new THREE.TextureLoader();

const grass_color = textureLoader.load('./assets/textures/Grass005/Grass005_4K-JPG_Color.jpg');
const grass_normal = textureLoader.load('./assets/textures/Grass005/Grass005_4K-JPG_NormalGL.jpg');
const grass_roughness = textureLoader.load('./assets/textures/Grass005/Grass005_4K-JPG_Roughness.jpg');
const grass_ao = textureLoader.load('./assets/textures/Grass005/Grass005_4K-JPG_AmbientOcclusion.jpg');

// Setting agar texture mengulang (tiling)
// [grass_color, grass_normal, grass_roughness, grass_ao].forEach(tex => {
//     if(tex) {
//         tex.wrapS = THREE.RepeatWrapping;
//         tex.wrapT = THREE.RepeatWrapping;
//         tex.repeat.set(GRID_SIZE/2, GRID_SIZE/2);
//     }
// });

// ============================================
// CREATE GRID (LAHAN KOTA)
// ============================================
const tiles = [];           // Array untuk simpan semua tile
const tileMap = new Map();  // Map untuk akses tile by koordinat

function createGrid() {
    const totalSize = GRID_SIZE * TILE_SIZE;
    const offset = totalSize / 2 - TILE_SIZE / 2;

    // 1. Ground Plane Besar (Base Rumput)
    const groundGeo = new THREE.PlaneGeometry(totalSize, totalSize);
    const groundMat = new THREE.MeshStandardMaterial({ 
        map: grass_color,
        normalMap: grass_normal,
        roughnessMap: grass_roughness,
        aoMap: grass_ao,
        side: THREE.DoubleSide
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = -0.01;
    scene.add(ground);

    // 2. Individual Tiles (Invisible interactors)
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let z = 0; z < GRID_SIZE; z++) {
            const tileGeo = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
            // Material transparan penuh
            const tileMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0.0,
                side: THREE.DoubleSide
            });
            
            const tile = new THREE.Mesh(tileGeo, tileMat);
            tile.rotation.x = -Math.PI / 2;
            tile.position.x = x * TILE_SIZE - offset;
            tile.position.z = z * TILE_SIZE - offset;
            tile.position.y = 0.01; // Sedikit diatas tanah
            
            tile.userData = {
                gridX: x, gridZ: z,
                isEmpty: true, object: null,
                isRoad: false, roadType: null, rotation: 0
            };
            
            scene.add(tile);
            tiles.push(tile);
        }
    }};
createGrid();

// ============================================
// ROAD GENERATOR (Tile Hitam)
// ============================================
function createRoadMesh(type) {
    const group = new THREE.Group();

    // Aspal
    const asphaltGeo = new THREE.BoxGeometry(TILE_SIZE, 0.1, TILE_SIZE);
    const asphaltMat = new THREE.MeshStandardMaterial({ color: COLOR_ROAD }); 
    const asphalt = new THREE.Mesh(asphaltGeo, asphaltMat);
    asphalt.receiveShadow = true;
    asphalt.position.y = 0.05;
    group.add(asphalt);

    // Marka
    const markerMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    if (type === 'straight') {
        const lineGeo = new THREE.BoxGeometry(0.3, 0.12, TILE_SIZE * 0.8);
        const line = new THREE.Mesh(lineGeo, markerMat);
        line.position.y = 0.06;
        group.add(line);
    } else if (type === 'corner') {
        const vGeo = new THREE.BoxGeometry(0.3, 0.12, TILE_SIZE / 1.8);
        const vLine = new THREE.Mesh(vGeo, markerMat);
        vLine.position.z = -TILE_SIZE / 4; vLine.position.y = 0.06;
        group.add(vLine);

        const hGeo = new THREE.BoxGeometry(TILE_SIZE / 1.8, 0.12, 0.3);
        const hLine = new THREE.Mesh(hGeo, markerMat);
        hLine.position.x = TILE_SIZE / 4; hLine.position.y = 0.06;
        group.add(hLine);
    }
    return group;
};




// ============================================
// LOGIC & INTERACTION (GPT)
// ============================================
let previewObject = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredTile = null;
let selectedTile = null;

function performRotation() {
    state.rotation = (state.rotation + 1) % 4;

    // Update Text Button
    const btn = document.getElementById('btn-rotate');
    if(btn) btn.innerText = `Rotate: ${state.rotation * 90}°`;

    // Update Preview Instant
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(tiles);
    if (intersects.length > 0) updatePreview(intersects[0].object);
};

function updatePreview(tile) {
    if (!state.currentObject) return;

    // Recreate Preview if type changed or null
    if (!previewObject || previewObject.userData.type !== state.currentObject) {
        if(previewObject) scene.remove(previewObject);
        
        if (state.currentMode === 'road') {
            previewObject = createRoadMesh(state.currentObject);
        } else {
            // Placeholder box for other modes
            const geo = new THREE.BoxGeometry(1, 1, 1);
            const mat = new THREE.MeshBasicMaterial({color: 0x0000ff});
            previewObject = new THREE.Mesh(geo, mat);
        }
        
        previewObject.userData.type = state.currentObject;
        previewObject.traverse(c => {
            if(c.isMesh) {
                c.material = c.material.clone();
                c.material.transparent = true;
                c.material.opacity = 0.5;
            }
        });
        scene.add(previewObject);
    }

    if (tile && tile.userData.isEmpty) {
        previewObject.visible = true;
        previewObject.position.copy(tile.position);
        previewObject.position.y = 0;
        previewObject.rotation.y = state.rotation * -(Math.PI / 2);
    } else {
        previewObject.visible = false;
    }
};

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
        updatePreview(tile);
        tile.material.opacity = 0.3; // Highlight grid
        // Reset others
        tiles.forEach(t => { 
            if(t !== tile){
                t.material.opacity = 0.0;
            }
        });
    } else {
        if(previewObject) previewObject.visible = false;
        tiles.forEach(t => t.material.opacity = 0.0);
    }
});

// Mouse Click (untuk select tile)
window.addEventListener('click', (event) => {
    if (event.target.closest('#ui')) return;
    if (!state.currentObject) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(tiles);

    if (intersects.length > 0) {
        const tile = intersects[0].object;
        if (tile.userData.isEmpty && state.currentMode === 'road') {
            const mesh = createRoadMesh(state.currentObject);
            mesh.position.copy(tile.position);
            mesh.position.y = 0;
            mesh.rotation.y = state.rotation * -(Math.PI / 2);
            
            scene.add(mesh);
            tile.userData.isEmpty = false;
            tile.userData.isRoad = true;
            tile.userData.object = mesh;

            tile.userData.roadType = state.currentObject; 
            tile.userData.rotation = state.rotation; // Simpan juga rotasi jalannya
            
            checkConnections();
        }
    }
});

// ============================================
// UI HANDLERS (GPT)
// ============================================
window.setMode = function(mode) {
    state.currentMode = mode;
    state.currentObject = null;
    if (previewObject) {
        scene.remove(previewObject);
        previewObject = null;
    }

    // Update UI Button Active State
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${mode}`).classList.add('active');

    // Generate Object Buttons
    const container = document.getElementById('object-buttons');
    container.innerHTML = '';

    const list = assets[mode] || [];
    list.forEach(asset => {
        const btn = document.createElement('button');
        btn.textContent = asset.name;
        btn.className = 'object-btn'; // Class asli
        btn.onclick = (e) => selectObject(asset.id, e);
        container.appendChild(btn);
    });

    // Tambah Tombol Rotate (Hanya di mode Road)
    if (mode === 'road') {
        const rotBtn = document.createElement('button');
        rotBtn.id = 'btn-rotate';
        rotBtn.className = 'rotate-btn'; // Class baru tp style mirip
        rotBtn.textContent = `Rotate: ${state.rotation * 90}°`;
        rotBtn.onclick = performRotation;
        container.appendChild(rotBtn);
    }

    updateStatus();
};

window.selectObject = function(id, event) {
    state.currentObject = id;
    document.querySelectorAll('.object-btn').forEach(b => b.classList.remove('active'));
    if(event) event.target.classList.add('active');
    updateStatus();
};

function updateStatus() {
    const statusEl = document.getElementById('status');
    const objName = state.currentObject ? state.currentObject : '-';
    statusEl.textContent = `Mode: ${state.currentMode} | Item: ${objName}`;
};

function checkConnections() {
    // 1. Reset perhitungan
    let roadTiles = tiles.filter(t => t.userData.isRoad);
    
    // Jika jalan kurang dari 3, jangan spawn
    if (roadTiles.length < 3) return;

    // 2. Algoritma mencari rantai jalan (Simplified)
    // Kita ambil tile jalan acak, cek apakah dia punya 2 tetangga jalan
    const randomStart = roadTiles[Math.floor(Math.random() * roadTiles.length)];
    
    // Cek tetangga (Atas, Bawah, Kiri, Kanan)
    const neighbors = [];
    const checkDir = [
        {x: 1, z: 0}, {x: -1, z: 0}, 
        {x: 0, z: 1}, {x: 0, z: -1}
    ];

    checkDir.forEach(d => {
        // Cari tile di posisi tersebut (secara kasar via posisi world)
        const targetPos = randomStart.position.clone().add(new THREE.Vector3(d.x * TILE_SIZE, 0, d.z * TILE_SIZE));
        
        // Cari di array tiles yang posisinya cocok (jarak dekat)
        const neighbor = roadTiles.find(t => t.position.distanceTo(targetPos) < 0.1);
        if (neighbor) {
            neighbors.push({tile: neighbor, dir: new THREE.Vector3(d.x, 0, d.z)});
        }
    });
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
const clock = new THREE.Clock(); // Tambahkan clock untuk delta time

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta(); // Waktu antar frame

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Init
window.onload = () => {
    setMode('road');
    // Auto click straight biar user langsung paham
    const btns = document.querySelectorAll('.object-btn');
    if(btns.length > 0) btns[0].click(); 
};