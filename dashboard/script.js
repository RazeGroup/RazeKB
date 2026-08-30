// Debug: Check if script loads
console.log("CMS Script Loaded Successfully");

let GITHUB_TOKEN = '';
let GITHUB_OWNER = '';
let GITHUB_REPO = '';
let allFiles = [];
let fileShas = {}; 

async function apiRequest(endpoint, options = {}) {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}${endpoint}`;
    const headers = {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        ...options.headers
    };

    try {
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'GitHub API Error');
        }
        return response.json();
    } catch (e) {
        console.error("API Request Failed:", e);
        throw e;
    }
}


function getFriendlyName(path, isFolder = false) {
    let name = path.split('/').pop(); // Get the last part of the path
    if (!isFolder && name.endsWith('.md')) {
        name = name.slice(0, -3); // Remove .md extension
    }
    // Replace hyphens and underscores with spaces, then capitalize each word
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function setStatus(text, type = 'info') {
    const status = document.getElementById('save-status');
    if (status) {
        status.textContent = text;
        status.style.color = type === 'error' ? '#f85149' : '#6e7681';
        status.style.fontFamily = "'JetBrains Mono', monospace";
        status.style.fontSize = '11px';
    }
}

// THE MAIN CONNECT FUNCTION
function connectGitHub() {
    console.log("Connect button clicked");
    
    const tokenInput = document.getElementById('gh-token');
    const ownerInput = document.getElementById('gh-owner');
    const repoInput = document.getElementById('gh-repo');

    if (!tokenInput || !ownerInput || !repoInput) {
        console.error("Critical Error: HTML inputs not found!");
        return;
    }

    GITHUB_TOKEN = tokenInput.value.trim();
    GITHUB_OWNER = ownerInput.value.trim();
    GITHUB_REPO = repoInput.value.trim();

    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
        alert('Please fill all fields: Token, Owner, and Repo Name');
        return;
    }

    loadFileList();
}

async function loadFileList() {
    setStatus('Connecting...');
    try {
        const data = await apiRequest('/git/trees/main?recursive=1');
        const files = data.tree
            .filter(item => item.path.startsWith('content/') && item.path.endsWith('.md'))
            .map(item => {
                fileShas[item.path] = item.sha;
                return item.path;
            });
        
        allFiles = files;
        const overlay = document.getElementById('login-overlay');
        if (overlay) overlay.style.display = 'none';
        
        localStorage.setItem('gh_token', GITHUB_TOKEN);
        localStorage.setItem('gh_owner', GITHUB_OWNER);
        localStorage.setItem('gh_repo', GITHUB_REPO);

        renderFileList(files);
        setStatus('Ready');
    } catch (err) {
        alert('Failed to connect to GitHub. Check your Token and Repo Name.\nError: ' + err.message);
        setStatus('Error', 'error');
    }
}

function renderFileList(files) {
    const list = document.getElementById('file-list');
    if (!list) return;
    list.innerHTML = '';
    const tree = buildTree(files);
    renderTree(tree, list);
}

function buildTree(files) {
    const root = {};
    files.forEach(file => {
        const parts = file.split('/');
        let current = root;
        parts.forEach((part, i) => {
            if (i === parts.length - 1) { current[part] = { _path: file }; }
            else { if (!current[part]) current[part] = {}; current = current[part]; }
        });
    });
    return root;
}

function renderTree(node, container, currentPath = '') {
    Object.keys(node).sort().forEach(key => {
        const item = node[key];
        const path = currentPath + key;
        
        if (item._path) {
            const div = document.createElement('div');
            div.className = 'file-item';
            div.innerHTML = `
                <i class="far fa-file-alt"></i> <span>${getFriendlyName(key)}</span>
                <div class="file-actions" style="margin-left:auto; display:none; gap:5px;">
                    <button onclick="event.stopPropagation(); renameFileInTree('${item._path}')" title="Rename"><i class="fas fa-edit"></i></button>
                    <button onclick="event.stopPropagation(); deleteFileInTree('${item._path}')" class="btn-danger-icon"><i class="fas fa-trash"></i></button>
                </div>
            `;
            div.onmouseover = () => div.querySelector('.file-actions').style.display = 'flex';
            div.onmouseout = () => div.querySelector('.file-actions').style.display = 'none';
            div.onclick = () => loadFile(item._path, div);
            div.setAttribute('data-filepath', item._path); // Store the full path
            container.appendChild(div);
        } else {
            const folder = document.createElement('div');
            folder.className = 'tree-folder';
            const fullFolderPath = path + '/';
            folder.innerHTML = `
                <div class="folder-row">
                    <div class="folder-label" onclick="toggleFolder(this)">
                        <i class="fas fa-folder"></i> ${getFriendlyName(key, true)}
                    </div>
                    <div class="folder-actions">
                        <button onclick="event.stopPropagation(); addNewFile('${fullFolderPath}')" title="Add File"><i class="fas fa-file-medical"></i></button>
                        <button onclick="event.stopPropagation(); addNewFolder('${fullFolderPath}')" title="Add Sub-folder"><i class="fas fa-folder-plus"></i></button>
                        <button onclick="event.stopPropagation(); renameFolderInTree('${fullFolderPath}', '${key}')" title="Rename Folder"><i class="fas fa-edit"></i></button>
                        <button onclick="event.stopPropagation(); deleteFolder('${fullFolderPath}')" class="btn-danger-icon"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="folder-content" style="display: none;"></div>
            `;
            container.appendChild(folder);
            renderTree(item, folder.querySelector('.folder-content'), fullFolderPath);
        }
    });
}

// --- Direct Tree Actions ---

async function renameFileInTree(oldPath) {
    const newPath = prompt("Enter new file path/name:", oldPath);
    if (!newPath || newPath === oldPath) return;
    setStatus('Renaming file...');
    try {
        const fileData = await apiRequest(`/contents/${oldPath}`);
        await apiRequest(`/contents/${newPath}`, {
            method: 'PUT',
            body: JSON.stringify({ message: `Rename ${oldPath} to ${newPath}`, content: fileData.content })
        });
        await apiRequest(`/contents/${oldPath}`, {
            method: 'DELETE',
            body: JSON.stringify({ message: `Cleanup rename`, sha: fileData.sha })
        });
        loadFileList();
        setStatus('Renamed!');
    } catch (err) { alert(err.message); setStatus('Rename failed', 'error'); }
}

async function deleteFileInTree(path) {
    if (!confirm('Delete file?')) return;
    try {
        const fileData = await apiRequest(`/contents/${path}`);
        await apiRequest(`/contents/${path}`, {
            method: 'DELETE',
            body: JSON.stringify({ message: `Delete ${path}`, sha: fileData.sha })
        });
        loadFileList();
    } catch (err) { alert(err.message); }
}

async function renameFolderInTree(oldFolderPath, oldName) {
    const newName = prompt("Enter new folder name:", oldName);
    if (!newName || newName === oldName) return;
    
    const parentPath = oldFolderPath.replace(oldName + '/', '');
    const newFolderPath = parentPath + newName + '/';
    
    if (!confirm(`This will move all files from ${oldFolderPath} to ${newFolderPath}. Continue?`)) return;
    
    setStatus('Renaming folder and moving files...');
    try {
        const treeData = await apiRequest('/git/trees/main?recursive=1');
        const filesToMove = treeData.tree.filter(i => i.path.startsWith(oldFolderPath) && i.type === 'blob');
        
        for (const file of filesToMove) {
            const newFilePath = file.path.replace(oldFolderPath, newFolderPath);
            const fileData = await apiRequest(`/contents/${file.path}`);
            
            // 1. Create at new location
            await apiRequest(`/contents/${newFilePath}`, {
                method: 'PUT',
                body: JSON.stringify({ message: `Moving ${file.path} to ${newFilePath}`, content: fileData.content })
            });
            // 2. Delete at old location
            await apiRequest(`/contents/${file.path}`, {
                method: 'DELETE',
                body: JSON.stringify({ message: `Cleanup move`, sha: file.sha })
            });
        }
        loadFileList();
        setStatus('Folder Renamed!');
    } catch (err) { alert(err.message); setStatus('Folder rename failed', 'error'); }
}

async function loadFile(path, element) {
    document.querySelectorAll('.file-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    setStatus('Loading...');

    try {
        const data = await apiRequest(`/contents/${path}`);
        const content = decodeURIComponent(atob(data.content).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        
        fileShas[path] = data.sha;
        document.getElementById('file-path').value = getFriendlyName(path);
        document.getElementById('file-path').setAttribute('data-filepath', path);
        document.getElementById('editor').value = content;
        updatePreview();
        setStatus('Loaded');
        
        // Auto-close sidebar on mobile after selecting a file
        if (window.innerWidth <= 1024) {
            toggleSidebar();
        }
    } catch (err) { alert('Load Error: ' + err.message); }
}

async function saveFile() {
    const path = document.getElementById('file-path').getAttribute('data-filepath');
    const content = document.getElementById('editor').value;
    if (!path) return alert('Select a file first');

    setStatus('Saving...');
    try {
        const encoded = btoa(encodeURIComponent(content).replace(/%([0-9A-F]{2})/g, (m, p) => String.fromCharCode('0x' + p)));
        const body = { message: `Update ${path}`, content: encoded, sha: fileShas[path] };
        const result = await apiRequest(`/contents/${path}`, { method: 'PUT', body: JSON.stringify(body) });
        fileShas[path] = result.content.sha;
        setStatus('Saved! Syncing...');
        await rebuildDataJS();
        setStatus('Updated Online!');
    } catch (err) { alert('Save Error: ' + err.message); }
}

async function addNewFile(parentPath) {
    let name = prompt("Name:"); if (!name) return;
    if (!name.endsWith('.md')) name += '.md';
    const path = parentPath + name;
    try {
        await apiRequest(`/contents/${path}`, { method: 'PUT', body: JSON.stringify({ message: `New file`, content: btoa("# Title") }) });
        loadFileList();
    } catch (err) { alert(err.message); }
}

async function addNewFolder(parentPath) {
    const name = prompt("Folder Name:"); if (!name) return;
    const path = parentPath + name + '/.gitkeep';
    try {
        await apiRequest(`/contents/${path}`, { method: 'PUT', body: JSON.stringify({ message: `New folder`, content: btoa(" ") }) });
        loadFileList();
    } catch (err) { alert(err.message); }
}

async function deleteFile() {
    const path = document.getElementById('file-path').getAttribute('data-filepath');
    if (!path || !confirm('Delete?')) return;
    try {
        await apiRequest(`/contents/${path}`, { method: 'DELETE', body: JSON.stringify({ message: `Delete`, sha: fileShas[path] }) });
        loadFileList();
    } catch (err) { alert(err.message); }
}

async function deleteFolder(path) {
    if (!confirm('Delete folder?')) return;
    try {
        const tree = await apiRequest('/git/trees/main?recursive=1');
        const files = tree.tree.filter(i => i.path.startsWith(path));
        for (const f of files) { await apiRequest(`/contents/${f.path}`, { method: 'DELETE', body: JSON.stringify({ message: `Cleanup`, sha: f.sha }) }); }
        loadFileList();
    } catch (err) { alert(err.message); }
}

async function renameFile() {
    const oldPath = document.getElementById('file-path').getAttribute('data-filepath');
    if (!oldPath) return;
    const newPath = prompt("New path:", oldPath);
    if (!newPath || newPath === oldPath) return;
    try {
        const content = btoa(encodeURIComponent(document.getElementById('editor').value).replace(/%([0-9A-F]{2})/g, (m, p) => String.fromCharCode('0x' + p)));
        await apiRequest(`/contents/${newPath}`, { method: 'PUT', body: JSON.stringify({ message: `Rename`, content }) });
        await apiRequest(`/contents/${oldPath}`, { method: 'DELETE', body: JSON.stringify({ message: `Rename cleanup`, sha: fileShas[oldPath] }) });
        loadFileList();
    } catch (err) { alert(err.message); }
}

async function triggerBuild() { await rebuildDataJS(); alert('Website map rebuilt!'); }

async function rebuildDataJS() {
    setStatus('Rebuilding site map...');
    try {
        const treeData = await apiRequest('/git/trees/main?recursive=1');
        const mdFiles = treeData.tree.filter(i => i.path.startsWith('content/') && i.path.endsWith('.md'));
        
        // Optimize: Build siteData from tree paths without fetching every file content
        // This avoids hundreds of API calls and rate-limiting
        const modules = mdFiles.map(file => {
            const pathParts = file.path.replace('content/', '').replace('.md', '').split('/');
            const fileName = pathParts[pathParts.length - 1];
            const cleanTitle = fileName.replace(/-/g, ' ').replace(/_/g, ' ')
                                .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize
            
            const uri = '/' + file.path.replace('content/', '').replace('.md', '') + '/';
            
            return {
                uri: uri,
                filePath: file.path,
                title: { en: cleanTitle, ar: cleanTitle },
                content: { en: "", ar: "" } // Content will be fetched on demand by main site
            };
        });

        const jsContent = `// Automated Build - ${new Date().toISOString()}\nconst siteData = ${JSON.stringify(modules, null, 2)};\nconst allCheatsheets = siteData;`;
        const encoded = btoa(encodeURIComponent(jsContent).replace(/%([0-9A-F]{2})/g, (m, p) => String.fromCharCode('0x' + p)));

        let sha = '';
        try { 
            const current = await apiRequest('/contents/data.js');
            sha = current.sha;
        } catch(e) { console.log("Creating new data.js"); }

        await apiRequest('/contents/data.js', { 
            method: 'PUT', 
            body: JSON.stringify({ message: 'Production Build via CMS', content: encoded, sha }) 
        });
        
        setStatus('Website Rebuilt!', 'info');
    } catch (err) { 
        console.error("Rebuild failed:", err);
        setStatus('Rebuild Failed', 'error');
        alert('Rebuild Error: ' + err.message);
    }
}

