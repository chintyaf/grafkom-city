// ui.js
import * as THREE from "three";

let raycaster;
let center;
let crosshair;
let userRef;
let cameraRef;
let clickableObjectsRef;
let showPopupRef;
const mouse = new THREE.Vector2();

/**
 * Init UI & interaction (dipanggil sekali di main.js)
 */
export function initUI({ user, camera, clickableObjects, showPopup }) {
    window.addEventListener("mousemove", (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    userRef = user;
    cameraRef = camera;
    clickableObjectsRef = clickableObjects;
    showPopupRef = showPopup;

    crosshair = document.getElementById("crosshair");

    raycaster = new THREE.Raycaster();
    center = new THREE.Vector2(0, 0);

    window.addEventListener("click", onClick);
}

/**
 * Toggle crosshair berdasarkan camera mode
 */
export function updateUI() {
    if (userRef.cameraMode === "first") {
        crosshair.style.display = "block";
        detectTarget();
        document.body.style.cursor = "none";
    } else {
        crosshair.style.display = "none";
        detectHoverThirdPerson();
    }
}

/**
 * Handle click interaction (FPS-style)
 */
function onClick(event) {
    // ===== FIRST PERSON =====
    if (userRef.cameraMode === "first") {
        if (!userRef.fpControls.isLocked) return;

        raycaster.setFromCamera(center, cameraRef);
        handleIntersect();
        return;
    }

    // ===== THIRD PERSON =====
    if (userRef.cameraMode === "third") {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, cameraRef);
        handleIntersect();
    }
}

function detectTarget() {
    if (userRef.cameraMode !== "first" || !userRef.fpControls.isLocked) {
        crosshair.style.color = "white";
        return;
    }

    raycaster.setFromCamera(center, cameraRef);
    const intersects = raycaster.intersectObjects(clickableObjectsRef, true);

    if (!intersects.length) {
        crosshair.style.color = "white";
        return;
    }

    let obj = intersects[0].object;

    while (obj.parent && !obj.userData?.title) {
        obj = obj.parent;
    }

    // kena building
    if (obj.userData?.title) {
        crosshair.style.color = "lime";
    } else {
        crosshair.style.color = "white";
    }
}

export function bindPopupClose() {
    const closeBtn = document.getElementById("popup-close");
    if (!closeBtn) return;

    closeBtn.addEventListener("click", () => {
        hidePopup(); // fungsi kamu sendiri

        // balik ke first person
        if (userRef.cameraMode === "first") {
            userRef.fpControls.lock();
            document.body.style.cursor = "none";
        }
    });
}

function detectHoverThirdPerson() {
    if (userRef.cameraMode !== "third") return;

    raycaster.setFromCamera(mouse, cameraRef);
    const intersects = raycaster.intersectObjects(clickableObjectsRef, true);

    if (!intersects.length) {
        document.body.style.cursor = "default";
        return;
    }

    let obj = intersects[0].object;

    while (obj.parent && !obj.userData?.title) {
        obj = obj.parent;
    }

    if (obj.userData?.title) {
        document.body.style.cursor = "pointer"; // atau "zoom-in"
    } else {
        document.body.style.cursor = "default";
    }
}

function handleIntersect() {
    const intersects = raycaster.intersectObjects(clickableObjectsRef, true);
    if (!intersects.length) return;

    let obj = intersects[0].object;

    while (obj.parent && !obj.userData?.title) {
        obj = obj.parent;
    }

    if (!obj.userData?.title) return;

    // keluar pointer lock kalau dari FP
    if (userRef.cameraMode === "first") {
        userRef.fpControls.unlock();
        document.body.style.cursor = "default";
    }

    showPopupRef(obj.userData);
}
