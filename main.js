import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// const ground = new THREE.Mesh(
//   new THREE.PlaneGeometry(98, 98),
//   new THREE.MeshStandardMaterial({ color: 0xffffff })
// )

// const canvas = document.createElement("canvas");
// canvas.width = 2;
// canvas.height = 2;

// const ctx = canvas.getContext("2d");

// // kotak kiri atas
// ctx.fillStyle = "#df2060ff"; // merah
// ctx.fillRect(0, 0, 1, 1);

// // kanan atas
// ctx.fillStyle = "#00ff00"; // hijau
// ctx.fillRect(1, 0, 1, 1);

// // kiri bawah
// ctx.fillStyle = "#0000ff"; // biru
// ctx.fillRect(0, 1, 1, 1);

// // kanan bawah
// ctx.fillStyle = "#ffff00"; // kuning
// ctx.fillRect(1, 1, 1, 1);

// // buat texture untuk Three.js
// const texture = new THREE.CanvasTexture(canvas);
// texture.magFilter = THREE.NearestFilter;
// texture.minFilter = THREE.NearestFilter;

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(98, 98),
    new THREE.MeshStandardMaterial({
        color: 0xffffff,
    })
);
ground.castShadow = true;
ground.receiveShadow = true;

ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);
camera.position.set(-50, 20, -50);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/* 
Lighting
 */

// const hemisphere = new THREE.HemisphereLight(0x00ff00, 0x00ffff, 0.5);
// hemisphere.position.set(0, 10, 0);
// scene.add(hemisphere);
// scene.add(new THREE.HemisphereLightHelper(hemisphere))

scene.add(new THREE.AmbientLight(0x404060, 0.4));

const hemi = new THREE.HemisphereLight(
    0xffffff, // sky
    0x4466aa, // ground (tints shadow)
    0.6
);
scene.add(hemi);

const geometry = new THREE.SphereGeometry(5, 15, 16);
const material = new THREE.MeshBasicMaterial({ color: 0xfcfce6 });
const sun_mesh = new THREE.Mesh(geometry, material);
sun_mesh.position.set(0, 100,0)
scene.add(sun_mesh);

const sun = new THREE.DirectionalLight(0xfcfbe6, 0.5);
sun.castShadow = true;
sun.receiveShadow = true;

// GPT
sun.position.set(20, 50, 0);
sun.target.position.set(0, 0, 0);

sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 100;

sun.shadow.camera.left = -50;
sun.shadow.camera.right = 50;
sun.shadow.camera.top = 100;
sun.shadow.camera.bottom = -50;

scene.add(sun.target);
scene.add(sun);
scene.add(new THREE.DirectionalLightHelper(sun));
scene.add(new THREE.CameraHelper(sun.shadow.camera));

const loader = new GLTFLoader();

loader.load("models/Road Bits.glb", (gltf) => {
    const roadBits = gltf.scene;
    roadBits.position.set(0, 0, 0);
    // scene.add(roadBits)
    gltf.scene.children.forEach((child, index) => {
        console.log(`Index ${index}: ${child.name}`);
        console.log("makan nasi", child.children);
        console.log(
            "makan nasi",
            child.children.find((c) => c.name === "road_corner")
        );
    });
    const road_corner = gltf.scene.children[0].children.find(
        (c) => c.name === "road_corner"
    );
    const road_corner_curved = gltf.scene.children[0].children.find(
        (c) => c.name === "road_corner_curved"
    );
    const road_straight = gltf.scene.children[0].children.find(
        (c) => c.name === "road_straight"
    );
    const road_junction = gltf.scene.children[0].children.find(
        (c) => c.name === "road_junction"
    );
    const road_straight_crossing = gltf.scene.children[0].children.find(
        (c) => c.name === "road_straight_crossing"
    );
    const road_tsplit = gltf.scene.children[0].children.find(
        (c) => c.name === "road_tsplit"
    );
    for (let i = -24; i <= 24; i++) {
        const road1 = road_straight.clone();
        road1.position.set(0, 0, i * 2); // z =2,4,6,8,10,12,14,16,18,20
        // road1.rotation.z = Math.PI / 2
        scene.add(road1);
    }

    // for (let i=1; i<=24; i++) {
    //   const road2 = road_straight.clone()
    //   road2.position.set(0, 0, -i*2) // z =2,4,6,8,10,12,14,16,18,20
    //   // road2.rotation.z = Math.PI / 2
    //   scene.add(road2)
    // }

    for (let i = -24; i <= 24; i++) {
        const road = road_straight.clone();
        road.position.set(i * 2, 0, 0); //x=2,4,6,8,10,12,14,16,18,20
        road.rotation.z = Math.PI / 2;
        scene.add(road);
    }
    const perempatan = road_junction.clone();
    perempatan.position.set(0, 0, 0);
    scene.add(perempatan);
    const road_pinggirbelok = road_corner.clone();
    road_pinggirbelok.position.set(22, 0, 0);
    road_pinggirbelok.rotation.z = -Math.PI / 2;
    scene.add(road_pinggirbelok);
    console.log(road_pinggirbelok);
});

