import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// const ground = new THREE.Mesh(
//   new THREE.PlaneGeometry(98, 98),
//   new THREE.MeshStandardMaterial({ color: 0xffffff })
// )


const canvas = document.createElement('canvas')
canvas.width = 2
canvas.height = 2

const ctx = canvas.getContext('2d')

// kotak kiri atas
ctx.fillStyle = '#df2060ff' // merah
ctx.fillRect(0, 0, 1, 1)

// kanan atas
ctx.fillStyle = '#00ff00' // hijau
ctx.fillRect(1, 0, 1, 1)

// kiri bawah
ctx.fillStyle = '#4a4a4a' // biru > abu-abu base dasar
ctx.fillRect(0, 1, 1, 1)

// kanan bawah
ctx.fillStyle = '#ffff00' // kuning
ctx.fillRect(1, 1, 1, 1)

// buat texture untuk Three.js
const texture = new THREE.CanvasTexture(canvas)
texture.magFilter = THREE.NearestFilter
texture.minFilter = THREE.NearestFilter

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(98, 98),
  new THREE.MeshStandardMaterial({
    map: texture
  })
)

ground.rotation.x = -Math.PI / 2
scene.add(ground)

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  500
)
camera.position.set(20, 20, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.6))
const sun = new THREE.DirectionalLight(0xffffff, 1)
sun.position.set(30, 50, 30)
scene.add(sun)

const loader = new GLTFLoader()

loader.load('models/Road Bits.glb', (gltf) => {
    const roadBits = gltf.scene
    roadBits.position.set(0, 0, 0)
    // scene.add(roadBits)
    gltf.scene.children.forEach((child, index) => {
        console.log(`Index ${index}: ${child.name}`);
        console.log("makan nasi", child.children);
        console.log("makan nasi", child.children.find(c => c.name === "road_corner"));
    });
    const road_corner = gltf.scene.children[0].children.find(c => c.name === "road_corner");
    const road_corner_curved = gltf.scene.children[0].children.find(c => c.name === "road_corner_curved");
    const road_straight = gltf.scene.children[0].children.find(c => c.name === "road_straight");
    const road_junction = gltf.scene.children[0].children.find(c => c.name === "road_junction");
    const road_straight_crossing = gltf.scene.children[0].children.find(c => c.name === "road_straight_crossing");
    const road_tsplit = gltf.scene.children[0].children.find(c => c.name === "road_tsplit");
    for (let i=-24; i<=24; i++) {
      const road1 = road_straight.clone()
      road1.position.set(0, 0, i*2) // z =2,4,6,8,10,12,14,16,18,20
      // road1.rotation.z = Math.PI / 2
      scene.add(road1) 
    }

    // for (let i=1; i<=24; i++) {
    //   const road2 = road_straight.clone()
    //   road2.position.set(0, 0, -i*2) // z =2,4,6,8,10,12,14,16,18,20
    //   // road2.rotation.z = Math.PI / 2
    //   scene.add(road2) 
    // }

    for (let i=-24; i<=24; i++) {
      const road = road_straight.clone()
      road.position.set(i*2, 0, 0) //x=2,4,6,8,10,12,14,16,18,20
      road.rotation.z = Math.PI / 2
      scene.add(road) 
    }
    const perempatan = road_junction.clone()
    perempatan.position.set(0, 0, 0)
    scene.add(perempatan)
    const road_pinggirbelok = road_corner.clone()
    road_pinggirbelok.position.set(22, 0, 0)
    road_pinggirbelok.rotation.z = -Math.PI / 2
    scene.add(road_pinggirbelok)
    console.log(road_pinggirbelok);
})

// BRIGITTA

loader.load('/models/Road Bits.glb', (gltf) => {
  const roadBits = gltf.scene
  const road_corner = gltf.scene.children[0].children.find(c => c.name === "road_corner");
  const road_straight = gltf.scene.children[0].children.find(c => c.name === "road_straight");
  const road_junction = gltf.scene.children[0].children.find(c => c.name === "road_junction");
  const road_tsplit = gltf.scene.children[0].children.find(c => c.name === "road_tsplit");

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
      [-15, 15], [-30, 15], [-15, 30], [-30, 30], 
      [-15, 0], [-30, 0], [0, 15], [0, 30] 
  ];

  junctions.forEach(pos => {
      const junc = road_junction.clone();
      junc.position.set(pos[0], 0, pos[1]);
      scene.add(junc);
  });
})

