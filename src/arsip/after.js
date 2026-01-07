import * as THREE from "three"; 
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// import { controls } from "./before.js";

// export const control = {
//   speed: 10,
//   enabled: true
// };


// ============================================
// ORBIT CONTROLS
// ============================================
const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

animate();