function insertText(text) {
    const ed = document.getElementById('editor');
    const start = ed.selectionStart;
    ed.value = ed.value.substring(0, start) + text + ed.value.substring(ed.selectionEnd);
    ed.focus(); ed.selectionStart = ed.selectionEnd = start + text.length;
    updatePreview();
}

function insertWrap(before, after) {
    const ed = document.getElementById('editor');
    const start = ed.selectionStart; const end = ed.selectionEnd;
    const sel = ed.value.substring(start, end);
    const text = before + sel + after;
    ed.value = ed.value.substring(0, start) + text + ed.value.substring(end);
    ed.focus(); ed.selectionStart = start + before.length; ed.selectionEnd = ed.selectionStart + sel.length;
    updatePreview();
}

function updatePreview() {
    const ed = document.getElementById('editor');
    const prev = document.getElementById('preview');
    if (ed && prev) prev.innerHTML = marked.parse(ed.value);
}

function togglePreview() {
    const p = document.getElementById('preview');
    const btn = document.getElementById('preview-toggle');
    if (!p) return;
    const isHidden = p.classList.toggle('hidden');
    if (btn) btn.innerHTML = isHidden ? '<i class="fas fa-eye"></i> Preview' : '<i class="fas fa-eye-slash"></i> Editor Only';
}

function toggleFolder(label) {
    const content = label.parentElement.nextElementSibling;
    const icon = label.querySelector('i');
    if (!content || !icon) return;
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    icon.className = isHidden ? 'fas fa-folder-open' : 'fas fa-folder';
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

function logout() { localStorage.clear(); location.reload(); }

// INITIALIZATION
window.onload = () => {
    console.log("Window loaded, checking for saved credentials...");
    const t = localStorage.getItem('gh_token');
    if (t) {
        GITHUB_TOKEN = t;
        GITHUB_OWNER = localStorage.getItem('gh_owner');
        GITHUB_REPO = localStorage.getItem('gh_repo');
        loadFileList();
    }
};