// BRIGITTA
loader.load("/models/Traffic light.glb", (gltf) => {
    const traffic = gltf.scene;
    traffic.position.set(0.8, 0, 0.8);
    scene.add(traffic);
});

loader.load("/models/Taxi.glb", (gltf) => {
    const taxi = gltf.scene;
    taxi.position.set(0, 0, 5);
    scene.add(taxi);
});

loader.load("/models/Stationwagon.glb", (gltf) => {
    const car = gltf.scene;
    car.position.set(-5, 0.1, 5);
    scene.add(car);
});

loader.load("/models/Building B.glb", (gltf) => {
    const building_b = gltf.scene;
    building_b.position.set(-10, 0, 5);
    scene.add(building_b);
});

loader.load("/models/Building-7lMEpT2ICD.glb", (gltf) => {
    const building_7 = gltf.scene;
    building_7.position.set(-15, 0, 5);
    scene.add(building_7);
});

loader.load("/models/Building-bbH2Bg73qM.glb", (gltf) => {
    const building_bb = gltf.scene;
    building_bb.position.set(-20, 0, 5);
    scene.add(building_bb);
});

// taxi.position.set(0, 0, 5)

// END OF BRIGITTA

/* 
====== CHINTYA =========================================
*/

// CLOUD
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

const c_basePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(48, 48, 1),
    new THREE.MeshLambertMaterial({ color: 0xa3a3a3 })
);

// c_basePlane.position.set(-25, 0.1, -25);
// c_basePlane.rotation.x = -Math.PI / 2;
// c_basePlane.receiveShadow = true;
// c_basePlane.castShadow = true;
// scene.add(c_basePlane);

// Kiri Atas (-48, -48)
// Kanan Atas (-2, -48)

// Kiri Bawah(-48,-2)
// Kanan Bawah (-2, -2)

// Center (-25, -25)

// HAPUS : change the position for the controls
controls.target.set(-25, 0, -25);

/* --- GRASS */
const textureLoader = new THREE.TextureLoader();
const grass_color = textureLoader.load(
    "/textures/Grass005/Grass005_4K-JPG_Color.jpg"
);

console.log("grass", grass_color);

const grass_normal = textureLoader.load(
    "/textures/Grass005/Grass005_4K-JPG_NormalGL.jpg"
);
const grass_roughness = textureLoader.load(
    "/textures/Grass005/Grass005_4K-JPG_Roughness.jpg"
);
const grass_ao = textureLoader.load(
    "/textures/Grass005/Grass005_4K-JPG_AmbientOcclusion.jpg"
);

/* --- PARK */
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
    c_matParkGrass
);
c_meshParkGrass.position.set(-25, 0.5, -25);
c_meshParkGrass.rotation.x = -Math.PI / 2;
c_meshParkGrass.receiveShadow = true;
c_meshParkGrass.castShadow = true;
scene.add(c_meshParkGrass);

const c_parkExtPath = new THREE.Mesh(
    new THREE.BoxGeometry(32, 0.5, 32),
    new THREE.MeshLambertMaterial({ color: 0xa3a3a3 })
);
c_parkExtPath.position.set(-25, -0.1, -25);
c_parkExtPath.receiveShadow = true;
c_parkExtPath.castShadow = true;
scene.add(c_parkExtPath);

loader.load("/models/Park/Fountain.glb", (gltf) => {
    const model = gltf.scene;
    model.position.set(-25, 1.3, -25);
    model.scale.set(7, 7, 7);
    model.receiveShadow = true;
    model.castShadow = true;

    model.traverse((obj) => {
        if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    });

    scene.add(model);
});

