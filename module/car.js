import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let car = null;
let direction = "kanan_1";

export function loadCar(scene) {
  const loader = new GLTFLoader();

  loader.load("/models/CityPack/Car.glb", (gltf) => {
    car = gltf.scene;

    car.position.set(-47.7, 0.15, -0.3);
    car.scale.set(0.25, 0.25, 0.25);
    car.rotation.y = Math.PI / 2;

    scene.add(car);
  });
}

export function updateCar() {
  if (!car) return;

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
