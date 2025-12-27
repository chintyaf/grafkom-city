import * as THREE from "three";

export function setupScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaec6cf);
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    return { scene, camera, renderer };
}

export function setupLighting(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Directional Light (matahari)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);

    scene.add(directionalLight);
}


export function animate(renderer, scene, camera, controls) {
    requestAnimationFrame(() =>
        animate(renderer, scene, camera, controls)
    );

    controls.update();
    renderer.render(scene, camera);
}