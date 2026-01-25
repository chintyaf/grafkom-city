import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

export class User {
    constructor(orbitControls, scene, camera, domElement, modelPath) {
        this.orbitControls = orbitControls;
        this.scene = scene;
        this.camera = camera;
        this.modelPath = modelPath;

        /* ===== MODEL ===== */
        this.character = null;
        this.mixer = null;
        this.idleAction = null;
        this.walkAction = null;
        this.currentAction = null;

        /* ===== STATE ===== */
        this.keys = { w: false, a: false, s: false, d: false };
        this.clock = new THREE.Clock();
        this.cameraMode = "third"; // "third" | "first"

        /* ===== POINTER LOCK ===== */
        this.fpControls = new PointerLockControls(camera, domElement);
        this.fpHeight = 1.7;
        this.speed = 6;

        this.camera.position.y = this.fpHeight;

        this.loadModel();
        this.setupControls();
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load(this.modelPath, (gltf) => {
            this.character = gltf.scene;
            this.character.scale.set(0.5, 0.5, 0.5);
            this.scene.add(this.character);

            this.mixer = new THREE.AnimationMixer(this.character);

            const idleClip = THREE.AnimationClip.findByName(
                gltf.animations,
                "Armature|Idle",
            );
            const walkClip = THREE.AnimationClip.findByName(
                gltf.animations,
                "Armature|Walk",
            );

            this.idleAction = this.mixer.clipAction(idleClip);
            this.walkAction = this.mixer.clipAction(walkClip);

            this.idleAction.play();
            this.currentAction = this.idleAction;
        });
    }

    setupControls() {
        window.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();
            if (key in this.keys) this.keys[key] = true;

            if (key === "v") {
                this.cameraMode =
                    this.cameraMode === "third" ? "first" : "third";

                if (this.cameraMode === "first") {
                    this.character.visible = false;
                    this.fpControls.lock();
                    this.camera.position.y =
                        this.character.position.y + this.fpHeight;
                    this.camera.position.x = this.character.position.x;
                    this.camera.position.z = this.character.position.z;
                } else {
                    this.fpControls.unlock();
                    if (this.character) {
                        this.character.visible = true;
                        // offset di belakang karakter
                        const tpOffset = new THREE.Vector3(0, 5, 10);
                        this.camera.position.copy(
                            this.character.position.clone().add(tpOffset),
                        );

                        // set target OrbitControls ke karakter
                        this.orbitControls.target.copy(
                            this.character.position
                                .clone()
                                .add(new THREE.Vector3(0, 1.5, 0)),
                        );
                        this.orbitControls.update();
                    }
                }
            }
        });

        window.addEventListener("keyup", (e) => {
            const key = e.key.toLowerCase();
            if (key in this.keys) this.keys[key] = false;
        });
    }

    update(delta, orbitControls) {
        if (!this.character) return;
        // console.log("Character update called");
        if (this.mixer) this.mixer.update(delta);

        let isMoving = false;

        if (this.cameraMode === "third") {
            isMoving = this.thirdPerson(delta, orbitControls);
        } else {
            isMoving = this.firstPerson(delta);
        }

        /* ===== ANIMATION ===== */
        if (this.idleAction && this.walkAction) {
            const next = isMoving ? this.walkAction : this.idleAction;
            if (this.currentAction !== next) {
                this.currentAction.fadeOut(0.2);
                next.reset().fadeIn(0.2).play();
                this.currentAction = next;
            }
        }
    }

    thirdPerson(delta, orbitControls) {
        this.character.visible = true;
        orbitControls.enabled = true;

        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

        const moveDir = new THREE.Vector3();
        if (this.keys.w) moveDir.add(forward);
        if (this.keys.s) moveDir.addScaledVector(forward, -1);
        if (this.keys.d) moveDir.add(right);
        if (this.keys.a) moveDir.addScaledVector(right, -1);

        let isMoving = false;
        if (moveDir.lengthSq() > 0) {
            isMoving = true;
            moveDir.normalize();
            this.character.position.addScaledVector(
                moveDir,
                this.speed * delta,
            );
            this.character.lookAt(this.character.position.clone().add(moveDir));
        }

        // smooth movement kamera mengikuti karakter
        const targetOffset = new THREE.Vector3(0, 1.5, 0); // tinggi target
        orbitControls.target.lerp(
            this.character.position.clone().add(targetOffset),
            0.1,
        );
        if (isMoving) {
            const deltaPos = moveDir.clone().multiplyScalar(this.speed * delta);
            this.camera.position.add(deltaPos); // geser kamera sesuai karakter
        }

        return isMoving;
    }

    firstPerson(delta) {
        if (!this.fpControls.isLocked) return false;

        let isMoving = false;
        const speed = this.speed * delta;

        if (this.keys.w) {
            this.fpControls.moveForward(speed);
            isMoving = true;
        }
        if (this.keys.s) {
            this.fpControls.moveForward(-speed);
            isMoving = true;
        }
        if (this.keys.d) {
            this.fpControls.moveRight(speed);
            isMoving = true;
        }
        if (this.keys.a) {
            this.fpControls.moveRight(-speed);
            isMoving = true;
        }

        // sinkron body karakter ke posisi kamera
        // this.character.position.copy(this.fpControls.getObject().position);
        // this.character.position.y -= this.fpHeight;

        return isMoving;
    }
}