// BLOK 1: X=[-2 to -13], Z=[2 to 13]
// BLOK 2: X=[-2 to -13], Z=[17 to 28] 
// BLOK 3: X=[-2 to -13], Z=[32 to 48] 
loader.load('models/Skyscraper(1).glb', (gltf) => {
    // BLOK 1
    const sky1 = gltf.scene.clone()
    sky1.position.set(-10, 0, 5)
    sky1.scale.set(2.5, 2.5, 2.5)
    scene.add(sky1)

    const sky2 = gltf.scene.clone()
    sky2.position.set(-5, 0, 9)
    sky2.scale.set(2.3, 2.3, 2.3)
    scene.add(sky2)

    // BLOK 2
    const sky3 = gltf.scene.clone()
    sky3.position.set(-8, 0, 20)
    sky3.scale.set(2.4, 2.4, 2.4)
    sky3.rotation.y = Math.PI / 4
    scene.add(sky3)

    const sky4 = gltf.scene.clone()
    sky4.position.set(-5, 0, 25)
    sky4.scale.set(2.2, 2.2, 2.2)
    scene.add(sky4)

    // BLOK 3
    const sky5 = gltf.scene.clone()
    sky5.position.set(-7, 0, 36)
    sky5.scale.set(2.5, 2.5, 2.5)
    scene.add(sky5)

    const sky6 = gltf.scene.clone()
    sky6.position.set(-10, 0, 42)
    sky6.scale.set(2.3, 2.3, 2.3)
    scene.add(sky6)
})

loader.load('models/Skyscraper-BwEXdOoUSO.glb', (gltf) => {
    // BLOK 2
    const sky1 = gltf.scene.clone()
    sky1.position.set(-11, 0, 23)
    sky1.scale.set(1.8, 1.8, 1.8)
    scene.add(sky1)
    
    // BLOK 3
    const sky2 = gltf.scene.clone()
    sky2.position.set(-5, 0, 45)
    sky2.scale.set(1.7, 1.7, 1.7)
    scene.add(sky2)
})

loader.load('models/Skyscraper-jIRx0AhYOR.glb', (gltf) => {
    // BLOK 1
    const sky1 = gltf.scene.clone()
    sky1.position.set(-6, 0, 7)
    sky1.scale.set(1.3, 1.3, 1.3)
    scene.add(sky1)
    
    // BLOK 3
    const sky2 = gltf.scene.clone()
    sky2.position.set(-11, 0, 39)
    sky2.scale.set(1.4, 1.4, 1.4)
    scene.add(sky2)
})

loader.load('models/Skyscraper.glb', (gltf) => {
    const sky = gltf.scene
    sky.position.set(-4, -0.2, 4)
    sky.scale.set(0.5, 0.5, 0.5)
    sky.rotation.y = -Math.PI /2
    scene.add(sky)
})

loader.load('models/Large Building.glb', (gltf) => {
    // BLOK 1
    const lg1 = gltf.scene.clone()
    lg1.position.set(-8, 0, 11)
    lg1.scale.set(2.5, 2.5, 2.5)
    scene.add(lg1)

    // BLOK 2
    const lg2 = gltf.scene.clone()
    lg2.position.set(-6, 0, 19)
    lg2.scale.set(2.3, 2.3, 2.3)
    scene.add(lg2)

    // BLOK 3
    const lg3 = gltf.scene.clone()
    lg3.position.set(-9, 0, 46)
    lg3.scale.set(2.6, 2.6, 2.6)
    scene.add(lg3)
})

loader.load('models/Large Building-ppwtREejXg.glb', (gltf) => {
    // BLOK 2
    const lb1 = gltf.scene.clone()
    lb1.position.set(-11, 0, 27)
    lb1.scale.set(2, 2, 2)
    scene.add(lb1)

    // BLOK 3
    const lb2 = gltf.scene.clone()
    lb2.position.set(-5, 0, 34)
    lb2.scale.set(2.2, 2.2, 2.2)
    scene.add(lb2)
})

loader.load('models/Large Building-3IhrYZp6tP.glb', (gltf) => {
    // BLOK 3
    const lg = gltf.scene.clone()
    lg.position.set(-11, 0, 45)
    lg.scale.set(2.3, 2.3, 2.3)
    scene.add(lg)
})

