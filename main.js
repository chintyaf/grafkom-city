import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// const ground = new THREE.Mesh(
//   new THREE.PlaneGeometry(98, 98),
//   new THREE.MeshStandardMaterial({ color: 0xffffff })
// )

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(98, 98),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
  }),
);
ground.castShadow = true;
ground.receiveShadow = true;

ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// const camera = new THREE.PerspectiveCamera(
//     60,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     500
// );
// camera.position.set(-50, 20, -50);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0.5, 1);
camera.lookAt(0, 0.5, 0);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

/* 
    Pointer Lock Controls (GPT)
*/
const controls = new PointerLockControls(camera, document.body);

document.addEventListener("click", function () {
  controls.lock();
});

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
  0.6,
);
scene.add(hemi);

const geometry = new THREE.SphereGeometry(5, 15, 16);
const material = new THREE.MeshBasicMaterial({ color: 0xfcfce6 });
const sun_mesh = new THREE.Mesh(geometry, material);
sun_mesh.position.set(0, 100, 0);
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

scene.add(sun);

const loader = new GLTFLoader();

loader.load("models/Road Bits.glb", (gltf) => {
  const roadBits = gltf.scene;
  roadBits.position.set(0, 0, 0);
  // scene.add(roadBits)
  // gltf.scene.children.forEach((child, index) => {
  //     console.log(`Index ${index}: ${child.name}`);
  //     console.log("makan nasi", child.children);
  //     console.log(
  //         "makan nasi",
  //         child.children.find((c) => c.name === "road_corner")
  //     );
  // });
  const road_corner = gltf.scene.children[0].children.find(
    (c) => c.name === "road_corner",
  );
  const road_corner_curved = gltf.scene.children[0].children.find(
    (c) => c.name === "road_corner_curved",
  );
  const road_straight = gltf.scene.children[0].children.find(
    (c) => c.name === "road_straight",
  );
  const road_junction = gltf.scene.children[0].children.find(
    (c) => c.name === "road_junction",
  );
  const road_straight_crossing = gltf.scene.children[0].children.find(
    (c) => c.name === "road_straight_crossing",
  );
  const road_tsplit = gltf.scene.children[0].children.find(
    (c) => c.name === "road_tsplit",
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
  // console.log(road_pinggirbelok);
});

// BRIGITTA

loader.load("/models/Road Bits.glb", (gltf) => {
  const roadBits = gltf.scene;
  const road_corner = gltf.scene.children[0].children.find(
    (c) => c.name === "road_corner",
  );
  const road_straight = gltf.scene.children[0].children.find(
    (c) => c.name === "road_straight",
  );
  const road_junction = gltf.scene.children[0].children.find(
    (c) => c.name === "road_junction",
  );
  const road_tsplit = gltf.scene.children[0].children.find(
    (c) => c.name === "road_tsplit",
  );

  for (let z = 2; z <= 48; z += 2) {
    const roadGrid1 = road_straight.clone();
    roadGrid1.position.set(-15, 0, z);
    scene.add(roadGrid1);

    const roadGrid2 = road_straight.clone();
    roadGrid2.position.set(-30, 0, z);
    scene.add(roadGrid2);
  }

  for (let x = -2; x >= -48; x -= 2) {
    const roadGrid3 = road_straight.clone();
    roadGrid3.position.set(x, 0, 15);
    roadGrid3.rotation.z = Math.PI / 2;
    scene.add(roadGrid3);

    const roadGrid4 = road_straight.clone();
    roadGrid4.position.set(x, 0, 30);
    roadGrid4.rotation.z = Math.PI / 2;
    scene.add(roadGrid4);
  }

  const centerJunction = road_junction.clone();
  centerJunction.position.set(0, 0, 0);
  scene.add(centerJunction);

  const junctions = [
    [-15, 15],
    [-30, 15],
    [-15, 30],
    [-30, 30],
    [-15, 0],
    [-30, 0],
    [0, 15],
    [0, 30],
  ];

  junctions.forEach((pos) => {
    const junc = road_junction.clone();
    junc.position.set(pos[0], 0, pos[1]);
    scene.add(junc);
  });
});

// BLOK 1: X=[-2 to -13], Z=[2 to 13]
// BLOK 2: X=[-2 to -13], Z=[17 to 28]
// BLOK 3: X=[-2 to -13], Z=[32 to 48]
loader.load("models/Skyscraper(1).glb", (gltf) => {
  // BLOK 1
  const sky1 = gltf.scene.clone();
  sky1.position.set(-10, 0, 5);
  sky1.scale.set(2.5, 2.5, 2.5);
  scene.add(sky1);

  const sky2 = gltf.scene.clone();
  sky2.position.set(-5, 0, 9);
  sky2.scale.set(2.3, 2.3, 2.3);
  scene.add(sky2);

  // BLOK 2
  const sky3 = gltf.scene.clone();
  sky3.position.set(-8, 0, 20);
  sky3.scale.set(2.4, 2.4, 2.4);
  sky3.rotation.y = Math.PI / 4;
  scene.add(sky3);

  const sky4 = gltf.scene.clone();
  sky4.position.set(-5, 0, 25);
  sky4.scale.set(2.2, 2.2, 2.2);
  scene.add(sky4);

  // BLOK 3
  const sky5 = gltf.scene.clone();
  sky5.position.set(-7, 0, 36);
  sky5.scale.set(2.5, 2.5, 2.5);
  scene.add(sky5);

  const sky6 = gltf.scene.clone();
  sky6.position.set(-10, 0, 42);
  sky6.scale.set(2.3, 2.3, 2.3);
  scene.add(sky6);
});

loader.load("models/Skyscraper-BwEXdOoUSO.glb", (gltf) => {
  // BLOK 2
  const sky1 = gltf.scene.clone();
  sky1.position.set(-11, 0, 23);
  sky1.scale.set(1.8, 1.8, 1.8);
  scene.add(sky1);

  // BLOK 3
  const sky2 = gltf.scene.clone();
  sky2.position.set(-5, 0, 45);
  sky2.scale.set(1.7, 1.7, 1.7);
  scene.add(sky2);
});

loader.load("models/Skyscraper-jIRx0AhYOR.glb", (gltf) => {
  // BLOK 1
  const sky1 = gltf.scene.clone();
  sky1.position.set(-6, 0, 7);
  sky1.scale.set(1.3, 1.3, 1.3);
  scene.add(sky1);

  // BLOK 3
  const sky2 = gltf.scene.clone();
  sky2.position.set(-11, 0, 39);
  sky2.scale.set(1.4, 1.4, 1.4);
  scene.add(sky2);
});

loader.load("models/Skyscraper.glb", (gltf) => {
  const sky = gltf.scene;
  sky.position.set(-4, -0.2, 4);
  sky.scale.set(0.5, 0.5, 0.5);
  sky.rotation.y = -Math.PI / 2;
  scene.add(sky);
});

loader.load("models/Large Building.glb", (gltf) => {
  // BLOK 1
  const lg1 = gltf.scene.clone();
  lg1.position.set(-8, 0, 11);
  lg1.scale.set(2.5, 2.5, 2.5);
  scene.add(lg1);

  // BLOK 2
  const lg2 = gltf.scene.clone();
  lg2.position.set(-6, 0, 19);
  lg2.scale.set(2.3, 2.3, 2.3);
  scene.add(lg2);

  // BLOK 3
  const lg3 = gltf.scene.clone();
  lg3.position.set(-9, 0, 46);
  lg3.scale.set(2.6, 2.6, 2.6);
  scene.add(lg3);
});

loader.load("models/Large Building-ppwtREejXg.glb", (gltf) => {
  // BLOK 2
  const lb1 = gltf.scene.clone();
  lb1.position.set(-11, 0, 27);
  lb1.scale.set(2, 2, 2);
  scene.add(lb1);

  // BLOK 3
  const lb2 = gltf.scene.clone();
  lb2.position.set(-5, 0, 34);
  lb2.scale.set(2.2, 2.2, 2.2);
  scene.add(lb2);
});

loader.load("models/Large Building-3IhrYZp6tP.glb", (gltf) => {
  // BLOK 3
  const lg = gltf.scene.clone();
  lg.position.set(-11, 0, 45);
  lg.scale.set(2.3, 2.3, 2.3);
  scene.add(lg);
});

loader.load("models/Small Building.glb", (gltf) => {
  // BLOK 1
  const sm1 = gltf.scene.clone();
  sm1.position.set(-4, 0, 11);
  sm1.scale.set(2, 2, 2);
  scene.add(sm1);

  // BLOK 2
  const sm2 = gltf.scene.clone();
  sm2.position.set(-4, 0, 22);
  sm2.scale.set(2.1, 2.1, 2.1);
  scene.add(sm2);

  // BLOK 3
  const sm3 = gltf.scene.clone();
  sm3.position.set(-4, 0, 40);
  sm3.scale.set(1.9, 1.9, 1.9);
  scene.add(sm3);
});

loader.load("models/Small Building-gyjF60t7CG.glb", (gltf) => {
  // BLOK 1
  const sm1 = gltf.scene.clone();
  sm1.position.set(-12, 0, 6);
  sm1.scale.set(2, 2, 2);
  scene.add(sm1);

  // BLOK 2
  const sm2 = gltf.scene.clone();
  sm2.position.set(-9, 0, 18);
  sm2.scale.set(2.1, 2.1, 2.1);
  scene.add(sm2);
});

loader.load("models/Low Building.glb", (gltf) => {
  // BLOK 2
  const lw2 = gltf.scene.clone();
  lw2.position.set(-11, 0, 19);
  lw2.scale.set(5.8, 5.8, 5.8);
  scene.add(lw2);

  // BLOK 3
  const lw3 = gltf.scene.clone();
  lw3.position.set(-6, 0, 33);
  lw3.scale.set(6, 6, 6);
  scene.add(lw3);
});

loader.load("models/Low Building-4RoPd9BkSx.glb", (gltf) => {
  // BLOK 3
  const lw = gltf.scene.clone();
  lw.position.set(-10, 0, 37);
  lw.scale.set(6.2, 6.2, 6.2);
  scene.add(lw);
});

loader.load("models/Building.glb", (gltf) => {
  // BLOK 1
  const bd1 = gltf.scene.clone();
  bd1.position.set(-10, 0, 8);
  bd1.scale.set(2, 2, 2);
  scene.add(bd1);

  // BLOK 2
  const bd2 = gltf.scene.clone();
  bd2.position.set(-6, 0, 26);
  bd2.scale.set(2.1, 2.1, 2.1);
  scene.add(bd2);
});

loader.load("models/Building-7lMEpT2ICD.glb", (gltf) => {
  // BLOK 1
  const bd = gltf.scene.clone();
  bd.position.set(-12, 0, 10);
  bd.scale.set(2.2, 2.2, 2.2);
  scene.add(bd);
});

loader.load("models/Fire Hydrant.glb", (gltf) => {
  const fh1 = gltf.scene.clone();
  fh1.position.set(-3, 0, 5);
  fh1.scale.set(0.8, 0.8, 0.8);
  scene.add(fh1);

  const fh2 = gltf.scene.clone();
  fh2.position.set(-3, 0, 20);
  fh2.scale.set(0.8, 0.8, 0.8);
  scene.add(fh2);

  const fh3 = gltf.scene.clone();
  fh3.position.set(-3, 0, 35);
  fh3.scale.set(0.8, 0.8, 0.8);
  scene.add(fh3);
});

loader.load("models/Bench.glb", (gltf) => {
  for (let z = 4; z < 48; z += 10) {
    const bench = gltf.scene.clone();
    bench.position.set(-14, 0, z);
    bench.rotation.y = Math.PI / 2;
    bench.scale.set(0.5, 0.5, 0.5);
    scene.add(bench);
  }
});

loader.load("models/Traffic light.glb", (gltf) => {
  const tl1 = gltf.scene.clone();
  tl1.position.set(-14, 0, 16);
  tl1.scale.set(0.6, 0.6, 0.6);
  scene.add(tl1);

  const tl2 = gltf.scene.clone();
  tl2.position.set(-14, 0, 31);
  tl2.scale.set(0.6, 0.6, 0.6);
  scene.add(tl2);

  const tl3 = gltf.scene.clone();
  tl3.position.set(-1, 0, 16);
  tl3.scale.set(0.6, 0.6, 0.6);
  scene.add(tl3);

  const tl4 = gltf.scene.clone();
  tl4.position.set(-1, 0, 31);
  tl4.scale.set(0.6, 0.6, 0.6);
  scene.add(tl4);
});

loader.load("models/Bush.glb", (gltf) => {
  for (let z = 4; z < 48; z += 8) {
    const bush = gltf.scene.clone();
    bush.position.set(-2, 0, z);
    bush.scale.set(0.8, 0.8, 0.8);
    scene.add(bush);
  }
});

// loader.load('models/Trees.glb', (gltf) => {
//     for(let z=6; z<48; z+=12){
//         const tree = gltf.scene.clone()
//         tree.position.set(-3, 0, z)
//         tree.scale.set(1.2, 1.2, 1.2)
//         scene.add(tree)
//     }
// })

loader.load("models/Taxi.glb", (gltf) => {
  const taxi1 = gltf.scene.clone();
  taxi1.position.set(-7, 0, 12);
  taxi1.scale.set(0.7, 0.7, 0.7);
  scene.add(taxi1);

  const taxi2 = gltf.scene.clone();
  taxi2.position.set(-9, 0, 24);
  taxi2.scale.set(0.7, 0.7, 0.7);
  taxi2.rotation.y = Math.PI / 2;
  scene.add(taxi2);
});

loader.load("models/Police Car.glb", (gltf) => {
  const pol = gltf.scene.clone();
  pol.position.set(-5, 0, 17);
  pol.scale.set(0.7, 0.7, 0.7);
  scene.add(pol);
});

loader.load("models/Stationwagon.glb", (gltf) => {
  const car1 = gltf.scene.clone();
  car1.position.set(-11, 0, 8);
  car1.scale.set(0.7, 0.7, 0.7);
  scene.add(car1);

  const car2 = gltf.scene.clone();
  car2.position.set(-8, 0, 35);
  car2.scale.set(0.7, 0.7, 0.7);
  car2.rotation.y = -Math.PI / 4;
  scene.add(car2);
});

// ---------------------------------------------------------------------------
// BLOK 4: X=[-17 to -28], Z=[2 to 13]
// BLOK 5: X=[-17 to -28], Z=[17 to 28]
// BLOK 6: X=[-17 to -28], Z=[32 to 48]
// ---------------------------------------------------------------------------

loader.load("models/Factory.glb", (gltf) => {
  // BLOK 4
  const fac1 = gltf.scene.clone();
  fac1.position.set(-21, 0, 7);
  fac1.scale.set(2.5, 2.5, 2.5);
  scene.add(fac1);

  // BLOK 5
  const fac2 = gltf.scene.clone();
  fac2.position.set(-24, 0, 22);
  fac2.scale.set(2.4, 2.4, 2.4);
  fac2.rotation.y = Math.PI / 4;
  scene.add(fac2);

  // BLOK 6
  const fac3 = gltf.scene.clone();
  fac3.position.set(-20, 0, 38);
  fac3.scale.set(2.5, 2.5, 2.5);
  scene.add(fac3);

  const fac4 = gltf.scene.clone();
  fac4.position.set(-25, 0, 44);
  fac4.scale.set(2.3, 2.3, 2.3);
  fac4.rotation.y = -Math.PI / 6;
  scene.add(fac4);
});

loader.load("models/Factory (1).glb", (gltf) => {
  // BLOK 4
  const fac1 = gltf.scene.clone();
  fac1.position.set(-25, 0, 9);
  fac1.rotation.y = -Math.PI / 2;
  fac1.scale.set(0.006, 0.006, 0.006);
  scene.add(fac1);

  // BLOK 5
  const fac2 = gltf.scene.clone();
  fac2.position.set(-19, 0, 20);
  fac2.rotation.y = Math.PI;
  fac2.scale.set(0.006, 0.006, 0.006);
  scene.add(fac2);

  const fac3 = gltf.scene.clone();
  fac3.position.set(-27, 0, 26);
  fac3.scale.set(0.006, 0.006, 0.006);
  scene.add(fac3);

  // BLOK 6
  const fac4 = gltf.scene.clone();
  fac4.position.set(-22, 0, 35);
  fac4.scale.set(0.006, 0.006, 0.006);
  scene.add(fac4);
});

loader.load("models/Factory-itemputih.glb", (gltf) => {
  // BLOK 4
  const fac1 = gltf.scene.clone();
  fac1.position.set(-19, 0, 5);
  fac1.scale.set(2.8, 2.8, 2.8);
  scene.add(fac1);

  // BLOK 5
  const fac2 = gltf.scene.clone();
  fac2.position.set(-22, 0, 19);
  fac2.rotation.y = -Math.PI / 2;
  fac2.scale.set(3, 3, 3);
  scene.add(fac2);

  const fac3 = gltf.scene.clone();
  fac3.position.set(-26, 0, 24);
  fac3.scale.set(2.9, 2.9, 2.9);
  scene.add(fac3);

  // BLOK 6
  const fac4 = gltf.scene.clone();
  fac4.position.set(-18, 0, 41);
  fac4.rotation.y = Math.PI / 4;
  fac4.scale.set(3.1, 3.1, 3.1);
  scene.add(fac4);
});

loader.load("models/Factory (2).glb", (gltf) => {
  // BLOK 5
  const fac1 = gltf.scene.clone();
  fac1.position.set(-20, 0, 25);
  fac1.scale.set(0.005, 0.005, 0.005);
  scene.add(fac1);

  // BLOK 6
  const fac2 = gltf.scene.clone();
  fac2.position.set(-26, 0, 36);
  fac2.scale.set(0.005, 0.005, 0.005);
  fac2.rotation.y = Math.PI / 2;
  scene.add(fac2);
});

loader.load("models/Factory (3).glb", (gltf) => {
  // BLOK 4
  const fac1 = gltf.scene.clone();
  fac1.position.set(-23, 0, 11);
  fac1.scale.set(0.005, 0.005, 0.005);
  scene.add(fac1);

  // BLOK 6
  const fac2 = gltf.scene.clone();
  fac2.position.set(-24, 0, 46);
  fac2.scale.set(0.005, 0.005, 0.005);
  fac2.rotation.y = -Math.PI / 3;
  scene.add(fac2);
});

// loader.load('models/Factory (4).glb', (gltf) => {
//     // BLOK 5
//     const fac = gltf.scene.clone()
//     fac.position.set(-18, 0, 27)
//     fac.scale.set(0.005, 0.005, 0.005)
//     scene.add(fac)
// })

loader.load("models/Wind turbine.glb", (gltf) => {
  // BLOK 6 - Ladang angin
  const turbin1 = gltf.scene.clone();
  turbin1.position.set(-19, 0, 46);
  turbin1.scale.set(0.2, 0.2, 0.2);
  scene.add(turbin1);

  const turbin2 = gltf.scene.clone();
  turbin2.position.set(-23, 0, 46);
  turbin2.scale.set(0.2, 0.2, 0.2);
  scene.add(turbin2);

  const turbin3 = gltf.scene.clone();
  turbin3.position.set(-27, 0, 46);
  turbin3.scale.set(0.2, 0.2, 0.2);
  scene.add(turbin3);
});

loader.load("models/Watertower.glb", (gltf) => {
  // BLOK 4
  const water1 = gltf.scene.clone();
  water1.position.set(-27, 0, 6);
  water1.scale.set(1.4, 1.4, 1.4);
  scene.add(water1);

  // BLOK 5
  const water2 = gltf.scene.clone();
  water2.position.set(-19, 0, 23);
  water2.scale.set(1.5, 1.5, 1.5);
  scene.add(water2);

  // BLOK 6
  const water3 = gltf.scene.clone();
  water3.position.set(-25, 0, 40);
  water3.scale.set(1.3, 1.3, 1.3);
  scene.add(water3);
});

loader.load("models/Dumpster (1).glb", (gltf) => {
  // BLOK 4
  const dump1 = gltf.scene.clone();
  dump1.position.set(-20, 0, 11);
  dump1.scale.set(1.4, 1.4, 1.4);
  scene.add(dump1);

  // BLOK 5
  const dump2 = gltf.scene.clone();
  dump2.position.set(-25, 0, 21);
  dump2.scale.set(1.3, 1.3, 1.3);
  scene.add(dump2);

  // BLOK 6
  const dump3 = gltf.scene.clone();
  dump3.position.set(-21, 0, 34);
  dump3.scale.set(1.4, 1.4, 1.4);
  scene.add(dump3);
});

loader.load("models/Dumpster.glb", (gltf) => {
  const dmp1 = gltf.scene.clone();
  dmp1.position.set(-17, 0, 8);
  dmp1.scale.set(1.2, 1.2, 1.2);
  scene.add(dmp1);

  const dmp2 = gltf.scene.clone();
  dmp2.position.set(-17, 0, 18);
  dmp2.scale.set(1.2, 1.2, 1.2);
  scene.add(dmp2);

  const dmp3 = gltf.scene.clone();
  dmp3.position.set(-17, 0, 37);
  dmp3.scale.set(1.2, 1.2, 1.2);
  scene.add(dmp3);
});

loader.load("models/Building construction crane.glb", (gltf) => {
  // BLOK 5
  const crane1 = gltf.scene.clone();
  crane1.position.set(-23, 0, 18);
  crane1.scale.set(1.5, 1.5, 1.5);
  scene.add(crane1);

  // BLOK 6
  const crane2 = gltf.scene.clone();
  crane2.position.set(-27, 0, 33);
  crane2.scale.set(1.6, 1.6, 1.6);
  crane2.rotation.y = Math.PI / 3;
  scene.add(crane2);
});

loader.load("models/Bulldozer.glb", (gltf) => {
  // BLOK 4
  const bull1 = gltf.scene.clone();
  bull1.position.set(-22, 0, 10);
  bull1.scale.set(0.3, 0.3, 0.3);
  scene.add(bull1);

  // BLOK 5
  const bull2 = gltf.scene.clone();
  bull2.position.set(-28, 0, 28);
  bull2.scale.set(0.3, 0.3, 0.3);
  bull2.rotation.y = -Math.PI / 4;
  scene.add(bull2);
});

loader.load("models/Barrel.glb", (gltf) => {
  // BLOK 4
  for (let i = 0; i < 4; i++) {
    const bar = gltf.scene.clone();
    bar.position.set(-18, 0, 4 + i * 0.7);
    scene.add(bar);
  }

  // BLOK 5
  for (let i = 0; i < 5; i++) {
    const bar = gltf.scene.clone();
    bar.position.set(-17, 0, 22 + i * 0.8);
    scene.add(bar);
  }
});

loader.load("models/Truck.glb", (gltf) => {
  const truck1 = gltf.scene.clone();
  truck1.position.set(-22, 0, 8);
  truck1.scale.set(0.8, 0.8, 0.8);
  scene.add(truck1);

  const truck2 = gltf.scene.clone();
  truck2.position.set(-26, 0, 20);
  truck2.scale.set(0.8, 0.8, 0.8);
  truck2.rotation.y = Math.PI / 2;
  scene.add(truck2);
});

// ---------------------------------------------------------------------------
// BLOK 7: X=[-32 to -48], Z=[2 to 13]
// BLOK 8: X=[-32 to -48], Z=[17 to 28]
// BLOK 9: X=[-32 to -48], Z=[32 to 48]
// ---------------------------------------------------------------------------

loader.load("models/Crane.glb", (gltf) => {
  // BLOK 8
  const crane1 = gltf.scene.clone();
  crane1.position.set(-38, 0, 22);
  crane1.rotation.y = Math.PI / 4;
  scene.add(crane1);

  // BLOK 9
  const crane2 = gltf.scene.clone();
  crane2.position.set(-42, 0, 40);
  crane2.rotation.y = -Math.PI / 3;
  scene.add(crane2);
});

loader.load("models/Shipping Container.glb", (gltf) => {
  // BLOK 7 - Tumpukan kontainer
  const con1 = gltf.scene.clone();
  con1.position.set(-36, 0, 6);
  scene.add(con1);

  const con2 = gltf.scene.clone();
  con2.position.set(-36, 0, 8);
  con2.rotation.y = 0.2;
  scene.add(con2);

  const con3 = gltf.scene.clone();
  con3.position.set(-40, 0, 5);
  scene.add(con3);

  const con4 = gltf.scene.clone();
  con4.position.set(-40, 2.5, 5);
  con4.rotation.y = 0.1;
  scene.add(con4);

  // BLOK 8
  for (let i = 0; i < 5; i++) {
    const conRow = gltf.scene.clone();
    conRow.position.set(-34, 0, 18 + i * 2);
    scene.add(conRow);
  }

  const con5 = gltf.scene.clone();
  con5.position.set(-39, 0, 24);
  scene.add(con5);

  const con6 = gltf.scene.clone();
  con6.position.set(-39, 2.5, 24);
  con6.rotation.y = 0.15;
  scene.add(con6);

  const con7 = gltf.scene.clone();
  con7.position.set(-44, 0, 20);
  scene.add(con7);

  // BLOK 9
  for (let i = 0; i < 4; i++) {
    const wall1 = gltf.scene.clone();
    wall1.position.set(-46, 0, 34 + i * 3);
    scene.add(wall1);

    const wall2 = gltf.scene.clone();
    wall2.position.set(-46, 2.5, 34 + i * 3);
    wall2.rotation.y = 0.1;
    scene.add(wall2);
  }

  for (let i = 0; i < 3; i++) {
    const conRow2 = gltf.scene.clone();
    conRow2.position.set(-38, 0, 36 + i * 3);
    scene.add(conRow2);
  }
});

loader.load("models/Container Red.glb", (gltf) => {
  // BLOK 7
  const red1 = gltf.scene.clone();
  red1.position.set(-43, 0, 9);
  scene.add(red1);

  const red2 = gltf.scene.clone();
  red2.position.set(-43, 2.5, 9);
  red2.rotation.y = 0.1;
  scene.add(red2);

  // BLOK 8
  for (let i = 0; i < 3; i++) {
    const redRow = gltf.scene.clone();
    redRow.position.set(-40, 0, 18 + i * 2);
    scene.add(redRow);
  }

  // BLOK 9
  const red3 = gltf.scene.clone();
  red3.position.set(-35, 0, 38);
  scene.add(red3);
});

loader.load("models/Container Green.glb", (gltf) => {
  // BLOK 7
  const grn1 = gltf.scene.clone();
  grn1.position.set(-38, 0, 11);
  grn1.rotation.y = Math.PI / 3;
  scene.add(grn1);

  // BLOK 8
  for (let i = 0; i < 4; i++) {
    const grnRow = gltf.scene.clone();
    grnRow.position.set(-46, 0, 19 + i * 2);
    grnRow.rotation.y = -0.2;
    scene.add(grnRow);
  }

  // BLOK 9
  const grn2 = gltf.scene.clone();
  grn2.position.set(-42, 0, 44);
  scene.add(grn2);
});

loader.load("models/Container Small.glb", (gltf) => {
  // BLOK 7
  for (let i = 0; i < 4; i++) {
    const smCon = gltf.scene.clone();
    smCon.position.set(-34, 0, 4 + i * 2);
    scene.add(smCon);
  }

  // BLOK 9
  for (let i = 0; i < 5; i++) {
    const smCon2 = gltf.scene.clone();
    smCon2.position.set(-33, 0, 34 + i * 2);
    scene.add(smCon2);
  }
});

loader.load("models/Barrel.glb", (gltf) => {
  // BLOK 7
  for (let i = 0; i < 8; i++) {
    const bar = gltf.scene.clone();
    bar.position.set(-32 + (i % 2) * 0.5, 0, 8 + i * 0.6);
    scene.add(bar);
  }

  // BLOK 8
  for (let i = 0; i < 6; i++) {
    const bar2 = gltf.scene.clone();
    bar2.position.set(-32, 0, 20 + i * 1);
    scene.add(bar2);
  }

  // BLOK 9
  for (let i = 0; i < 7; i++) {
    const bar3 = gltf.scene.clone();
    bar3.position.set(-47, 0, 33 + i * 1.5);
    scene.add(bar3);
  }
});

loader.load("models/Pallet.glb", (gltf) => {
  // BLOK 7
  for (let i = 0; i < 4; i++) {
    const pal = gltf.scene.clone();
    pal.position.set(-45, 0, 6 + i * 1.5);
    scene.add(pal);
  }

  // BLOK 8
  for (let i = 0; i < 5; i++) {
    const pal2 = gltf.scene.clone();
    pal2.position.set(-36, 0, 19 + i * 1.8);
    scene.add(pal2);
  }

  // BLOK 9
  for (let i = 0; i < 4; i++) {
    const pal3 = gltf.scene.clone();
    pal3.position.set(-40, 0, 35 + i * 2);
    scene.add(pal3);
  }
});

loader.load("models/Box.glb", (gltf) => {
  // BLOK 7
  for (let i = 0; i < 10; i++) {
    const box = gltf.scene.clone();
    box.position.set(-33 + (i % 3) * 0.8, 0, 5 + Math.floor(i / 3) * 1.2);
    box.scale.set(0.8, 0.8, 0.8);
    scene.add(box);
  }
});

loader.load("models/Box B.glb", (gltf) => {
  // BLOK 8
  for (let i = 0; i < 8; i++) {
    const boxB = gltf.scene.clone();
    boxB.position.set(-43, 0, 22 + i * 0.8);
    boxB.scale.set(0.7, 0.7, 0.7);
    scene.add(boxB);
  }
});

loader.load("models/Parking Lot.glb", (gltf) => {
  // BLOK 8
  // const park1 = gltf.scene.clone()
  // park1.position.set(-34, 0, 26)
  // park1.scale.set(2, 2, 2)
  // scene.add(park1)
  // BLOK 9
  // const park2 = gltf.scene.clone()
  // park2.position.set(-44, 0, 46)
  // park2.scale.set(2.2, 2.2, 2.2)
  // park2.rotation.y = Math.PI / 2
  // scene.add(park2)
});

loader.load("models/Pickup Truck.glb", (gltf) => {
  const pick1 = gltf.scene.clone();
  pick1.position.set(-35, 0, 10);
  pick1.scale.set(0.7, 0.7, 0.7);
  scene.add(pick1);

  const pick2 = gltf.scene.clone();
  pick2.position.set(-41, 0, 27);
  pick2.scale.set(0.7, 0.7, 0.7);
  pick2.rotation.y = Math.PI / 2;
  scene.add(pick2);

  const pick3 = gltf.scene.clone();
  pick3.position.set(-37, 0, 42);
  pick3.scale.set(0.7, 0.7, 0.7);
  scene.add(pick3);
});

loader.load("models/Truck.glb", (gltf) => {
  const truck1 = gltf.scene.clone();
  truck1.position.set(-39, 0, 7);
  truck1.scale.set(0.8, 0.8, 0.8);
  scene.add(truck1);

  const truck2 = gltf.scene.clone();
  truck2.position.set(-45, 0, 23);
  truck2.scale.set(0.8, 0.8, 0.8);
  truck2.rotation.y = -Math.PI / 3;
  scene.add(truck2);

  const truck3 = gltf.scene.clone();
  truck3.position.set(-35, 0, 39);
  truck3.scale.set(0.8, 0.8, 0.8);
  scene.add(truck3);
});

// END OF BRIGITTA
// loader.load('/models/Bulldozer.glb', (gltf) => {
//   const traffic = gltf.scene
//   traffic.position.set(0.8, 0, 0.8)
//   scene.add(traffic)
// })

// loader.load('/models/Taxi.glb', (gltf) => {
//   const taxi = gltf.scene
//   taxi.position.set(0, 0, 5)
//   scene.add(taxi)
// })

// loader.load('/models/Stationwagon.glb', (gltf) => {
//   const car = gltf.scene
//   car.position.set(-5, 0.1, 5)
//   scene.add(car)
// })

// loader.load('/models/Building B.glb', (gltf) => {
//   const building_b = gltf.scene
//   building_b.position.set(-10, 0, 5)
//   scene.add(building_b)
// })

// loader.load('/models/Building-7lMEpT2ICD.glb', (gltf) => {
//   const building_7 = gltf.scene
//   building_7.position.set(-15, 0, 5)
//   scene.add(building_7)
// })

// loader.load('/models/Building-bbH2Bg73qM.glb', (gltf) => {
//   const building_bb = gltf.scene
//   building_bb.position.set(-20, 0, 5)
//   scene.add(building_bb)
// })

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

// Kiri Atas (-48, -48)
// Kanan Atas (-2, -48)

// Kiri Bawah(-48,-2)
// Kanan Bawah (-2, -2)

// Center (-25, -25)

// HAPUS : change the position for the controls
// controls.target.set(-25, 0, -25);

/* --- GRASS */
const textureLoader = new THREE.TextureLoader();
const grass_color = textureLoader.load(
  "/textures/Grass005/Grass005_4K-JPG_Color.jpg",
);

// console.log("grass", grass_color);

const grass_normal = textureLoader.load(
  "/textures/Grass005/Grass005_4K-JPG_NormalGL.jpg",
);
const grass_roughness = textureLoader.load(
  "/textures/Grass005/Grass005_4K-JPG_Roughness.jpg",
);
const grass_ao = textureLoader.load(
  "/textures/Grass005/Grass005_4K-JPG_AmbientOcclusion.jpg",
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
    (c) => c.name === "road_corner",
  );
  const road_corner_curved = gltf.scene.children[0].children.find(
    (c) => c.name === "road_corner_curved",
  );
  const road_straight = gltf.scene.children[0].children.find(
    (c) => c.name === "road_straight",
  );
  const road_junction = gltf.scene.children[0].children.find(
    (c) => c.name === "road_junction",
  );
  const road_straight_crossing = gltf.scene.children[0].children.find(
    (c) => c.name === "road_straight_crossing",
  );
  const road_tsplit = gltf.scene.children[0].children.find(
    (c) => c.name === "road_tsplit",
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

// let buildings = [];
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
    // buildings.push([-40 + i * 5, 0, -46]);
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
    // buildings.push([-46, 0, -39 + i * 5]);
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
    // buildings.push([-4, 0, -39 + i * 5]);
    scene.add(building);
  }
  // console.log(buildings);
});

