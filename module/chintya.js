import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadChintyaEnvironment(scene) {
    const loader = new GLTFLoader();

    let cloud = null;
    loader.load("/models/Cloud.glb", (gltf) => {
        cloud = gltf.scene;
        cloud.position.set(-20, 30, 5);
        cloud.scale.set(5, 2, 5);

        cloud.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });

        scene.add(cloud);
    });

    /* --- GRASS TEXTURES --- */
    const textureLoader = new THREE.TextureLoader();

    const grass_color = textureLoader.load(
        "/textures/Grass005/Grass005_4K-JPG_Color.jpg",
    );

    const grass_normal = textureLoader.load(
        "/textures/Grass005/Grass005_4K-JPG_NormalGL.jpg",
    );

    const grass_roughness = textureLoader.load(
        "/textures/Grass005/Grass005_4K-JPG_Roughness.jpg",
    );

    const c_matParkGrass = new THREE.MeshStandardMaterial({
        color: 0x85bd7d,
        map: grass_color,
        normalMap: grass_normal,
        roughnessMap: grass_roughness,
        roughness: 1,
        metalness: 0,
    });

    const c_meshParkGrass = new THREE.Mesh(
        new THREE.PlaneGeometry(28, 27),
        c_matParkGrass,
    );

    c_meshParkGrass.position.set(-25, 0.5, -25);
    c_meshParkGrass.rotation.x = -Math.PI / 2;
    c_meshParkGrass.receiveShadow = true;
    c_meshParkGrass.castShadow = true;
    scene.add(c_meshParkGrass);

    const c_basePlane = new THREE.Mesh(
        new THREE.PlaneGeometry(48, 48, 1),
        c_matParkGrass,
    );

    c_basePlane.position.set(-25, 0.05, -25);
    c_basePlane.rotation.x = -Math.PI / 2;
    c_basePlane.receiveShadow = true;
    c_basePlane.castShadow = true;
    scene.add(c_basePlane);

    const c_parkExtPath = new THREE.Mesh(
        new THREE.BoxGeometry(32, 0.5, 32),
        new THREE.MeshLambertMaterial({ color: 0xa3a3a3 }),
    );

    c_parkExtPath.position.set(-25, -0.1, -25);
    c_parkExtPath.receiveShadow = true;
    c_parkExtPath.castShadow = true;
    scene.add(c_parkExtPath);

    loader.load("/models/Park/Fountain.glb", (gltf) => {
        const model = gltf.scene;
        model.position.set(-25, 1.3, -25);
        model.scale.set(7, 7, 7);

        model.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });

        scene.add(model);
    });

    const c_trees = [
        { pos: { x: -20, y: 3.3, z: -30 }, scale: 3 },
        { pos: { x: -30, y: 4.6, z: -35 }, scale: 4 },
        { pos: { x: -20, y: 4.6, z: -20 }, scale: 4 },
        { pos: { x: -14, y: 4, z: -13 }, scale: 3 },
        { pos: { x: -29, y: 4, z: -16 }, scale: 3 },
        { pos: { x: -36, y: 4.6, z: -30 }, scale: 4 },
        { pos: { x: -13, y: 4, z: -36 }, scale: 3 },
    ];

    loader.load("/models/CityPack/Tree.glb", (gltf) => {
        const model = gltf.scene;

        c_trees.forEach((data) => {
            const tree = model.clone();

            tree.position.set(data.pos.x, data.pos.y, data.pos.z);
            tree.scale.set(data.scale, data.scale, data.scale);

            tree.traverse((obj) => {
                if (obj.isMesh) {
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                }
            });

            scene.add(tree);
        });
    });

    loader.load("/models/Park/Bench.glb", (gltf) => {
        const model = gltf.scene;

        model.position.set(-25, 0.8, -20);
        model.rotation.y = Math.PI;
        model.scale.set(0.5, 0.5, 0.5);

        model.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });

        scene.add(model);
    });

    loader.load("/models/CityPack/Fence-End.glb", (gltf) => {
        const model = gltf.scene;
        // model.position.set/(-30, 0, -30);
        // scene.add(model);

        let x = -38;
        let z = -38;
        let n = 26;
        // top edge
        for (let i = 0; i <= n; i++) {
            if (i == n / 2) {
                continue;
            }
            const fence = model.clone();
            fence.position.set(x + i, 0.5, z);
            fence.receiveShadow = true;
            fence.castShadow = true;
            scene.add(fence);
        }

        // // bottom edge
        for (let i = 0; i <= n; i++) {
            if (i == n / 2) {
                continue;
            }
            const fence = model.clone();
            fence.position.set(x + i, 0.5, z + n);
            fence.receiveShadow = true;
            fence.castShadow = true;
            scene.add(fence);
        }

        // left edge
        for (let i = 1; i < n + 1; i++) {
            if (i == n / 2) {
                continue;
            }
            const fence = model.clone();
            fence.position.set(x - 0.5, 0.5, z + i - 0.5);
            fence.rotation.y = Math.PI / 2;
            fence.receiveShadow = true;
            fence.castShadow = true;
            scene.add(fence);
        }

        // right edge
        for (let i = 1; i < n + 1; i++) {
            if (i == n / 2) {
                continue;
            }
            const fence = model.clone();
            fence.position.set(x + n + 2 - 1.5, 0.5, z + i - 0.5);
            fence.rotation.y = -Math.PI / 2;
            fence.receiveShadow = true;
            fence.castShadow = true;
            scene.add(fence);
        }
    });

    loader.load("/models/Building B.glb", (gltf) => {
        const model = gltf.scene;

        for (let i = 0; i <= 6; i++) {
            const building = model.clone();

            building.position.set(-40 + i * 5, 0, -46);
            building.scale.set(1.5, 1.5, 1.5);

            building.traverse((obj) => {
                if (obj.isMesh) {
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                }
            });

            scene.add(building);
        }
    });
}
