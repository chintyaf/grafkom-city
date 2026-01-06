import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GRID_SIZE } from "./main.js";

// --- KONFIGURASI ---
const CAR_SPEED = 1;
const ROTATION_SPEED = 3.0;
const CAR_SCALE = 0.15;

// --- STATE ---
let masterCar = null; // Induk mobil
const cars = [];      // Stack (tumpukan) anak mobil yang aktif
let spawnTimer = 0;   // Timer untuk optimasi spawn

// --- LOAD MASTER ASSET (INDUK) ---
// Pastikan file Dodge.glb ada di folder: public/cars/
const loader = new GLTFLoader();
loader.load('./public/cars/Skyline.glb', (gltf) => {
    masterCar = gltf.scene;
    
    // Setup standar model
    masterCar.scale.set(CAR_SCALE, CAR_SCALE, CAR_SCALE);
    masterCar.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    // Posisi default
    masterCar.position.set(-0.25, 0.15, 0);
    
    console.log("Induk mobil berhasil dimuat!");
}, undefined, (error) => {
    console.error("Gagal memuat mobil:", error);
});


// --- CLASS MOBIL (ANAK) ---
class Car {
    constructor(startTile, scene) {
        this.scene = scene;
        this.currentTile = startTile;
        this.nextTile = null;
        this.previousTile = null; // Agar tidak bolak-balik (kecuali mentok)

        // Container Mobil
        this.mesh = new THREE.Group();

        // Clone dari Induk
        if (masterCar) {
            const carBody = masterCar.clone();
            
            // FIX ROTASI: Mobil biasanya menghadap sumbu X, kita putar ke Z
            // Kalau mobilnya jalan menyamping (ngesot), ubah nilai ini!
            // Coba: -Math.PI/2, Math.PI, atau 0
            carBody.rotation.y = Math.PI; 

            this.mesh.add(carBody);
        } else {
            // Fallback: Kotak Merah jika belum load
            const geo = new THREE.BoxGeometry(0.5, 0.5, 1);
            const mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            this.mesh.add(new THREE.Mesh(geo, mat));
        }

        // Set posisi awal
        this.mesh.position.copy(startTile.position);
        this.mesh.position.y = 0.25; // Sedikit di atas aspal

        // Target Pergerakan
        this.targetPos = startTile.position.clone();
        this.targetPos.y = 0.05;

        this.scene.add(this.mesh);
        
        // Cari tujuan awal
        this.decideNextMove();
    }

    update(delta, tiles) {
        if (!this.mesh) return;

        const dist = this.mesh.position.distanceTo(this.targetPos);

        // 1. Bergerak menuju target (Tengah Tile)
        if (dist > 0.1) {
            const direction = new THREE.Vector3()
                .subVectors(this.targetPos, this.mesh.position)
                .normalize();
            
            // Gerak
            this.mesh.position.add(direction.multiplyScalar(CAR_SPEED * delta));

            // Rotasi Halus (Slerp)
            const targetRot = new THREE.Quaternion();
            const lookMatrix = new THREE.Matrix4();
            lookMatrix.lookAt(this.mesh.position, this.targetPos, new THREE.Vector3(0, 1, 0));
            targetRot.setFromRotationMatrix(lookMatrix);
            
            this.mesh.quaternion.slerp(targetRot, ROTATION_SPEED * delta);

        } else {
            // 2. Sampai di tengah tile -> Tentukan langkah berikutnya
            this.mesh.position.copy(this.targetPos); // Snap posisi
            this.currentTile = this.nextTile || this.currentTile;
            this.decideNextMove(tiles);
        }
    }

    decideNextMove(tiles) {
        if (!tiles) return;

        const idx = this.currentTile.userData.index;
        
        // Cek 4 Arah Tetangga: [Atas, Kanan, Bawah, Kiri]
        const neighborsIdx = [idx - GRID_SIZE, idx + 1, idx + GRID_SIZE, idx - 1];
        const validRoads = [];

        neighborsIdx.forEach(nIdx => {
            if (nIdx >= 0 && nIdx < tiles.length) {
                const neighbor = tiles[nIdx];
                // Syarat: Harus Jalan ("roads")
                if (neighbor.userData.object === "roads") {
                    validRoads.push(neighbor);
                }
            }
        });

        if (validRoads.length > 0) {
            // Filter: Hindari kembali ke tile sebelumnya (agar mobil maju terus)
            let options = validRoads.filter(t => t !== this.previousTile);

            if (options.length === 0) {
                // JALAN BUNTU (Dead End) -> Terpaksa putar balik
                options = validRoads; 
            }

            // Pilih acak dari opsi yang tersedia
            const chosen = options[Math.floor(Math.random() * options.length)];
            
            // Simpan state
            this.previousTile = this.currentTile;
            this.nextTile = chosen;
            
            // Set Target Posisi Baru
            this.targetPos.x = chosen.position.x;
            this.targetPos.z = chosen.position.z;
        }
    }
}


// --- LOGIKA GROUPING JALAN (Connected Components) ---
function getRoadGroups(tiles) {
    const visited = new Set();
    const groups = [];
    const roadTiles = tiles.filter(t => t.userData.object === "roads");

    for (let tile of roadTiles) {
        if (!visited.has(tile.userData.index)) {
            const group = [];
            const stack = [tile]; // Stack untuk DFS/BFS
            visited.add(tile.userData.index);

            while (stack.length > 0) {
                const current = stack.pop();
                group.push(current);

                // Cek tetangga fisik
                const idx = current.userData.index;
                const neighbors = [idx - GRID_SIZE, idx + 1, idx + GRID_SIZE, idx - 1];

                for (let nIdx of neighbors) {
                    if (nIdx >= 0 && nIdx < tiles.length) {
                        const neighbor = tiles[nIdx];
                        if (neighbor.userData.object === "roads" && !visited.has(nIdx)) {
                            visited.add(nIdx);
                            stack.push(neighbor);
                        }
                    }
                }
            }
            groups.push(group);
        }
    }
    return groups;
}


// --- FUNGSI UTAMA (Dipanggil di main.js) ---
export function updateCars(tiles, scene, delta) {
    if (!masterCar) return; // Tunggu induk loading

    spawnTimer += delta;

    // 1. Logic Spawn (Jalan setiap 1 detik)
    if (spawnTimer > 1.0) {
        spawnTimer = 0;

        // Kelompokkan jalan yang menyambung
        const roadGroups = getRoadGroups(tiles);

        roadGroups.forEach(group => {
            // ATURAN: 1 mobil per 4 jalan
            const allowedCars = Math.floor(group.length / 4);

            let carsInGroup = 0;
            cars.forEach(car => {
                if (group.includes(car.currentTile) || group.includes(car.nextTile)) {
                    carsInGroup++;
                }
            });

            if (carsInGroup < allowedCars) {
                const randomTile = group[Math.floor(Math.random() * group.length)];
                const newCar = new Car(randomTile, scene);
                cars.push(newCar);
            }
        });

        // Hapus mobil jika jalannya hilang (dihapus user)
        for (let i = cars.length - 1; i >= 0; i--) {
            const car = cars[i];
            if (car.currentTile.userData.object !== "roads") {
                scene.remove(car.mesh);
                cars.splice(i, 1);
            }
        }
    }

    // 2. Update Gerakan Semua Mobil
    cars.forEach(car => car.update(delta, tiles));
}