/*
END OF CHINTYA
*/

// NATALIE
loader.load("/models/low_poly_city-pack.glb", (gltf) => {
  const cityPack = gltf.scene;

  cityPack.position.set(19, 0.008, 29.5);
  cityPack.scale.set(0.107, 0.12, 0.095);
  cityPack.rotation.y = Math.PI;
  scene.add(cityPack);
});
// END OF NATALIE

//JEA
//KODE
//KODE POPUP (sudah ada)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const clickableObjects = [];
const buildingInfo = new Map();

const popup = document.createElement("div");
popup.style.cssText = `
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%) scale(0.9);
background: linear-gradient(135deg, rgba(20,20,40,0.95), rgba(40,40,60,0.95));
color: white;
padding: 28px 32px;
border-radius: 20px;
width: 380px;
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
display: none;
z-index: 999;
box-shadow: 0 25px 50px rgba(0,0,0,0.6), 0 0 100px rgba(100,200,255,0.3);
border: 2px solid rgba(100,200,255,0.3);
backdrop-filter: blur(10px);
transition: transform 0.3s ease;
`;

popup.innerHTML = `
<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
  <div id="p-icon" style="
    font-size: 36px;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(100,200,255,0.2);
    border-radius: 12px;
  "></div>
  <h2 id="p-title" style="
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    background: linear-gradient(135deg, #64C8FF, #A8E6FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  "></h2>
</div>
<p id="p-desc" style="
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 12px;
  color: rgba(255,255,255,0.9);
"></p>
<div id="p-details" style="
  background: rgba(100,200,255,0.1);
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 16px;
  border-left: 3px solid #64C8FF;
"></div>
<p id="p-extra" style="
  font-size: 13px;
  opacity: 0.7;
  margin-bottom: 16px;
  font-style: italic;
"></p>
<button id="p-close" style="
  margin-top: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: linear-gradient(135deg, #64C8FF, #4A9FE8);
  color: white;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(100,200,255,0.4);
  width: 100%;
">✕ Tutup</button>
`;

