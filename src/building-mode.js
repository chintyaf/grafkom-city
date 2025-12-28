import * as THREE from "three";
import { addBuilding, removeBuilding, rotateBuilding } from "./building.js";
import { tiles, camera, scene } from "./main.js";

let building_mode = false;
let choice;
let building_type;
let menu_box;
let selectedTile = null;

export function modeBuilding() {
    building_mode = true;

    menu_box = document.getElementById("menu");
    if (menu_box.style.display == "block") exitModeBuilding();
    else menu_box.style.display = "block";

    // GPT -> memilih dari list
    const menu_item = document.querySelectorAll("#menu-list .menu-list");
    if (menu_item) {
        menu_item.forEach((item) => {
            item.addEventListener("click", selectList);
        });
    }

    window.addEventListener("click", selectTile);
    window.addEventListener("keydown", selectDirection);
}

function exitModeBuilding() {
    building_mode = false;
    selectedTile = null;

    menu_box.style.display = "none";

    const menu_item = document.querySelectorAll("#menu-list .menu-list");
    menu_item.forEach((item) => {
        item.removeEventListener("click", selectList);
        item.removeEventListener("click", changeItem);
    });

    window.removeEventListener("click", selectTile);
    window.removeEventListener("keydown", selectDirection);
}

// delete, rotate, move, change building
export function editBuilding(edit_tile) {
    selectedTile = edit_tile;
    console.log(edit_tile.userData);
    building_mode = true;

    menu_box = document.getElementById("menu");
    if (menu_box.style.display == "block") exitModeBuilding();
    else menu_box.style.display = "block";

    building_type = edit_tile.userData.object;
    const menu_item = document.querySelectorAll("#menu-list .menu-list");
    if (menu_item) {
        menu_item.forEach((item) => {
            item.addEventListener("click", selectList);
            item.addEventListener("click", changeItem);
        });
    }

    // Move
    window.addEventListener("click", selectTile);

    // Rotate & Delete
    window.addEventListener("keydown", selectDirection);
}

let selectList;
let changeItem;
let selectTile;
export let selectDirection;

selectList = (event) => {
    if (choice) {
        choice.classList.remove("selected-list");
    }

    choice = document.getElementById(event.target.id);
    building_type = choice.id;
    choice.classList.add("selected-list");
};

changeItem = () => {
    console.log("change item");
    removeBuilding(selectedTile, scene);

    if (building_mode == true) {
        addBuilding(selectedTile, scene, building_type);
    }
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
selectTile = (e) => {
    // console.log(e);
    if (e.target.localName === "canvas") {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (e.clientY / window.innerHeight) * -2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Hanya memilih objek plane (tiles)
        const intersects = raycaster.intersectObjects(tiles);
        if (intersects.length > 0) {
            const tile = intersects[0].object;

            if (tile.userData.object != "roads") {
                // Hapus utk update
                if (selectedTile) {
                    removeBuilding(selectedTile, scene);
                    selectedTile.material.emissive.setHex(0x000000);
                }

                selectedTile = tile;
                addBuilding(tile, scene, building_type);
            } else {
                console.log("Cannot add building to roads");
            }
            tile.material.emissive.setHex(0x003300);
        }
    }
};

selectDirection = (e) => {
    if (e.key === "ArrowUp") {
        rotateBuilding(selectedTile, scene);
    } else if (e.key === "ArrowDown") {
        rotateBuilding(selectedTile, scene);
    } else if (e.key === "ArrowLeft") {
        rotateBuilding(selectedTile, scene);
    } else if (e.key === "ArrowRight") {
        rotateBuilding(selectedTile, scene);
    } else if (e.key === "Enter") {
        exitModeBuilding();
    } else if (e.key === "Backspace") {
        removeBuilding(selectedTile, scene);
        exitModeBuilding();
    }
};
