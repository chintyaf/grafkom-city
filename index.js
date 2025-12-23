import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ============================================
// KONFIGURASI
// ============================================
const GRID_SIZE = 20;        // 20x20 tiles 
const TILE_SIZE = 2;         // Ukuran satu tile

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

camera.position.set(20, 20, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ============================================
// ORBIT CONTROLS
// ============================================
const controls = new OrbitControls(camera, renderer.domElement);

// ============================================
// LIGHTING
// ============================================
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Directional Light (matahari)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(50, 50, 50);

scene.add(directionalLight);

// ============================================
// TEXTURE LOADER (RUMPUT(GRASS))
// ============================================
const textureLoader = new THREE.TextureLoader();

const grass_color = textureLoader.load("./assets/textures/Grass005/Grass005_4K-JPG_Color.jpg");
const grass_normal = textureLoader.load("./assets/textures/Grass005/Grass005_4K-JPG_NormalGL.jpg");
const grass_roughness = textureLoader.load("./assets/textures/Grass005/Grass005_4K-JPG_Roughness.jpg");
const grass_ao = textureLoader.load("./assets/textures/Grass005/Grass005_4K-JPG_AmbientOcclusion.jpg");

// ============================================
// CREATE GRID (LAHAN KOTA)
// ============================================
const tiles = [];      
// const tileMap = new Map(); ganti stack aja

// GPT HELP ME TO CREATE THIS FUNCTION
function createGrid() {
    const totalSize = GRID_SIZE * TILE_SIZE;
    const offset = totalSize / 2 - TILE_SIZE / 2;
    
    // 1. Buat Ground Plane besar (base)
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
    // ground.receiveShadow = true;
    ground.position.y = -0.01;
    scene.add(ground);
    
    // 2. Buat individual tiles PAKE GPT
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let z = 0; z < GRID_SIZE; z++) {
            // Geometry tile
            const tileGeo = new THREE.PlaneGeometry(TILE_SIZE , TILE_SIZE  );
            const tileMat = new THREE.MeshStandardMaterial({ 
                map: grass_color,
                normalMap: grass_normal,
                roughnessMap: grass_roughness,
                aoMap: grass_ao,
                side: THREE.DoubleSide,
            });
            
            const tile = new THREE.Mesh(tileGeo, tileMat);
            tile.rotation.x = -Math.PI / 2;
            tile.position.x = x * TILE_SIZE - offset;
            tile.position.z = z * TILE_SIZE - offset;
            tile.position.y = 0.02;
            tile.receiveShadow = true;
            
            // Simpan data tile
            tile.userData = {
                gridX: x,
                gridZ: z,
                isEmpty: true,
                object: null, // buat taruh barang nanti
                originalColor: grass_color 
            };
            
            scene.add(tile);
            tiles.push(tile);
            // tileMap.set(`${x},${z}`, tile);

        }
    }
    
}

createGrid();

// ============================================
// RAYCASTER untuk KLIK
// ============================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedTile = null;

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
            // selectedTile.material.color.set(0x000000);
            selectedTile.material.emissive.setHex(0x000000);
        }

        selectedTile = tile;
        // tile.material.color.set(0x003300);
        tile.material.emissive.setHex(0x003300); // hijau
    }
});

function animate() {
    requestAnimationFrame(animate);
    
    controls.update();
    renderer.render(scene, camera);
}

animate();