document.body.appendChild(popup);

// Hover effect untuk button
const closeBtn = document.getElementById("p-close");
closeBtn.onmouseover = () => {
  closeBtn.style.transform = "translateY(-2px)";
  closeBtn.style.boxShadow = "0 6px 20px rgba(100,200,255,0.6)";
};
closeBtn.onmouseout = () => {
  closeBtn.style.transform = "translateY(0)";
  closeBtn.style.boxShadow = "0 4px 15px rgba(100,200,255,0.4)";
};

closeBtn.onclick = () => {
  popup.style.transform = "translate(-50%, -50%) scale(0.9)";
  popup.style.opacity = "0";
  setTimeout(() => {
    popup.style.display = "none";
  }, 200);
};

function showPopup(data) {
  document.getElementById("p-icon").innerText = data.icon || "🏢";
  document.getElementById("p-title").innerText = data.title;
  document.getElementById("p-desc").innerText = data.desc;
  document.getElementById("p-details").innerHTML = data.details || "";
  document.getElementById("p-extra").innerText = data.extra;
  popup.style.display = "block";
  popup.style.opacity = "0";
  popup.style.transform = "translate(-50%, -50%) scale(0.9)";

  setTimeout(() => {
    popup.style.opacity = "1";
    popup.style.transform = "translate(-50%, -50%) scale(1)";
  }, 10);
}