loader.load('models/Small Building.glb', (gltf) => {
    // BLOK 1
    const sm1 = gltf.scene.clone()
    sm1.position.set(-4, 0, 11)
    sm1.scale.set(2, 2, 2)
    scene.add(sm1)
    
    // BLOK 2
    const sm2 = gltf.scene.clone()
    sm2.position.set(-4, 0, 22)
    sm2.scale.set(2.1, 2.1, 2.1)
    scene.add(sm2)
    
    // BLOK 3
    const sm3 = gltf.scene.clone()
    sm3.position.set(-4, 0, 40)
    sm3.scale.set(1.9, 1.9, 1.9)
    scene.add(sm3)
})

loader.load('models/Small Building-gyjF60t7CG.glb', (gltf) => {
    // BLOK 1
    const sm1 = gltf.scene.clone()
    sm1.position.set(-12, 0, 6)
    sm1.scale.set(2, 2, 2)
    scene.add(sm1)
    
    // BLOK 2
    const sm2 = gltf.scene.clone()
    sm2.position.set(-9, 0, 18)
    sm2.scale.set(2.1, 2.1, 2.1)
    scene.add(sm2)
})

loader.load('models/Low Building.glb', (gltf) => {
    
    // BLOK 2
    const lw2 = gltf.scene.clone()
    lw2.position.set(-11, 0, 19)
    lw2.scale.set(5.8, 5.8, 5.8)
    scene.add(lw2)
    
    // BLOK 3
    const lw3 = gltf.scene.clone()
    lw3.position.set(-6, 0, 33)
    lw3.scale.set(6, 6, 6)
    scene.add(lw3)
})

loader.load('models/Low Building-4RoPd9BkSx.glb', (gltf) => {
    // BLOK 3
    const lw = gltf.scene.clone()
    lw.position.set(-10, 0, 37)
    lw.scale.set(6.2, 6.2, 6.2)
    scene.add(lw)
})

loader.load('models/Building.glb', (gltf) => {
    // BLOK 1
    const bd1 = gltf.scene.clone()
    bd1.position.set(-10, 0, 8)
    bd1.scale.set(2, 2, 2)
    scene.add(bd1)
    
    // BLOK 2
    const bd2 = gltf.scene.clone()
    bd2.position.set(-6, 0, 26)
    bd2.scale.set(2.1, 2.1, 2.1)
    scene.add(bd2)
})

loader.load('models/Building-7lMEpT2ICD.glb', (gltf) => {
    // BLOK 1
    const bd = gltf.scene.clone()
    bd.position.set(-12, 0, 10)
    bd.scale.set(2.2, 2.2, 2.2)
    scene.add(bd)
})

loader.load('models/Fire Hydrant.glb', (gltf) => {
    const fh1 = gltf.scene.clone()
    fh1.position.set(-3, 0, 5)
    fh1.scale.set(0.8, 0.8, 0.8)
    scene.add(fh1)
    
    const fh2 = gltf.scene.clone()
    fh2.position.set(-3, 0, 20)
    fh2.scale.set(0.8, 0.8, 0.8)
    scene.add(fh2)
    
    const fh3 = gltf.scene.clone()
    fh3.position.set(-3, 0, 35)
    fh3.scale.set(0.8, 0.8, 0.8)
    scene.add(fh3)
})

loader.load('models/Bench.glb', (gltf) => {
    for(let z=4; z<48; z+=10){
        const bench = gltf.scene.clone()
        bench.position.set(-14, 0, z)
        bench.rotation.y = Math.PI / 2
        bench.scale.set(0.5, 0.5, 0.5)
        scene.add(bench)
    }
})

loader.load('models/Traffic light.glb', (gltf) => {
    const tl1 = gltf.scene.clone()
    tl1.position.set(-14, 0, 16)
    tl1.scale.set(0.6, 0.6, 0.6)
    scene.add(tl1)
    
    const tl2 = gltf.scene.clone()
    tl2.position.set(-14, 0, 31)
    tl2.scale.set(0.6, 0.6, 0.6)
    scene.add(tl2)
    
    const tl3 = gltf.scene.clone()
    tl3.position.set(-1, 0, 16)
    tl3.scale.set(0.6, 0.6, 0.6)
    scene.add(tl3)
    
    const tl4 = gltf.scene.clone()
    tl4.position.set(-1, 0, 31)
    tl4.scale.set(0.6, 0.6, 0.6)
    scene.add(tl4)
})

