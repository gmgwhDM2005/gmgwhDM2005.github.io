// ------------------------------------------------------------
// Configuration
// ------------------------------------------------------------

// CHANGE THIS TO YOUR OWN PASSWORD HASH (SHA-256).
// To generate a hash, visit: https://passwordsgenerator.net/sha256-hash-generator/
const ADMIN_PASSWORD_HASH = "9c3a9d3170f810cd8ad926756e2328e0193f7b36a4f2dc80bd048c6a558f845a"; // example: "admin123"

// Path to fleet data file
const FLEET_DATA_URL = "data/fleet.json";

let fleetData = [];

// ------------------------------------------------------------
// Utility Functions
// ------------------------------------------------------------

async function sha256(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

async function loadFleetData() {
    try {
        const response = await fetch(FLEET_DATA_URL + "?t=" + Date.now());
        fleetData = await response.json();
        renderFleetList();
        renderAdminFleetList();
    } catch (error) {
        console.error("Error loading fleet data:", error);
    }
}

function saveFleetData() {
    const dataStr = JSON.stringify(fleetData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "fleet.json";
    a.click();
    URL.revokeObjectURL(url);

    alert("Download complete — replace the file in /data/fleet.json on GitHub to update.");
}

// ------------------------------------------------------------
// Public Fleet Page Rendering
// ------------------------------------------------------------

function renderFleetList() {
    const tableBody = document.getElementById("fleet-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = "";
    fleetData.forEach(vehicle => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${vehicle.reg}</td>
            <td>${vehicle.fleetNumber}</td>
            <td><img src="${vehicle.liveryImage}" alt="Livery" class="livery-img"></td>
            <td>${vehicle.vehicleType}</td>
            <td>${vehicle.features}</td>
            <td><a href="${vehicle.flickrURL}" target="_blank">View</a></td>
        `;

        tableBody.appendChild(row);
    });
}

// ------------------------------------------------------------
// Admin Functions
// ------------------------------------------------------------

function showAdminPanel() {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
}

async function handleLogin() {
    const inputPassword = document.getElementById("admin-password").value;
    const hash = await sha256(inputPassword);
    if (hash === ADMIN_PASSWORD_HASH) {
        showAdminPanel();
    } else {
        alert("Incorrect password.");
    }
}

function renderAdminFleetList() {
    const adminTable = document.getElementById("admin-table-body");
    if (!adminTable) return;

    adminTable.innerHTML = "";
    fleetData.forEach((vehicle, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${vehicle.reg}</td>
            <td>${vehicle.fleetNumber}</td>
            <td>${vehicle.vehicleType}</td>
            <td><button onclick="removeVehicle(${index})">Remove</button></td>
        `;
        adminTable.appendChild(row);
    });
}

function addVehicle() {
    const reg = document.getElementById("new-reg").value.trim();
    const fleetNumber = document.getElementById("new-fleet-number").value.trim();
    const liveryImage = document.getElementById("new-livery-image").value.trim();
    const vehicleType = document.getElementById("new-vehicle-type").value.trim();
    const features = document.getElementById("new-features").value.trim();
    const flickrURL = document.getElementById("new-flickr-url").value.trim();

    if (!reg || !fleetNumber) {
        alert("Registration number and fleet number are required.");
        return;
    }

    fleetData.push({ reg, fleetNumber, liveryImage, vehicleType, features, flickrURL });
    renderFleetList();
    renderAdminFleetList();
    saveFleetData();
}

function removeVehicle(index) {
    fleetData.splice(index, 1);
    renderFleetList();
    renderAdminFleetList();
    saveFleetData();
}

// ------------------------------------------------------------
// Init
// ------------------------------------------------------------

document.addEventListener("DOMContentLoaded", loadFleetData);

const loginBtn = document.getElementById("login-btn");
if (loginBtn) loginBtn.addEventListener("click", handleLogin);

const addBtn = document.getElementById("add-btn");
if (addBtn) addBtn.addEventListener("click", addVehicle);