// ============ APARTEMEN  ============
const apartmentPositions = [{ x: 7, z: -39, rotation: Math.PI / 2 }];

loader.load("/models/apartment_building.glb", (gltf) => {
  apartmentPositions.forEach((pos) => {
    const apartment = gltf.scene.clone();
    apartment.position.set(pos.x, 0, pos.z);
    apartment.scale.set(0.008, 0.008, 0.008);
    apartment.rotation.y = pos.rotation;

    apartment.userData = {
      icon: "🏢",
      title: "Apartemen Modern",
      desc: "Bangunan hunian vertikal dengan fasilitas lengkap yang menjadi pilihan utama penduduk urban. Dilengkapi dengan sistem keamanan 24/7, kolam renang, gym, dan area parkir yang luas.",
      details: `
        <div style="font-size: 13px; line-height: 1.8;">
          <div style="margin-bottom: 6px;">📏 <strong>Tinggi:</strong> 15 Lantai</div>
          <div style="margin-bottom: 6px;">🏠 <strong>Unit:</strong> 120 Apartemen</div>
          <div style="margin-bottom: 6px;">🌟 <strong>Fasilitas:</strong> Pool, Gym, Security</div>
          <div>💰 <strong>Harga Mulai:</strong> Rp 800jt</div>
        </div>
      `,
      extra: "🏗️ Dibangun: 2012 • 🎯 Okupansi: 95%",
    };

    scene.add(apartment);
    clickableObjects.push(apartment);
  });
});


