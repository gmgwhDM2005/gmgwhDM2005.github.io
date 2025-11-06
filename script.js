// ------------------------------------------------------------
// Configuration
// ------------------------------------------------------------

// CHANGE THIS TO YOUR OWN PASSWORD HASH (SHA-256)
const USERNAME = 'admin';
const PASSWORD_HASH = '8a86c4eecf12446ff273afc03e1b3a09a911d0b7981db1af58cb45c439161295'; // SHA-256 of your password

let fleetData = [];

// ------------------------------------------------------------
// Utility Functions
// ------------------------------------------------------------

async function sha256(text) {
  const buffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function loadFleet() {
  try {
    const res = await fetch('data/fleet.json');
    fleetData = await res.json();
  } catch (err) {
    console.error('Failed to load fleet data:', err);
    fleetData = [];
  }
}

// ------------------------------------------------------------
// HTML Escaping
// ------------------------------------------------------------

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function escapeAttr(str) {
  return String(str || '').replace(/"/g, '&quot;');
}

// ------------------------------------------------------------
// Public Fleet Rendering
// ------------------------------------------------------------

function renderFleetTable(container, data) {
  container.innerHTML = '';

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>Reg</th>
        <th>Fleet #</th>
        <th>Livery</th>
        <th>Type</th>
        <th>Features</th>
        <th>Flickr</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement('tbody');
  data.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(v.reg)}</td>
      <td>${escapeHtml(v.fleetNumber)}</td>
      <td>
        <div>${escapeHtml(v.livery)}</div>
        ${v.liveryImage ? `<img class="livery" src="${escapeAttr(v.liveryImage)}" alt="livery image">` : ''}
      </td>
      <td>${escapeHtml(v.type)}</td>
      <td>${escapeHtml((v.features || []).join(', '))}</td>
      <td>${v.flickr ? `<a href="${escapeAttr(v.flickr)}" target="_blank">View</a>` : ''}</td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

// ------------------------------------------------------------
// Admin Panel Rendering
// ------------------------------------------------------------

function renderAdminFleet(container, data) {
  container.innerHTML = '';

  data.forEach((v, i) => {
    const row = document.createElement('div');
    row.className = 'row';

    row.innerHTML = `
      <div style="flex:1">
        <strong>${escapeHtml(v.reg)}</strong> — ${escapeHtml(v.fleetNumber)}
        <div class="muted">${escapeHtml(v.type)}</div>
      </div>
      <button data-index="${i}" class="remove">Remove</button>
    `;

    container.appendChild(row);
  });

  container.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', e => {
      const i = Number(e.target.dataset.index);
      if (confirm(`Remove vehicle ${data[i].reg}?`)) {
        data.splice(i, 1);
        renderAdminFleet(container, data);
      }
    });
  });
}

// ------------------------------------------------------------
// Export Fleet JSON
// ------------------------------------------------------------

function exportFleetJSON() {
  const blob = new Blob([JSON.stringify(fleetData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fleet.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ------------------------------------------------------------
// Login
// ------------------------------------------------------------

async function checkCredentials(username, password) {
  if (username !== USERNAME) return false;
  return (await sha256(password)) === PASSWORD_HASH;
}

async function initAdminPage() {
  const loginSection = document.getElementById('loginSection');
  const adminSection = document.getElementById('adminSection');
  const loginBtn = document.getElementById('loginBtn');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  const adminFleetContainer = document.getElementById('adminFleet');
  const addForm = document.getElementById('addForm');
  const exportBtn = document.getElementById('exportBtn');

  loginSection.style.display = 'block';
  adminSection.style.display = 'none';

  loginBtn.addEventListener('click', async () => {
    const ok = await checkCredentials(usernameInput.value, passwordInput.value);
    if (ok) {
      sessionStorage.setItem('fleetLoggedIn', '1');
      loginSection.style.display = 'none';
      adminSection.style.display = 'block';
      renderAdminFleet(adminFleetContainer, fleetData);
    } else {
      alert('Wrong username or password.');
    }
  });

  if (sessionStorage.getItem('fleetLoggedIn')) {
    loginSection.style.display = 'none';
    adminSection.style.display = 'block';
    renderAdminFleet(adminFleetContainer, fleetData);
  }

  addForm.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(addForm);
    const newV = {
      reg: fd.get('reg'),
      fleetNumber: fd.get('fleetNumber'),
      livery: fd.get('livery'),
      liveryImage: fd.get('liveryImage'),
      type: fd.get('type'),
      features: fd.get('features') ? fd.get('features').split(',').map(s => s.trim()).filter(Boolean) : [],
      flickr: fd.get('flickr')
    };
    fleetData.push(newV);
    renderAdminFleet(adminFleetContainer, fleetData);
    addForm.reset();
  });

  exportBtn.addEventListener('click', exportFleetJSON);

  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('fleetLoggedIn');
    location.reload();
  });
}

// ------------------------------------------------------------
// Initialize
// ------------------------------------------------------------

window.addEventListener('DOMContentLoaded', async () => {
  await loadFleet();
  const fleetContainer = document.getElementById('fleet');
  if (fleetContainer) renderFleetTable(fleetContainer, fleetData);

  if (document.getElementById('adminSection')) {
    initAdminPage();
  }
});
