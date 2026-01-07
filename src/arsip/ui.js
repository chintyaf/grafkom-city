// ui.js - UI Controller for Grafkom City

// ============================================
// STATE MANAGEMENT
// ============================================
const UIState = {
    currentMode: null,      // 'building', 'road', 'tree'
    currentObject: null,    // specific object like 'house', 'tree', etc.
    isPlacementActive: false
};

// ============================================
// ASSET REGISTRY
// ============================================
const AssetRegistry = {
    buildings: [
        { id: 'house', name: 'House', path: './assets/models/house.glb', scale: 1.0 },
        { id: 'apartment', name: 'Apartment', path: './assets/models/apartment.glb', scale: 1.2 },
        { id: 'shop', name: 'Shop', path: './assets/models/shop.glb', scale: 0.9 },
        { id: 'office', name: 'Office', path: './assets/models/office.glb', scale: 1.5 }
    ],
    roads: [
        { id: 'straight', name: 'Straight', path: './assets/models/road_straight.glb', scale: 1.0 },
        { id: 'corner', name: 'Corner', path: './assets/models/road_corner.glb', scale: 1.0 },
        { id: 'tjunction', name: 'T-Junction', path: './assets/models/road_tjunction.glb', scale: 1.0 },
        { id: 'crossroad', name: 'Crossroad', path: './assets/models/road_cross.glb', scale: 1.0 }
    ],
    nature: [
        { id: 'tree', name: 'Tree', path: './assets/models/tree.glb', scale: 0.8 },
        { id: 'bush', name: 'Bush', path: './assets/models/bush.glb', scale: 0.6 },
        { id: 'rock', name: 'Rock', path: './assets/models/rock.glb', scale: 0.5 },
        { id: 'fountain', name: 'Fountain', path: './assets/models/fountain.glb', scale: 1.0 }
    ]
};

// ============================================
// UI FUNCTIONS
// ============================================
function setMode(mode) {
    UIState.currentMode = mode;
    UIState.currentObject = null; // Reset object when mode changes
    UIState.isPlacementActive = false;
    
    // Update mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`mode-${mode}`).classList.add('active');
    
    // Show appropriate object selection panel
    updateObjectPanel(mode);
    updateStatus();
    
    // Dispatch event for main app
    window.dispatchEvent(new CustomEvent('modeChanged', { 
        detail: { mode } 
    }));
}

function selectObject(objectId) {
    UIState.currentObject = objectId;
    UIState.isPlacementActive = true;
    
    // Update object buttons
    document.querySelectorAll('.object-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const btn = document.querySelector(`[data-object="${objectId}"]`);
    if (btn) btn.classList.add('active');
    
    updateStatus();
    
    // Dispatch event for main app
    window.dispatchEvent(new CustomEvent('objectSelected', { 
        detail: { 
            mode: UIState.currentMode,
            objectId: objectId,
            asset: getAssetInfo(objectId)
        } 
    }));
}

function updateObjectPanel(mode) {
    const container = document.getElementById('object-selection');
    container.innerHTML = '';
    
    let assets = [];
    switch(mode) {
        case 'building':
            assets = AssetRegistry.buildings;
            break;
        case 'road':
            assets = AssetRegistry.roads;
            break;
        case 'tree':
            assets = AssetRegistry.nature;
            break;
    }
    
    assets.forEach(asset => {
        const btn = document.createElement('button');
        btn.className = 'object-btn';
        btn.textContent = asset.name;
        btn.setAttribute('data-object', asset.id);
        btn.onclick = () => selectObject(asset.id);
        container.appendChild(btn);
    });
}

function updateStatus() {
    const statusEl = document.getElementById('status');
    const mode = UIState.currentMode || '-';
    const object = UIState.currentObject || '-';
    const placementStatus = UIState.isPlacementActive ? '✓ Ready to place' : '✗ Select an object';
    
    statusEl.innerHTML = `
        <strong>Mode:</strong> ${mode} | 
        <strong>Object:</strong> ${object} | 
        <strong>Status:</strong> ${placementStatus}
    `;
}

function getAssetInfo(objectId) {
    // Search all asset categories
    for (const category in AssetRegistry) {
        const asset = AssetRegistry[category].find(a => a.id === objectId);
        if (asset) return asset;
    }
    return null;
}

// ============================================
// CLEAR/CANCEL FUNCTION
// ============================================
function cancelPlacement() {
    UIState.currentObject = null;
    UIState.isPlacementActive = false;
    
    document.querySelectorAll('.object-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    updateStatus();
    
    window.dispatchEvent(new CustomEvent('placementCancelled'));
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'Escape':
            cancelPlacement();
            break;
        case '1':
            setMode('building');
            break;
        case '2':
            setMode('road');
            break;
        case '3':
            setMode('tree');
            break;
    }
});

// ============================================
// EXPORT FOR GLOBAL ACCESS
// ============================================
window.setMode = setMode;
window.selectObject = selectObject;
window.cancelPlacement = cancelPlacement;
window.getUIState = () => ({ ...UIState });
window.getAssetInfo = getAssetInfo;

// Initialize UI
updateStatus();