const oldResidentialPositions = [
  { x: 34, z: -36},
  { x: 38, z: -36}
];

loader.load('/models/old_residential_building.glb', (gltf) => {
  oldResidentialPositions.forEach(pos => {
    const old_resident = gltf.scene.clone();
    old_resident.position.set(pos.x, 0, pos.z);
    old_resident.scale.set(0.4, 0.4, 0.4);

    old_resident.userData = {
      icon: "🏚️",
      title: "Bangunan Residensial Klasik",
      desc: "Bangunan bersejarah yang menjadi saksi bisu perkembangan kota. Arsitektur vintage dengan sentuhan kolonial yang masih kokoh berdiri hingga kini. Banyak keluarga yang telah tinggal di sini selama puluhan tahun.",
      details: `
        <div style="font-size: 13px; line-height: 1.8;">
          <div style="margin-bottom: 6px;">🏛️ <strong>Gaya:</strong> Kolonial Eropa</div>
          <div style="margin-bottom: 6px;">🏠 <strong>Unit:</strong> 8 Rumah</div>
          <div style="margin-bottom: 6px;">🌳 <strong>Taman:</strong> Halaman Luas</div>
          <div>🔧 <strong>Kondisi:</strong> Terawat Baik</div>
        </div>
      `,
      extra: "📅 Tahun: 1965 • 🏆 Status: Cagar Budaya"
    };

    scene.add(old_resident);
    clickableObjects.push(old_resident);
  });
});