loader.load('models/Bush.glb', (gltf) => {
    for(let z=4; z<48; z+=8){
        const bush = gltf.scene.clone()
        bush.position.set(-2, 0, z)
        bush.scale.set(0.8, 0.8, 0.8)
        scene.add(bush)
    }
})

loader.load('models/Trees.glb', (gltf) => {
    for(let z=6; z<48; z+=12){
        const tree = gltf.scene.clone()
        tree.position.set(-3, 0, z)
        tree.scale.set(1.2, 1.2, 1.2)
        scene.add(tree)
    }
})

loader.load('models/Taxi.glb', (gltf) => {
    const taxi1 = gltf.scene.clone()
    taxi1.position.set(-7, 0, 12)
    taxi1.scale.set(0.7, 0.7, 0.7)
    scene.add(taxi1)
    
    const taxi2 = gltf.scene.clone()
    taxi2.position.set(-9, 0, 24)
    taxi2.scale.set(0.7, 0.7, 0.7)
    taxi2.rotation.y = Math.PI / 2
    scene.add(taxi2)
})

loader.load('models/Police Car.glb', (gltf) => {
    const pol = gltf.scene.clone()
    pol.position.set(-5, 0, 17)
    pol.scale.set(0.7, 0.7, 0.7)
    scene.add(pol)
})

loader.load('models/Stationwagon.glb', (gltf) => {
    const car1 = gltf.scene.clone()
    car1.position.set(-11, 0, 8)
    car1.scale.set(0.7, 0.7, 0.7)
    scene.add(car1)
    
    const car2 = gltf.scene.clone()
    car2.position.set(-8, 0, 35)
    car2.scale.set(0.7, 0.7, 0.7)
    car2.rotation.y = -Math.PI / 4
    scene.add(car2)
})

// ---------------------------------------------------------------------------
// BLOK 4: X=[-17 to -28], Z=[2 to 13]
// BLOK 5: X=[-17 to -28], Z=[17 to 28]
// BLOK 6: X=[-17 to -28], Z=[32 to 48]
// ---------------------------------------------------------------------------

loader.load('models/Factory.glb', (gltf) => {
    // BLOK 4
    const fac1 = gltf.scene.clone()
    fac1.position.set(-21, 0, 7)
    fac1.scale.set(2.5, 2.5, 2.5)
    scene.add(fac1)

    // BLOK 5
    const fac2 = gltf.scene.clone()
    fac2.position.set(-24, 0, 22)
    fac2.scale.set(2.4, 2.4, 2.4)
    fac2.rotation.y = Math.PI / 4
    scene.add(fac2)

    // BLOK 6
    const fac3 = gltf.scene.clone()
    fac3.position.set(-20, 0, 38)
    fac3.scale.set(2.5, 2.5, 2.5)
    scene.add(fac3)
    
    const fac4 = gltf.scene.clone()
    fac4.position.set(-25, 0, 44)
    fac4.scale.set(2.3, 2.3, 2.3)
    fac4.rotation.y = -Math.PI / 6
    scene.add(fac4)
})

loader.load('models/Factory (1).glb', (gltf) => {
    // BLOK 4
    const fac1 = gltf.scene.clone()
    fac1.position.set(-25, 0, 9)
    fac1.rotation.y = -Math.PI / 2
    fac1.scale.set(0.006, 0.006, 0.006)
    scene.add(fac1)

    // BLOK 5
    const fac2 = gltf.scene.clone()
    fac2.position.set(-19, 0, 20)
    fac2.rotation.y = Math.PI
    fac2.scale.set(0.006, 0.006, 0.006)
    scene.add(fac2)
    
    const fac3 = gltf.scene.clone()
    fac3.position.set(-27, 0, 26)
    fac3.scale.set(0.006, 0.006, 0.006)
    scene.add(fac3)

    // BLOK 6
    const fac4 = gltf.scene.clone()
    fac4.position.set(-22, 0, 35)
    fac4.scale.set(0.006, 0.006, 0.006)
    scene.add(fac4)
})