var c_trees = [
    {
        pos: { x: -20, y: 3.3, z: -30 },
        scale: 3,
    },
    {
        pos: { x: -30, y: 4.6, z: -35 },
        scale: 4,
    },
    {
        pos: { x: -20, y: 4.6, z: -20 },
        scale: 4,
    },
    {
        pos: { x: -14, y: 4, z: -13 },
        scale: 3,
    },
    {
        pos: { x: -29, y: 4, z: -16 },
        scale: 3,
    },
    {
        pos: { x: -36, y: 4.6, z: -30 },
        scale: 4,
    },
    {
        pos: { x: -13, y: 4, z: -36 },
        scale: 3,
    },
];

loader.load("/models/CityPack/Tree.glb", (gltf) => {
    const model = gltf.scene;
    for (let i = 0; i < c_trees.length; i++) {
        const tree = model.clone();
        tree.position.set(c_trees[i].pos.x, c_trees[i].pos.y, c_trees[i].pos.z);
        tree.scale.set(c_trees[i].scale, c_trees[i].scale, c_trees[i].scale);
        tree.receiveShadow = true;
        tree.castShadow = true;

        tree.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });
        scene.add(tree);
    }
});

loader.load("/models/Park/Bench.glb", (gltf) => {
    const model = gltf.scene;
    model.position.set(-25, 0.8, -20);
    model.rotation.y = Math.PI;
    model.scale.set(0.5, 0.5, 0.5);
    model.receiveShadow = true;
    model.castShadow = true;

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

/* The Roads */
loader.load("models/Road Bits.glb", (gltf) => {
    const roadBits = gltf.scene;
    roadBits.position.set(0, 0, 0);

    const road_corner = gltf.scene.children[0].children.find(
        (c) => c.name === "road_corner"
    );
    const road_corner_curved = gltf.scene.children[0].children.find(
        (c) => c.name === "road_corner_curved"
    );
    const road_straight = gltf.scene.children[0].children.find(
        (c) => c.name === "road_straight"
    );
    const road_junction = gltf.scene.children[0].children.find(
        (c) => c.name === "road_junction"
    );
    const road_straight_crossing = gltf.scene.children[0].children.find(
        (c) => c.name === "road_straight_crossing"
    );
    const road_tsplit = gltf.scene.children[0].children.find(
        (c) => c.name === "road_tsplit"
    );

    // HORIZONTAL
    for (let i = 0; i <= 23; i++) {
        const road1 = road_straight.clone();
        road1.position.set(-48 + i * 2, 0, -42);
        road1.rotation.z = Math.PI / 2;
        scene.add(road1);
    }

    for (let i = 0; i <= 23; i++) {
        const road1 = road_straight.clone();
        road1.position.set(-48 + i * 2, 0, -8);
        road1.rotation.z = Math.PI / 2;
        scene.add(road1);
    }

    // VERTICAL
    for (let i = -15; i <= 0; i++) {
        const road1 = road_straight.clone();
        road1.position.set(-8, 0, -10 + i * 2);
        // road1.rotation.z = Math.PI / 2
        scene.add(road1);
    }

    for (let i = -15; i <= 0; i++) {
        const road1 = road_straight.clone();
        road1.position.set(-42, 0, -10 + i * 2);
        // road1.rotation.z = Math.PI / 2
        scene.add(road1);
    }
});

let buildings = [];
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
        buildings.push([-40 + i * 5, 0, -46]);
        scene.add(building);
    }

    for (let i = 0; i <= 5; i++) {
        const building = model.clone();
        building.position.set(-46, 0, -39 + i * 5);
        building.rotation.y = Math.PI / 2;
        building.scale.set(1.5, 1.5, 1.5);
        building.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });
        buildings.push([-46, 0, -39 + i * 5]);
        scene.add(building);
    }

    for (let i = 0; i <= 5; i++) {
        const building = model.clone();
        building.position.set(-4, 0, -39 + i * 5);
        building.rotation.y = -Math.PI / 2;
        building.scale.set(1.5, 1.5, 1.5);
        building.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });
        buildings.push([-4, 0, -39 + i * 5]);
        scene.add(building);
    }
    console.log(buildings);
});

/*
END OF CHINTYA
*/

//NATALIE
loader.load('/models/low_poly_city-pack.glb', (gltf) => {
  const cityPack = gltf.scene
  
  cityPack.position.set(18.3, 0.015, 30.5)
  cityPack.scale.set(0.1,0.1,0.1)
  cityPack.rotation.y = Math.PI
  scene.add(cityPack)
})
//END OF NATALIE

