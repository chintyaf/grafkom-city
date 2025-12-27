// import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


// function updateObjectButtons(mode) {
//     const container = document.getElementById("object-buttons");
//     container.innerHTML = "";

//     const list = assets[mode] || [];
//     list.forEach((asset) => {
//         const btn = document.createElement("button");
//         btn.textContent = asset.name;
//         btn.className = "object-btn";
//         btn.onclick = () => selectObject(asset.id);
//         container.appendChild(btn);
//     });
// }

// function updateStatus() {
//     const statusEl = document.getElementById("status");
//     statusEl.textContent = `Mode: ${state.currentMode || "-"} | Object: ${
//         state.currentObject || "-"
//     }`;
// }

// function getAssetInfo(objectId) {
//     for (const category in assets) {
//         const asset = assets[category].find((a) => a.id === objectId);
//         if (asset) return asset;
//     }
//     return null;
// }

// window.setMode = function (mode) {
//     state.currentMode = mode;
//     state.currentObject = null;

//     document
//         .querySelectorAll(".mode-btn")
//         .forEach((btn) => btn.classList.remove("active"));
//     document.getElementById(`btn-${mode}`).classList.add("active");

//     if (previewObject) {
//         scene.remove(previewObject);
//         previewObject = null;
//     }

//     updateObjectButtons(mode);
//     updateStatus();
// };

// window.selectObject = async function (objectId) {
//     state.currentObject = objectId;

//     document
//         .querySelectorAll(".object-btn")
//         .forEach((btn) => btn.classList.remove("active"));
//     event.target.classList.add("active");

//     const asset = getAssetInfo(objectId);
//     if (asset) await createPreview(asset);

//     updateStatus();
// };

// // ============================================
// // RESIZE
// // ============================================
// window.addEventListener("resize", () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });

// // ============================================
// // ANIMATE
// // ============================================
// function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     renderer.render(scene, camera);
// }

// animate();
// updateStatus();
