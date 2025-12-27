import * as THREE from "three";

// ============================================
// CREATE GRID (LAHAN KOTA)
// ============================================

// const tileMap = new Map(); ganti stack aja

// GPT HELP ME TO CREATE THIS FUNCTION
export function createPlane(scene, GRID_SIZE, TILE_SIZE) {

    // ============================================
    // TEXTURE LOADER (RUMPUT(GRASS))
    // ============================================
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

    const tiles = [];

    const totalSize = GRID_SIZE * TILE_SIZE;
    const offset = totalSize / 2 - TILE_SIZE / 2;

    // 1. Buat Ground Plane besar (base)
    const groundGeo = new THREE.PlaneGeometry(totalSize, totalSize);
    const groundMat = new THREE.MeshStandardMaterial({
        // color: 0xffffff,
        map: grass_color,
        normalMap: grass_normal,
        roughnessMap: grass_roughness,
        aoMap: grass_ao,
        side: THREE.DoubleSide,
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
            const tileGeo = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
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
            tile.castShadow = true;

            // Simpan data tile
            tile.userData = {
                gridX: x,
                gridZ: z,
                isEmpty: true,
                object: null, // buat taruh barang nanti
                originalColor: grass_color,
            };

            scene.add(tile);
            tiles.push(tile);
            // tileMap.set(`${x},${z}`, tile);
        }
    }
    return tiles;
}