loader.load('models/Factory-itemputih.glb', (gltf) => {
    // BLOK 4
    const fac1 = gltf.scene.clone()
    fac1.position.set(-19, 0, 5)
    fac1.scale.set(2.8, 2.8, 2.8)
    scene.add(fac1)

    // BLOK 5
    const fac2 = gltf.scene.clone()
    fac2.position.set(-22, 0, 19)
    fac2.rotation.y = -Math.PI / 2
    fac2.scale.set(3, 3, 3)
    scene.add(fac2)
    
    const fac3 = gltf.scene.clone()
    fac3.position.set(-26, 0, 24)
    fac3.scale.set(2.9, 2.9, 2.9)
    scene.add(fac3)

    // BLOK 6
    const fac4 = gltf.scene.clone()
    fac4.position.set(-18, 0, 41)
    fac4.rotation.y = Math.PI / 4
    fac4.scale.set(3.1, 3.1, 3.1)
    scene.add(fac4)
})

loader.load('models/Factory (2).glb', (gltf) => {
    // BLOK 5
    const fac1 = gltf.scene.clone()
    fac1.position.set(-20, 0, 25)
    fac1.scale.set(0.005, 0.005, 0.005)
    scene.add(fac1)
    
    // BLOK 6
    const fac2 = gltf.scene.clone()
    fac2.position.set(-26, 0, 36)
    fac2.scale.set(0.005, 0.005, 0.005)
    fac2.rotation.y = Math.PI / 2
    scene.add(fac2)
})

loader.load('models/Factory (3).glb', (gltf) => {
    // BLOK 4
    const fac1 = gltf.scene.clone()
    fac1.position.set(-23, 0, 11)
    fac1.scale.set(0.005, 0.005, 0.005)
    scene.add(fac1)
    
    // BLOK 6
    const fac2 = gltf.scene.clone()
    fac2.position.set(-24, 0, 46)
    fac2.scale.set(0.005, 0.005, 0.005)
    fac2.rotation.y = -Math.PI / 3
    scene.add(fac2)
})

loader.load('models/Factory (4).glb', (gltf) => {
    // BLOK 5
    const fac = gltf.scene.clone()
    fac.position.set(-18, 0, 27)
    fac.scale.set(0.005, 0.005, 0.005)
    scene.add(fac)
})

loader.load('models/Wind turbine.glb', (gltf) => {
    // BLOK 6 - Ladang angin
    const turbin1 = gltf.scene.clone()
    turbin1.position.set(-19, 0, 46)
    turbin1.scale.set(0.2, 0.2, 0.2)
    scene.add(turbin1)

    const turbin2 = gltf.scene.clone()
    turbin2.position.set(-23, 0, 46)
    turbin2.scale.set(0.2, 0.2, 0.2)
    scene.add(turbin2)

    const turbin3 = gltf.scene.clone()
    turbin3.position.set(-27, 0, 46)
    turbin3.scale.set(0.2, 0.2, 0.2)
    scene.add(turbin3)
})

loader.load('models/Watertower.glb', (gltf) => {
    // BLOK 4
    const water1 = gltf.scene.clone()
    water1.position.set(-27, 0, 6)
    water1.scale.set(1.4, 1.4, 1.4)
    scene.add(water1)

    // BLOK 5
    const water2 = gltf.scene.clone()
    water2.position.set(-19, 0, 23)
    water2.scale.set(1.5, 1.5, 1.5)
    scene.add(water2)

    // BLOK 6
    const water3 = gltf.scene.clone()
    water3.position.set(-25, 0, 40)
    water3.scale.set(1.3, 1.3, 1.3)
    scene.add(water3)
})

loader.load('models/Dumpster (1).glb', (gltf) => {
    // BLOK 4
    const dump1 = gltf.scene.clone()
    dump1.position.set(-20, 0, 11)
    dump1.scale.set(1.4, 1.4, 1.4)
    scene.add(dump1)
    
    // BLOK 5
    const dump2 = gltf.scene.clone()
    dump2.position.set(-25, 0, 21)
    dump2.scale.set(1.3, 1.3, 1.3)
    scene.add(dump2)
    
    // BLOK 6
    const dump3 = gltf.scene.clone()
    dump3.position.set(-21, 0, 34)
    dump3.scale.set(1.4, 1.4, 1.4)
    scene.add(dump3)
})