const samRestPositions = [
  { x: 5, z: -22, rotation: Math.PI },
  { x: 5, z: -19, rotation: Math.PI/90}
];

loader.load('/models/samhui_restaurant.glb', (gltf) => {
  samRestPositions.forEach(pos => {
    const sam_rest = gltf.scene.clone();
    sam_rest.position.set(pos.x, 0, pos.z);
    sam_rest.scale.set(0.4, 0.4, 0.4);
    sam_rest.rotation.y = pos.rotation;

    sam_rest.userData = {
      icon: "🍜",
      title: "Samhui Restaurant",
      desc: "Restoran oriental authentic dengan menu khas Asia Timur. Terkenal dengan ramen buatan tangan dan dim sum yang lezat. Interior bergaya tradisional Jepang dengan suasana yang tenang dan nyaman.",
      details: `
        <div style="font-size: 13px; line-height: 1.8;">
          <div style="margin-bottom: 6px;">🍽️ <strong>Spesialisasi:</strong> Ramen & Dim Sum</div>
          <div style="margin-bottom: 6px;">⏰ <strong>Jam Buka:</strong> 10:00 - 22:00</div>
          <div style="margin-bottom: 6px;">💺 <strong>Kapasitas:</strong> 80 Orang</div>
          <div>⭐ <strong>Rating:</strong> 4.7/5.0</div>
        </div>
      `,
      extra: "🎌 Didirikan: 2008 • 👨‍🍳 Chef: Master Tanaka"
    };

    scene.add(sam_rest);
    clickableObjects.push(sam_rest);
  });
});