//JEA
//KODE
loader.load('/models/apartment_building.glb', (gltf) => {
  const apartment = gltf.scene
  apartment.position.set(5, 0,-45)
  apartment.scale.set(0.005,0.005,0.005)
  scene.add(apartment)
})
loader.load('/models/apartment_building.glb', (gltf) => {
  const apartment = gltf.scene
  apartment.position.set(10, 0,-45)
  apartment.scale.set(0.005,0.005,0.005)
  scene.add(apartment)
})

loader.load('/models/bakery.glb', (gltf) => {
  const bakery = gltf.scene
  bakery.position.set(14, 0,-45)
  bakery.scale.set(0.3,0.3,0.3)
  scene.add(bakery)
})

loader.load('/models/bakery.glb', (gltf) => {
  const bakery = gltf.scene
  bakery.position.set(15, 0,-45)
  bakery.scale.set(0.3,0.3,0.3)
  scene.add(bakery)
})

loader.load('/models/hospital.glb', (gltf) => {
  const hospital = gltf.scene
  hospital.position.set(22, 0,-45)
  hospital.scale.set(0.3,0.3,0.3)
  scene.add(hospital)
})

loader.load('/models/american_house.glb', (gltf) => {
  const a_house = gltf.scene
  a_house.position.set(3, 0,-10)
  a_house.scale.set(0.2,0.2,0.2)
  a_house.rotation.y = Math.PI
  scene.add(a_house)
})

loader.load('/models/american_house.glb', (gltf) => {
  const a_house = gltf.scene
  a_house.position.set(8, 0,-10)
  a_house.scale.set(0.2,0.2,0.2)
  a_house.rotation.y = Math.PI
  scene.add(a_house)
})

loader.load('/models/american_house.glb', (gltf) => {
  const a_house = gltf.scene
  a_house.position.set(3, 0,-2)
  a_house.scale.set(0.2,0.2,0.2)
  a_house.rotation.y = Math.PI / 90
  scene.add(a_house)
})
loader.load('/models/american_house.glb', (gltf) => {
  const a_house = gltf.scene
  a_house.position.set(8, 0,-2)
  a_house.scale.set(0.2,0.2,0.2)
  a_house.rotation.y = Math.PI / 90
  scene.add(a_house)
})

loader.load('/models/american_house.glb', (gltf) => {
  const a_house = gltf.scene
  a_house.position.set(23, 0,-10)
  a_house.scale.set(0.2,0.2,0.2)
  a_house.rotation.y = Math.PI
  scene.add(a_house)
})

loader.load('/models/american_house.glb', (gltf) => {
  const a_house = gltf.scene
  a_house.position.set(28, 0,-10)
  a_house.scale.set(0.2,0.2,0.2)
  a_house.rotation.y = Math.PI
  scene.add(a_house)
})

loader.load('/models/american_house.glb', (gltf) => {
  const a_house = gltf.scene
  a_house.position.set(23, 0,-2)
  a_house.scale.set(0.2,0.2,0.2)
  a_house.rotation.y = Math.PI / 90
  scene.add(a_house)
})
loader.load('/models/american_house.glb', (gltf) => {
  const a_house = gltf.scene
  a_house.position.set(28, 0,-2)
  a_house.scale.set(0.2,0.2,0.2)
  a_house.rotation.y = Math.PI / 90
  scene.add(a_house)
})

let clouds

loader.load('/models/clouds.glb', (gltf) => {
  clouds = gltf.scene

  clouds.position.set(0, 20, -20) // tinggi di atas kota
  clouds.scale.set(0.01,0.01,0.01)

  scene.add(clouds)
})

if (clouds) {
    clouds.position.x += 0.02

    if (clouds.position.x > 50) {
      clouds.position.x = -50
    }
  }

function addRandomTreesToGreenArea(count) {
  
  for (let i = 0; i < count; i++) {
    loader.load('/models/leaf_tree.glb', (gltf) => {
      const tree = gltf.scene.clone();
      
      const randomX = Math.random() * 45 + 2; 
      const randomZ = Math.random() * 45 - 47; 
      
      tree.position.set(randomX, 0, randomZ);
      
      const randomScale = Math.random() * 0.003 + 0.004;
      tree.scale.set(4,4,4);

      tree.rotation.y = Math.random() * Math.PI * 2;
      
      scene.add(tree);
    });
  }
}

addRandomTreesToGreenArea(10); 

//END OF JEA

// camera.position.x = 10;

function animate() {
    // if (cloud) {
    //     // console.log("jalan cloud/");
    //     cloud.position.x += 0.01;
    // }
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