loader.load('models/Dumpster.glb', (gltf) => {
    const dmp1 = gltf.scene.clone()
    dmp1.position.set(-17, 0, 8)
    dmp1.scale.set(1.2, 1.2, 1.2)
    scene.add(dmp1)
    
    const dmp2 = gltf.scene.clone()
    dmp2.position.set(-17, 0, 18)
    dmp2.scale.set(1.2, 1.2, 1.2)
    scene.add(dmp2)
    
    const dmp3 = gltf.scene.clone()
    dmp3.position.set(-17, 0, 37)
    dmp3.scale.set(1.2, 1.2, 1.2)
    scene.add(dmp3)
})

loader.load('models/Building construction crane.glb', (gltf) => {
    // BLOK 5
    const crane1 = gltf.scene.clone()
    crane1.position.set(-23, 0, 18)
    crane1.scale.set(1.5, 1.5, 1.5)
    scene.add(crane1)
    
    // BLOK 6
    const crane2 = gltf.scene.clone()
    crane2.position.set(-27, 0, 33)
    crane2.scale.set(1.6, 1.6, 1.6)
    crane2.rotation.y = Math.PI / 3
    scene.add(crane2)
})

loader.load('models/Bulldozer.glb', (gltf) => {
    // BLOK 4
    const bull1 = gltf.scene.clone()
    bull1.position.set(-22, 0, 10)
    bull1.scale.set(0.3, 0.3, 0.3)
    scene.add(bull1)
    
    // BLOK 5
    const bull2 = gltf.scene.clone()
    bull2.position.set(-28, 0, 28)
    bull2.scale.set(0.3, 0.3, 0.3)
    bull2.rotation.y = -Math.PI / 4
    scene.add(bull2)
})

loader.load('models/Barrel.glb', (gltf) => {
    // BLOK 4
    for(let i=0; i<4; i++){
        const bar = gltf.scene.clone()
        bar.position.set(-18, 0, 4 + (i*0.7))
        scene.add(bar)
    }
    
    // BLOK 5
    for(let i=0; i<5; i++){
        const bar = gltf.scene.clone()
        bar.position.set(-17, 0, 22 + (i*0.8))
        scene.add(bar)
    }
})

loader.load('models/Truck.glb', (gltf) => {
    const truck1 = gltf.scene.clone()
    truck1.position.set(-22, 0, 8)
    truck1.scale.set(0.8, 0.8, 0.8)
    scene.add(truck1)
    
    const truck2 = gltf.scene.clone()
    truck2.position.set(-26, 0, 20)
    truck2.scale.set(0.8, 0.8, 0.8)
    truck2.rotation.y = Math.PI / 2
    scene.add(truck2)
})

// ---------------------------------------------------------------------------
// BLOK 7: X=[-32 to -48], Z=[2 to 13]
// BLOK 8: X=[-32 to -48], Z=[17 to 28]
// BLOK 9: X=[-32 to -48], Z=[32 to 48]
// ---------------------------------------------------------------------------

loader.load('models/Crane.glb', (gltf) => {
    // BLOK 8
    const crane1 = gltf.scene.clone()
    crane1.position.set(-38, 0, 22)
    crane1.rotation.y = Math.PI / 4
    scene.add(crane1)
    
    // BLOK 9
    const crane2 = gltf.scene.clone()
    crane2.position.set(-42, 0, 40)
    crane2.rotation.y = -Math.PI / 3
    scene.add(crane2)
})

