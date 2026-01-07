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
ctx.fillStyle = '#0000ff' // biru
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
loader.load('/models/Traffic light.glb', (gltf) => {
  const traffic = gltf.scene
  traffic.position.set(0.8, 0, 0.8)
  scene.add(traffic)
})

loader.load('/models/Taxi.glb', (gltf) => {
  const taxi = gltf.scene
  taxi.position.set(0, 0, 5)
  scene.add(taxi)
})

loader.load('/models/Stationwagon.glb', (gltf) => {
  const car = gltf.scene
  car.position.set(-5, 0.1, 5)
  scene.add(car)
})

loader.load('/models/Building B.glb', (gltf) => {
  const building_b = gltf.scene
  building_b.position.set(-10, 0, 5)
  scene.add(building_b)
})

loader.load('/models/Building-7lMEpT2ICD.glb', (gltf) => {
  const building_7 = gltf.scene
  building_7.position.set(-15, 0, 5)
  scene.add(building_7)
})

loader.load('/models/Building-bbH2Bg73qM.glb', (gltf) => {
  const building_bb = gltf.scene
  building_bb.position.set(-20, 0, 5)
  scene.add(building_bb)
})

// taxi.position.set(0, 0, 5)

// END OF BRIGITTA

//CHINTYA
//KODE
//END OF CHINTYA

//NATALIE
//KODE
//END OF NATALIE

//JEA
//KODE
//END OF JEA

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()