// Configuration — REPLACE these with your repository details
const entry = {
operator: fd.get('operator').trim(),
fleetName: fd.get('fleetName').trim(),
count: fd.get('count') ? Number(fd.get('count')) : undefined,
notes: fd.get('notes').trim() || undefined,
submittedAt: new Date().toISOString()
};
// save locally for preview
const local = JSON.parse(localStorage.getItem('localFleets') || '[]');
local.unshift(entry);
localStorage.setItem('localFleets', JSON.stringify(local));
loadAndShow();
alert('Preview added locally. To make it public, use "Submit as GitHub Issue" or "Create PR".');


$('#refresh').addEventListener('click', loadAndShow);


$('#search').addEventListener('input', e=>{
const q = e.target.value.toLowerCase();
fetchFleets().then(remote => {
const local = JSON.parse(localStorage.getItem('localFleets') || '[]');
const merged = [...local, ...remote];
const filtered = merged.filter(f => (f.operator+ ' ' + f.fleetName + ' ' + (f.notes||'')).toLowerCase().includes(q));
renderFleets(filtered);
});
});


// GitHub submission helpers
function openPrefilledIssue(entry) {
if (!REPO_OWNER || !REPO_NAME) { alert('REPO_OWNER and REPO_NAME must be set in script.js'); return }
const title = `Add fleet: ${entry.operator} — ${entry.fleetName}`;
const body = `**Operator:** ${entry.operator}\n**Fleet name:** ${entry.fleetName}\n**Vehicles:** ${entry.count ?? ''}\n**Notes:** ${entry.notes ?? ''}\n\n(You can edit this issue or maintainers may convert it into a PR adding to fleets.json)`;
const url = `https://github.com/${encodeURIComponent(REPO_OWNER)}/${encodeURIComponent(REPO_NAME)}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
window.open(url, '_blank');
}


function openCreatePr(entry) {
if (!REPO_OWNER || !REPO_NAME) { alert('REPO_OWNER and REPO_NAME must be set in script.js'); return }
// We'll ask users to add a new file under 'contrib/' with JSON content.
const filename = `contrib/${Date.now()}-${slugify(entry.operator)}-${slugify(entry.fleetName)}.json`;
const fileContent = JSON.stringify(entry, null, 2);
// GitHub web UI new file URL allows prefilled content using ?value= query param when creating under a repo
const url = `https://github.com/${encodeURIComponent(REPO_OWNER)}/${encodeURIComponent(REPO_NAME)}/new/${encodeURIComponent(BRANCH)}?filename=${encodeURIComponent(filename)}&value=${encodeURIComponent(fileContent)}`;
window.open(url, '_blank');
}


$('#submitIssue').addEventListener('click', ()=>{
const form = $('#addForm');
const fd = new FormData(form);
const entry = {
operator: fd.get('operator').trim(),
fleetName: fd.get('fleetName').trim(),
count: fd.get('count') ? Number(fd.get('count')) : undefined,
notes: fd.get('notes').trim() || undefined
};
openPrefilledIssue(entry);
});


$('#createPr').addEventListener('click', ()=>{
const form = $('#addForm');
const fd = new FormData(form);
const entry = {
operator: fd.get('operator').trim(),
fleetName: fd.get('fleetName').trim(),
count: fd.get('count') ? Number(fd.get('count')) : undefined,
notes: fd.get('notes').trim() || undefined,
submittedAt: new Date().toISOString()
};
openCreatePr(entry);
});


function slugify(s){ return (s||'').toString().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }


// initial load
loadAndShow();