loader.load('models/Shipping Container.glb', (gltf) => {
    // BLOK 7 - Tumpukan kontainer
    const con1 = gltf.scene.clone()
    con1.position.set(-36, 0, 6)
    scene.add(con1)
    
    const con2 = gltf.scene.clone()
    con2.position.set(-36, 0, 8)
    con2.rotation.y = 0.2
    scene.add(con2)
    
    const con3 = gltf.scene.clone()
    con3.position.set(-40, 0, 5)
    scene.add(con3)
    
    const con4 = gltf.scene.clone()
    con4.position.set(-40, 2.5, 5) 
    con4.rotation.y = 0.1
    scene.add(con4)

    // BLOK 8 
    for(let i=0; i<5; i++){
        const conRow = gltf.scene.clone()
        conRow.position.set(-34, 0, 18 + (i*2))
        scene.add(conRow)
    }
    
    const con5 = gltf.scene.clone()
    con5.position.set(-39, 0, 24)
    scene.add(con5)
    
    const con6 = gltf.scene.clone()
    con6.position.set(-39, 2.5, 24)
    con6.rotation.y = 0.15
    scene.add(con6)
    
    const con7 = gltf.scene.clone()
    con7.position.set(-44, 0, 20)
    scene.add(con7)

    // BLOK 9
    for(let i=0; i<4; i++){
        const wall1 = gltf.scene.clone()
        wall1.position.set(-46, 0, 34 + (i*3))
        scene.add(wall1)
        
        const wall2 = gltf.scene.clone()
        wall2.position.set(-46, 2.5, 34 + (i*3))
        wall2.rotation.y = 0.1
        scene.add(wall2)
    }
    
    for(let i=0; i<3; i++){
        const conRow2 = gltf.scene.clone()
        conRow2.position.set(-38, 0, 36 + (i*3))
        scene.add(conRow2)
    }
})

loader.load('models/Container Red.glb', (gltf) => {
    // BLOK 7
    const red1 = gltf.scene.clone()
    red1.position.set(-43, 0, 9)
    scene.add(red1)

    const red2 = gltf.scene.clone()
    red2.position.set(-43, 2.5, 9)
    red2.rotation.y = 0.1
    scene.add(red2)
    
    // BLOK 8
    for(let i=0; i<3; i++){
        const redRow = gltf.scene.clone()
        redRow.position.set(-40, 0, 18 + (i*2))
        scene.add(redRow)
    }
    
    // BLOK 9
    const red3 = gltf.scene.clone()
    red3.position.set(-35, 0, 38)
    scene.add(red3)
})

loader.load('models/Container Green.glb', (gltf) => {
    // BLOK 7
    const grn1 = gltf.scene.clone()
    grn1.position.set(-38, 0, 11)
    grn1.rotation.y = Math.PI / 3
    scene.add(grn1)
    
    // BLOK 8
    for(let i=0; i<4; i++){
        const grnRow = gltf.scene.clone()
        grnRow.position.set(-46, 0, 19 + (i*2))
        grnRow.rotation.y = -0.2
        scene.add(grnRow)
    }
    
    // BLOK 9
    const grn2 = gltf.scene.clone()
    grn2.position.set(-42, 0, 44)
    scene.add(grn2)
})

loader.load('models/Container Small.glb', (gltf) => {
    // BLOK 7
    for(let i=0; i<4; i++){
        const smCon = gltf.scene.clone()
        smCon.position.set(-34, 0, 4 + (i*2))
        scene.add(smCon)
    }
    
    // BLOK 9
    for(let i=0; i<5; i++){
        const smCon2 = gltf.scene.clone()
        smCon2.position.set(-33, 0, 34 + (i*2))
        scene.add(smCon2)
    }
})

loader.load('models/Barrel.glb', (gltf) => {
    // BLOK 7
    for(let i=0; i<8; i++){
        const bar = gltf.scene.clone()
        bar.position.set(-32 + (i%2)*0.5, 0, 8 + (i*0.6))
        scene.add(bar)
    }
    
    // BLOK 8
    for(let i=0; i<6; i++){
        const bar2 = gltf.scene.clone()
        bar2.position.set(-32, 0, 20 + (i*1))
        scene.add(bar2)
    }
    
    // BLOK 9
    for(let i=0; i<7; i++){
        const bar3 = gltf.scene.clone()
        bar3.position.set(-47, 0, 33 + (i*1.5))
        scene.add(bar3)
    }
})

loader.load('models/Pallet.glb', (gltf) => {
    // BLOK 7
    for(let i=0; i<4; i++){
        const pal = gltf.scene.clone()
        pal.position.set(-45, 0, 6 + (i*1.5))
        scene.add(pal)
    }
    
    // BLOK 8
    for(let i=0; i<5; i++){
        const pal2 = gltf.scene.clone()
        pal2.position.set(-36, 0, 19 + (i*1.8))
        scene.add(pal2)
    }
    
    // BLOK 9
    for(let i=0; i<4; i++){
        const pal3 = gltf.scene.clone()
        pal3.position.set(-40, 0, 35 + (i*2))
        scene.add(pal3)
    }
})