loader.load('/models/albaik_restaurant.glb', (gltf) => {
  const albaik = gltf.scene;
  albaik.position.set(10, 0, -20);
  albaik.scale.set(0.6, 0.6, 0.6);

  albaik.userData = {
    icon: "🍗",
    title: "Albaik Restaurant",
    desc: "Restoran cepat saji premium dengan menu ayam goreng yang legendaris. Menggunakan resep rahasia khas Timur Tengah dengan bumbu rempah pilihan. Favorit keluarga dengan harga terjangkau dan rasa yang tidak pernah mengecewakan.",
    details: `
      <div style="font-size: 13px; line-height: 1.8;">
        <div style="margin-bottom: 6px;">🍗 <strong>Menu Andalan:</strong> Fried Chicken</div>
        <div style="margin-bottom: 6px;">⏰ <strong>Jam Buka:</strong> 09:00 - 23:00</div>
        <div style="margin-bottom: 6px;">🚗 <strong>Layanan:</strong> Dine-in & Drive-thru</div>
        <div>⭐ <strong>Rating:</strong> 4.8/5.0</div>
      </div>
    `,
    extra: "🌟 Sejak: 2015 • 🏆 Best Fried Chicken Award 2023"
  };

  scene.add(albaik);
  clickableObjects.push(albaik);
});

const kyotoRestPositions = [
  { x: 20, z: -17},
  { x: 24, z: -17}
];

loader.load('/models/kyoto_restaurant.glb', (gltf) => {
  kyotoRestPositions.forEach(pos => {
    const kyoto = gltf.scene.clone();
    kyoto.position.set(pos.x, 0, pos.z);
    kyoto.scale.set(0.004, 0.004, 0.004);

    kyoto.userData = {
      icon: "🍱",
      title: "Kyoto Restaurant",
      desc: "Restoran Jepang premium dengan konsep tradisional Kyoto. Menyajikan sushi, sashimi, dan kaiseki course yang dibuat langsung oleh chef berpengalaman dari Jepang. Taman zen di dalam restoran menciptakan pengalaman kuliner yang autentik.",
      details: `
        <div style="font-size: 13px; line-height: 1.8;">
          <div style="margin-bottom: 6px;">🍣 <strong>Spesialisasi:</strong> Sushi & Kaiseki</div>
          <div style="margin-bottom: 6px;">⏰ <strong>Jam Buka:</strong> 11:00 - 23:00</div>
          <div style="margin-bottom: 6px;">🎋 <strong>Suasana:</strong> Taman Zen</div>
          <div>⭐ <strong>Rating:</strong> 4.9/5.0</div>
        </div>
      `,
      extra: "🎎 Didirikan: 2010 • 🏅 Michelin Recommended"
    };

    scene.add(kyoto);
    clickableObjects.push(kyoto);
  });
});

const RestPositions = [
  { x: 22, z: -20},
  { x: 26, z: -20}
];

loader.load('/models/restaurant.glb', (gltf) => {  
  RestPositions.forEach(pos => {
    const restaurant = gltf.scene.clone();
    restaurant.position.set(pos.x, 0, pos.z);
    restaurant.scale.set(3, 3, 3);

    restaurant.userData = {
      icon: "🍴",
      title: "Family Restaurant",
      desc: "Restoran keluarga dengan menu internasional yang beragam. Tempat yang sempurna untuk makan bersama keluarga dengan harga yang ramah di kantong. Menyediakan playground untuk anak-anak dan area outdoor yang asri.",
      details: `
        <div style="font-size: 13px; line-height: 1.8;">
          <div style="margin-bottom: 6px;">🌍 <strong>Menu:</strong> Western & Asian Fusion</div>
          <div style="margin-bottom: 6px;">⏰ <strong>Jam Buka:</strong> 08:00 - 22:00</div>
          <div style="margin-bottom: 6px;">🎪 <strong>Fasilitas:</strong> Kids Playground</div>
          <div>⭐ <strong>Rating:</strong> 4.5/5.0</div>
        </div>
      `,
      extra: "👨‍👩‍👧‍👦 Ramah Keluarga • 🎉 Private Event Available"
    };

    scene.add(restaurant);
    clickableObjects.push(restaurant);
  });
});

loader.load('/models/city_park_at_sunset.glb', (gltf) => {
  const park = gltf.scene;
  park.position.set(40, 0, -21);
  park.scale.set(0.2, 0.2, 0.2);

  park.userData = {
    icon: "🌳",
    title: "Central City Park",
    desc: "Taman kota yang menjadi paru-paru hijau di tengah kesibukan urban. Dilengkapi dengan jogging track, area bermain anak, danau buatan, dan gazebo untuk bersantai. Setiap sore, taman ini ramai dikunjungi warga untuk olahraga dan refreshing.",
    details: `
      <div style="font-size: 13px; line-height: 1.8;">
        <div style="margin-bottom: 6px;">🌲 <strong>Luas:</strong> 5 Hektar</div>
        <div style="margin-bottom: 6px;">🏃 <strong>Fasilitas:</strong> Jogging Track 2km</div>
        <div>⏰ <strong>Buka:</strong> 05:00 - 21:00</div>
      </div>
    `,
    extra: "🌺 Renovasi: 2020 • 🎨 Free Yoga Sunday Morning"
  };

  scene.add(park);
  clickableObjects.push(park);
});

loader.load('/models/hospital.glb', (gltf) => {
  const hospital = gltf.scene;
  hospital.position.set(23, 0, -39);
  hospital.scale.set(0.4, 0.4, 0.4);

  hospital.userData = {
    icon: "🏥",
    title: "General Hospital",
    desc: "Rumah sakit umum dengan fasilitas modern dan lengkap melayani 24/7. Dilengkapi dengan UGD, ICU, ruang operasi berstandar internasional, dan 150 dokter spesialis. Menjadi rumah sakit rujukan utama di kawasan ini.",
    details: `
      <div style="font-size: 13px; line-height: 1.8;">
        <div style="margin-bottom: 6px;">🛏️ <strong>Kapasitas:</strong> 200 Tempat Tidur</div>
        <div style="margin-bottom: 6px;">👨‍⚕️ <strong>Dokter:</strong> 150 Spesialis</div>
        <div style="margin-bottom: 6px;">🚑 <strong>UGD:</strong> 24 Jam</div>
        <div>⭐ <strong>Akreditasi:</strong> KARS Paripurna</div>
      </div>
    `,
    extra: "🏆 ISO Certified • 🔬 Lab Terakreditasi Internasional"
  };

  scene.add(hospital);
  clickableObjects.push(hospital);
});
const housePositions = [
  { x: 4, z: -10, rotation: Math.PI },
  { x: 9, z: -10, rotation: Math.PI },
  { x: 4, z: -2, rotation: Math.PI / 90 },
  { x: 9, z: -2, rotation: Math.PI / 90 },
  { x: 20, z: -10, rotation: Math.PI },
  { x: 25, z: -10, rotation: Math.PI },
  { x: 20, z: -2, rotation: Math.PI / 90 },
  { x: 25, z: -2, rotation: Math.PI / 90 },
  { x: 37, z: -2, rotation: Math.PI / 90 },
  { x: 42, z: -10, rotation: Math.PI },
  { x: 37, z: -10, rotation: Math.PI },
  { x: 42, z: -2, rotation: Math.PI / 90 }
];

