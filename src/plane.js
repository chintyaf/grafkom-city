import * as THREE from "three";

// const tileMap = new Map(); ganti stack aja

// GPT HELP ME TO CREATE THIS FUNCTION
function createPlane(scene, GRID_SIZE, TILE_SIZE) {
    const textureLoader = new THREE.TextureLoader();

    const grass_color = textureLoader.load(
        "/textures/Grass005/Grass005_4K-JPG_Color.jpg"
    );

    const grass_normal = textureLoader.load(
        "/textures/Grass005/Grass005_4K-JPG_NormalGL.jpg"
    );
    const grass_roughness = textureLoader.load(
        "/textures/Grass005/Grass005_4K-JPG_Roughness.jpg"
    );
    const grass_ao = textureLoader.load(
        "/textures/Grass005/Grass005_4K-JPG_AmbientOcclusion.jpg"
    );

    const totalSize = GRID_SIZE * TILE_SIZE;
    const offset = totalSize / 2 - TILE_SIZE / 2;

    // 1. Buat Ground Plane besar (base)
    const groundGeo = new THREE.PlaneGeometry(totalSize, totalSize);
    const groundMat = new THREE.MeshStandardMaterial({
        color: 0x85bd7d,
        // map: grass_color,
        // normalMap: grass_normal,
        // roughnessMap: grass_roughness,
        // aoMap: grass_ao,
        // side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    // ground.receiveShadow = true;
    ground.position.y = -0.01;
    scene.add(ground);

    // 2. Buat individual tiles
    const tiles = [];
    for (let z = 0; z < GRID_SIZE; z++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            // Geometry tile
            const tileGeo = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
            const tileMat = new THREE.MeshStandardMaterial({
                wireframe: true,
                color: 0x000000,
                // map: grass_color,
                // normalMap: grass_normal,
                // roughnessMap: grass_roughness,
                // aoMap: grass_ao,
                // side: THREE.DoubleSide,
            });

            const tile = new THREE.Mesh(tileGeo, tileMat);
            tile.rotation.x = -Math.PI / 2;
            tile.position.x = x * TILE_SIZE - offset;
            tile.position.z = z * TILE_SIZE - offset;
            tile.position.y = 0.02;
            tile.receiveShadow = true;
            tile.castShadow = true;

            // Simpan data menggunakan userData
            // GPT -> menyimpan informasi utk tile
            // Memudahkan untuk memodifikasi data atau me-select di tile tertentu
            tile.userData = {
                gridX: x,
                gridZ: z,
                isEmpty: true,

                object: null, // Bangunan yang akan dimasukkan
                direction: "right",
                scale: { x: 0.5, y: 0.5, z: 0.5 },

                originalColor: grass_color,
            };


            scene.add(tile);
            tiles.push(tile);
            // tileMap.set(`${x},${z}`, tile);
        }
    }
    return tiles;
}

export { createPlane };