loader.load('models/Box.glb', (gltf) => {
    // BLOK 7
    for(let i=0; i<10; i++){
        const box = gltf.scene.clone()
        box.position.set(-33 + (i%3)*0.8, 0, 5 + Math.floor(i/3)*1.2)
        box.scale.set(0.8, 0.8, 0.8)
        scene.add(box)
    }
})

loader.load('models/Box B.glb', (gltf) => {
    // BLOK 8
    for(let i=0; i<8; i++){
        const boxB = gltf.scene.clone()
        boxB.position.set(-43, 0, 22 + (i*0.8))
        boxB.scale.set(0.7, 0.7, 0.7)
        scene.add(boxB)
    }
})

loader.load('models/Parking Lot.glb', (gltf) => {
    // BLOK 8
    const park1 = gltf.scene.clone()
    park1.position.set(-34, 0, 26)
    park1.scale.set(2, 2, 2)
    scene.add(park1)
    
    // BLOK 9
    const park2 = gltf.scene.clone()
    park2.position.set(-44, 0, 46)
    park2.scale.set(2.2, 2.2, 2.2)
    park2.rotation.y = Math.PI / 2
    scene.add(park2)
})

loader.load('models/Pickup Truck.glb', (gltf) => {
    const pick1 = gltf.scene.clone()
    pick1.position.set(-35, 0, 10)
    pick1.scale.set(0.7, 0.7, 0.7)
    scene.add(pick1)
    
    const pick2 = gltf.scene.clone()
    pick2.position.set(-41, 0, 27)
    pick2.scale.set(0.7, 0.7, 0.7)
    pick2.rotation.y = Math.PI / 2
    scene.add(pick2)
    
    const pick3 = gltf.scene.clone()
    pick3.position.set(-37, 0, 42)
    pick3.scale.set(0.7, 0.7, 0.7)
    scene.add(pick3)
})

loader.load('models/Truck.glb', (gltf) => {
    const truck1 = gltf.scene.clone()
    truck1.position.set(-39, 0, 7)
    truck1.scale.set(0.8, 0.8, 0.8)
    scene.add(truck1)
    
    const truck2 = gltf.scene.clone()
    truck2.position.set(-45, 0, 23)
    truck2.scale.set(0.8, 0.8, 0.8)
    truck2.rotation.y = -Math.PI / 3
    scene.add(truck2)
    
    const truck3 = gltf.scene.clone()
    truck3.position.set(-35, 0, 39)
    truck3.scale.set(0.8, 0.8, 0.8)
    scene.add(truck3)
})

// ==========================================
// END OF BRIGITTA
// ==========================================
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

//CHINTYA
//KODE
//END OF CHINTYA

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
loader.load('/models/city_park_at_sunset.glb', (gltf) => {
  const park = gltf.scene
  park.position.set(25, 0, -25)
  park.scale.set(0.1,0.1,0.1)
  scene.add(park)
})

loader.load('/models/school_building.glb', (gltf) => {
  const school = gltf.scene
  school.position.set(25, 0, -8)
  school.scale.set(4,4,4)
  scene.add(school)
})

loader.load('/models/soccer_field.glb', (gltf) => {
  const soccer = gltf.scene
  soccer.position.set(20, 0, -8)
  soccer.scale.set(0.1,0.1,0.1)
  scene.add(soccer)
})

loader.load('/models/restaurant_building.glb', (gltf) => {
  const restaurant = gltf.scene
  restaurant.position.set(5,1, -5)
  restaurant.scale.set(0.3,0.3,0.3)
  scene.add(restaurant)
})

loader.load('/models/bakery.glb', (gltf) => {
  const bakery = gltf.scene
  bakery.position.set(3,0, -45)
  bakery.scale.set(0.3,0.3,0.3)
  scene.add(bakery)
})

loader.load('/models/apartment_building.glb', (gltf) => {
  const apartment = gltf.scene
  apartment.position.set(7,0, -45)
  apartment.scale.set(0.006,0.006,0.006)
  scene.add(apartment)
})

loader.load('/models/gas_station.glb', (gltf) => {
  const gas_station = gltf.scene
  gas_station.position.set(20,0, -45)
  gas_station.scale.set(0.3,0.3,0.3)
  scene.add(gas_station)
})

//END OF JEA

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()