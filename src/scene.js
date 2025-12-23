import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaec6cf);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    1,
    1000
);
camera.position.set(8, 8, 8);
// camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);

const groundGeo = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x4caf50 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const directLight = new THREE.DirectionalLight(0xffffff, 0.8);
directLight.position.set(10, 20, 10);
scene.add(directLight);

// Di Bantu GPT (Nanti dibuang)
// ROAD SYSTEM (Tile-based)
const roadGroup = new THREE.Group();
scene.add(roadGroup);

const roadTileSize = 2;
const roadMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
// Material Jalur Putih
const whiteRoadMat = new THREE.MeshStandardMaterial({ color: 0xffffff }); 

// Fungsi bikin jalan
function createRoadTile(x, z, material) {
  const geo = new THREE.BoxGeometry(roadTileSize, 0.1, roadTileSize);
  const tile = new THREE.Mesh(geo, material);
  tile.position.set(x, 0.007, z);
  roadGroup.add(tile); // Tetap masukkan ke roadGroup yang SAMA
}

// 1. Buat Jalur Hitam (Berangkat) - Posisi Z = 0
for (let i = -4; i <= 4; i++) {
  createRoadTile(i * roadTileSize, 0, roadMat);
}

// Di Bantu GPT
// Setup Sensor
const raycaster = new THREE.Raycaster();
const downVector = new THREE.Vector3(0, -1, 0); // Arah sensor ke bawah

// Setup Gerak
let direction = 1; // 1 = Kanan, -1 = Kiri

const loader = new GLTFLoader();
let speed = 0.05;

// CAR LOADER
// Variable global untuk mobil bawah saja
let car; 

// --- LOAD MOBIL BAWAH (INDUK) ---
loader.load('./assets_car/RX-7.glb', (gltf) => {
    car = gltf.scene;
    car.scale.set(0.5, 0.5, 0.5);
    car.position.set(-6, 0.05, -0.5);
    car.rotation.y = Math.PI/2;
    
    scene.add(car); // Mobil bawah masuk ke Scene (Dunia)
    // --- LOAD MOBIL ATAS (ANAK) - DI DALAM SINI ---
    loader.load('./assets_car/Skyline.glb', (gltf2) => {
        const car2 = gltf2.scene;
        
        // 1. Atur Ukuran (Mungkin dikecilin dikit biar lucu)
        car2.scale.set(0.8, 0.8, 0.8); 

        // 2. Atur Rotasi (Biasanya harus di-nol-kan karena ngikut induk)
        car2.rotation.y = 0; 

        // 3. Atur Posisi (Relatif terhadap Mobil Bawah)
        // x=0, z=0 artinya pas di tengah atap mobil bawah.
        // y=2 (atau sesuaikan) biar naik ke atas.
        car2.position.set(0, 0.65, -8); 
        
        // 4. KUNCI STACKING: Masukkan ke car1, BUKAN ke scene
        car.add(car2); 
    });

}, undefined, (error) => console.error(error));

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render loop
function draw() {
  requestAnimationFrame(draw);
  // Di Bantu GPT
  if (car) {
    // 1. Update Posisi Sensor
    // Sensor ditaruh agak depan (offset 1) sesuai arah mobil
    const sensorOffset = 1.0; 
    const sensorPosition = new THREE.Vector3();
    sensorPosition.copy(car.position);
    sensorPosition.x += sensorOffset * direction;
    sensorPosition.y += 1; // Naikkan sedikit

    // 2. Tembak Raycaster ke bawah
    raycaster.set(sensorPosition, downVector);
    const intersects = raycaster.intersectObjects(roadGroup.children);

    // 3. Logika Gerak (tambah yang puter balik ada animasinya)
    if (intersects.length > 0) {
      // --- KONDISI: ADA JALAN ---
      // Mobil lanjut jalan
      car.position.x += speed * direction;
      
    } else {
      // --- KONDISI: UJUNG JALAN (PUTAR BALIK DI JALAN YG SAMA) ---
      // Cek arah mobil sekarang
      if (direction === 1) {
        // >> LAGI JALAN KE KANAN, MAU PUTER BALIK KE KIRI <<
        // 1. Geser ke lajur seberang (z = 0.5)
        car.position.z = 0.5; 
        // 2. Putar badan
        car.rotation.y = -Math.PI/2; 
        // 3. Ubah arah
        direction = -1;

      } else {
        // >> LAGI JALAN KE KIRI, MAU PUTER BALIK KE KANAN <<
        // 1. Geser balik ke lajur awal (z = -0.5)
        car.position.z = -0.5;
        // 2. Putar badan
        car.rotation.y = Math.PI/2;
        // 3. Ubah arah
        direction = 1;
      }
    }
  }
  renderer.render(scene, camera);
}
draw();