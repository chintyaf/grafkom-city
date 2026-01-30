import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class Character {
    constructor(scene, modelPath, followOffset = new THREE.Vector3(0, 5, -15)) {
        this.scene = scene;
        this.modelPath = modelPath;
        this.followOffset = followOffset;

        this.character = null;
        this.mixer = null;

        this.idleAction = null;
        this.walkAction = null;
        this.currentAction = null;

        this.clock = new THREE.Clock();
        this.keys = { w: false, a: false, s: false, d: false, space: false };
        this.cameraTarget = new THREE.Vector3();

        this.loadModel();
        this.setupControls();
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load(this.modelPath, (gltf) => {
            this.character = gltf.scene;
            this.scene.add(this.character);

            this.mixer = new THREE.AnimationMixer(this.character);

            const idleClip = THREE.AnimationClip.findByName(
                gltf.animations,
                "Armature|Idle"
            );
            const walkClip = THREE.AnimationClip.findByName(
                gltf.animations,
                "Armature|Walk"
            );

            this.idleAction = this.mixer.clipAction(idleClip);
            this.walkAction = this.mixer.clipAction(walkClip);

            this.idleAction.play();
            this.currentAction = this.idleAction;

            console.log("Character loaded", gltf.animations);
        });
    }

    setupControls() {
        window.addEventListener("keydown", (e) => {
            if (e.key in this.keys) this.keys[e.key] = true;
        });
        window.addEventListener("keyup", (e) => {
            if (e.key in this.keys) this.keys[e.key] = false;
        });
    }

    update(delta, camera, controls) {
        if (this.mixer) this.mixer.update(delta);

        let isMoving = false;

        if (!this.character) return;

        // Movement
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

        const moveDir = new THREE.Vector3();
        if (this.keys.w) moveDir.add(forward);
        if (this.keys.s) moveDir.addScaledVector(forward, -1);
        if (this.keys.d) moveDir.add(right);
        if (this.keys.a) moveDir.addScaledVector(right, -1);

        if (moveDir.lengthSq() > 0) {
            isMoving = true;
            moveDir.normalize();
            const speed = 6;
            this.character.position.addScaledVector(moveDir, speed * delta);

            this.character.lookAt(
                this.character.position.x + moveDir.x,
                this.character.position.y,
                this.character.position.z + moveDir.z
            );
        }

        // Camera follow
        if (isMoving) {
            this.cameraTarget.copy(this.character.position);
            const offset = this.followOffset.clone();
            offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.character.rotation.y);

            const desiredCamPos = this.character.position.clone().add(offset);
            camera.position.lerp(desiredCamPos, 0.1);
            controls.target.lerp(this.cameraTarget, 0.1);
            controls.enableRotate = false;
        } else {
            controls.enableRotate = true;
        }

        // Animation switch
        if (this.idleAction && this.walkAction) {
            const nextAction = isMoving ? this.walkAction : this.idleAction;
            if (this.currentAction !== nextAction) {
                this.currentAction.fadeOut(0.2);
                nextAction.reset().fadeIn(0.2).play();
                this.currentAction = nextAction;
            }
        }
    }
}