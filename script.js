const logKey = 'busDiaryEntries';
markers = [];
entries.forEach(e => {
const marker = L.marker([e.lat, e.lng]).addTo(map).bindPopup(`<strong>${e.date}</strong><br>${e.route}`);
markers.push(marker);
});
if (entries.length) map.setView([entries[0].lat, entries[0].lng], 10);



function initMap() {
map = L.map('map').setView([51.5, -0.1], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '© OpenStreetMap contributors'
}).addTo(map);
renderMap();
}


function generatePDF() {
const { jsPDF } = window.jspdf;
const doc = new jsPDF();
const entries = loadEntries();
let y = 10;


entries.forEach(e => {
doc.text(`${e.date} — ${e.route}`, 10, y);
y += 6;
if (e.fleet) { doc.text(`Bus: ${e.fleet}`, 10, y); y += 6; }
if (e.notes) { doc.text(e.notes, 10, y); y += 8; }
y += 4;
});


doc.save('bus-logbook.pdf');
}


// Form handler
const form = document.getElementById('diaryForm');
form.addEventListener('submit', async e => {
e.preventDefault();
const fd = new FormData(form);
let photoData = '';
const file = fd.get('photo');
if (file && file.size) {
photoData = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(file); });
}


const entry = {
date: fd.get('date'),
route: fd.get('route'),
fleet: fd.get('fleet'),
notes: fd.get('notes'),
photo: photoData,
lat: fd.get('lat') ? parseFloat(fd.get('lat')) : null,
lng: fd.get('lng') ? parseFloat(fd.get('lng')) : null
};


const entries = loadEntries();
entries.unshift(entry);
saveEntries(entries);
renderEntries();
renderMap();
form.reset();
});


initMap();
renderEntries();


document.getElementById('downloadPdf').addEventListener('click', generatePDF);