loader.load('/models/american_house.glb', (gltf) => {
  housePositions.forEach(pos => {
    const a_house = gltf.scene.clone();
    a_house.position.set(pos.x, 0, pos.z);
    a_house.scale.set(0.2, 0.2, 0.2);
    a_house.rotation.y = pos.rotation;

    a_house.userData = {
      icon: "🏡",
      title: "American Style House",
      desc: "Rumah bergaya Amerika dengan konsep open space dan halaman luas. Desain modern minimalis dengan 3 kamar tidur, 2 kamar mandi, dan garasi untuk 2 mobil. Cocok untuk keluarga kecil yang menginginkan kenyamanan dan privasi.",
      details: `
        <div style="font-size: 13px; line-height: 1.8;">
          <div style="margin-bottom: 6px;">🏠 <strong>Tipe:</strong> Single Family House</div>
          <div style="margin-bottom: 6px;">🛏️ <strong>Kamar:</strong> 3 Bedroom, 2 Bathroom</div>
          <div style="margin-bottom: 6px;">🚗 <strong>Garasi:</strong> 2 Mobil</div>
          <div>📐 <strong>Luas:</strong> 120m² (Bangunan)</div>
        </div>
      `,
      extra: "🌳 Halaman: 200m² • 💰 Harga: Rp 1.2M - 1.8M"
    };

    scene.add(a_house);
    clickableObjects.push(a_house);
  });
});

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(clickableObjects, true);

  if (intersects.length > 0) {
    let obj = intersects[0].object;

    // naik ke parent sampai ketemu userData
    while (obj.parent && !obj.userData.title) {
      obj = obj.parent;
    }

    if (obj.userData.title) {
      showPopup(obj.userData);
    }
  }
});

function createStraightRoad({
  model,
  scene,
  startX,
  startZ,
  count,
  direction = "z", // "z" atau "x"
  step = 2,
  rotationZ = 0,
  y = 0.01,
}) {
  for (let i = 0; i <= count; i++) {
    const road = model.clone();

    if (direction === "z") {
      road.position.set(startX, y, startZ - i * step);
    } else if (direction === "x") {
      road.position.set(startX - i * step, y, startZ);
    }

    road.rotation.z = rotationZ;
    scene.add(road);
  }
}

loader.load("/models/Road Bits.glb", (gltf) => {
  const root = gltf.scene.children[0];

  const road_straight = root.children.find(
    (c) => c.name === "road_straight"
  );

  if (!road_straight) {
    console.error("road_straight tidak ditemukan");
    return;
  }

    createStraightRoad({
    model: road_straight,
    scene,
    startX: 14,
    startZ: 0,
    count: 24,
    direction: "z",
  });

    createStraightRoad({
    model: road_straight,
    scene,
    startX: 48,
    startZ: -30,
    count: 24,
    direction: "x",
    rotationZ: Math.PI / 2,
  });

    createStraightRoad({
    model: road_straight,
    scene,
    startX: 48,
    startZ: -13,
    count: 24,
    direction: "x",
    rotationZ: Math.PI / 2,
  });

    createStraightRoad({
    model: road_straight,
    scene,
    startX: 48,
    startZ: -48,
    count: 24,
    direction: "x",
    rotationZ: Math.PI / 2,
  });

    createStraightRoad({
    model: road_straight,
    scene,
    startX: 32,
    startZ: 0,
    count: 24,
    direction: "z",
  });

    createStraightRoad({
    model: road_straight,
    scene,
    startX: 48,
    startZ: 0,
    count: 24,
    direction: "z",
  });
});

// //END OF JEA

// controls.target.set(0, 0, 0);

// Variabel kontrol gerak
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Event Listener Keyboard (WASD)
const onKeyDown = function (event) {
  switch (event.code) {
    case "KeyW":
      moveForward = true;
      break;
    case "KeyA":
      moveLeft = true;
      break;
    case "KeyS":
      moveBackward = true;
      break;
    case "KeyD":
      moveRight = true;
      break;
  }
};

const onKeyUp = function (event) {
  switch (event.code) {
    case "KeyW":
      moveForward = false;
      break;
    case "KeyA":
      moveLeft = false;
      break;
    case "KeyS":
      moveBackward = false;
      break;
    case "KeyD":
      moveRight = false;
      break;
  }
};

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

// CAR
let cars = [];
let car = null;
loader.load("/models/CityPack/Car.glb", (gltf) => {
  const model = gltf.scene;
  car = model.clone();
  // Ke kanan
  car.position.set(-47.7, 0.15, -0.3);
  car.scale.set(0.25, 0.25, 0.25);
  car.rotation.y = Math.PI / 2;

  // car.position.set(-0.3 , 0.15, -0.3);
  // car.scale.set(0.25, 0.25, 0.25);
  // car.rotation.y = Math.PI;

  scene.add(car);
});

let direction = "kanan_1";
let prev_move = "x"; // x or z
function animate() {
  // if (cloud) {
  //     // console.log("jalan cloud/");
  //     cloud.position.x += 0.01;
  // }
  if (car) {
    // console.log(direction, car.position.x, car.position.z);
    if (direction === "kanan_1") {
      car.position.x += 0.2;

      if (car.position.x >= -2) {
        car.position.set(-0.3, 0.15, -0.3);
        car.rotation.y = Math.PI;
        direction = "atas_1";
      }
    } else if (direction === "atas_1") {
      car.position.z -= 0.2;

      if (car.position.z <= -47) {
        car.position.set(0.3, 0.15, -47);
        car.rotation.y = -Math.PI;
        direction = "bawah_1";
      }
    } else if (direction === "bawah_1") {
      car.position.z += 0.2;

      if (car.position.z >= -2) {
        car.position.set(0.3, 0.15, -0.3);
        car.rotation.y = Math.PI / 2;
        direction = "kanan_2";
      }
    } else if (direction === "kanan_2") {
      car.position.x += 0.2;

      if (car.position.x >= 47) {
        car.position.set(47, 0.15, 0.3);
        car.rotation.y = Math.PI / 2;
        direction = "kiri_1";
      }
    } else if (direction === "kiri_1") {
      car.position.x -= 0.2;

      if (car.position.x <= 0) {
        car.position.set(0.3, 0.15, 0.3);
        car.rotation.y = 0;
        direction = "bawah_2";
      }
    } else if (direction === "bawah_2") {
      car.position.z += 0.2;

      if (car.position.z >= 48) {
        car.position.set(-0.3, 0.15, 46);
        car.rotation.y = Math.PI;
        direction = "atas_2";
      }
    } else if (direction === "atas_2") {
      car.position.z -= 0.2;

      if (car.position.z <= 0) {
        car.position.set(-0.3, 0.15, 0.3);
        car.rotation.y = -Math.PI / 2;
        direction = "kiri_2";
      }
    } else if (direction === "kiri_2") {
      car.position.x -= 0.2;

      if (car.position.x <= -47) {
        car.position.set(-47, 0.15, -0.3);
        car.rotation.y = Math.PI / 2;
        direction = "kanan_1";
      }
    }
  }

  if (controls.isLocked) {
    const speed = 0.2; // Atur kecepatan jalan di sini

    // Logika Move:
    // moveForward(positif) = Maju
    // moveForward(negatif) = Mundur
    // moveRight(positif)   = Kanan
    // moveRight(negatif)   = Kiri

    if (moveForward) controls.moveForward(speed);
    if (moveBackward) controls.moveForward(-speed);
    if (moveRight) controls.moveRight(speed);
    if (moveLeft) controls.moveRight(-speed);
  }

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
