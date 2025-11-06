const form = document.getElementById('entryForm');
const logContainer = document.getElementById('log');


function loadEntries() {
const entries = JSON.parse(localStorage.getItem('busEntries') || '[]');
logContainer.innerHTML = '';
entries.forEach(e => {
const div = document.createElement('div');
div.className = 'entry';
div.innerHTML = `
<h3>${e.date} — ${e.route}</h3>
<p><strong>Route:</strong> ${e.locations || '—'}</p>
<p>${e.notes || ''}</p>
`;
logContainer.appendChild(div);
});
}


form.addEventListener('submit', (e) => {
e.preventDefault();
const data = Object.fromEntries(new FormData(form));


const entries = JSON.parse(localStorage.getItem('busEntries') || '[]');
entries.unshift(data);
localStorage.setItem('busEntries', JSON.stringify(entries));


form.reset();
loadEntries();
});


loadEntries();