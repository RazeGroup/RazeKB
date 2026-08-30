// ======== GLOBAL: Mobile Sidebar Toggle ========
function toggleSidebar() {
    const sidebar = document.getElementById('mainSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!sidebar) return;
    sidebar.classList.toggle('show');
    if (overlay) overlay.classList.toggle('show');
    document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const homeView = document.getElementById('homeView');
    const categoriesPreview = document.getElementById('categoriesPreview');
    const gridView = document.getElementById('gridView');
    const gridCards = document.getElementById('gridCards');
    const currentCategoryTitle = document.getElementById('currentCategoryTitle');
    const currentCategoryDesc = document.getElementById('currentCategoryDesc');
    const detailView = document.getElementById('detailView');
    const markdownContent = document.getElementById('markdownContent');
    const globalSearch = document.getElementById('globalSearch');
    const sidebarSearch = document.getElementById('sidebarSearch');
    const closeDetail = document.getElementById('closeDetail');
    const breadcrumb = document.getElementById('breadcrumb');
    const gridBreadcrumb = document.getElementById('gridBreadcrumb');
    const itemCount = document.getElementById('itemCount');
    const loader = document.getElementById('loader');
    const themeToggle = document.getElementById('themeToggle');
    const langSelect = document.getElementById('langSelect');
    const categoryList = document.getElementById('categoryList');

    // Redesign Added Elements
    const layoutToggleBtn = document.getElementById('layoutToggleBtn');
    const cmdPalette = document.getElementById('cmdPalette');
    const cmdBackdrop = document.getElementById('cmdBackdrop');
    const cmdInput = document.getElementById('cmdInput');
    const cmdResults = document.getElementById('cmdResults');
    const cmdTrigger = document.getElementById('cmdTrigger');
    const tocNav = document.getElementById('tocNav');

    // State
    let allCheatsheets = [];
    let activeCategory = 'All'; // Still used for top-level filtering in sidebar
    let activePath = '/'; // tracks current folder level
    let currentLang = localStorage.getItem('siteLang') || 'en';
    let currentTheme = localStorage.getItem('siteTheme') || 'dark';
    let currentLayout = localStorage.getItem('moduleLayout') || 'list'; // 'list' or 'grid'

    // Command Palette Selection State
    let selectedCmdIndex = -1;
    let filteredCmdItems = [];

    function refreshData() {
        if (typeof siteData !== 'undefined') {
            allCheatsheets = siteData.filter(item => item.uri && item.uri !== '/');
        }
    }

    const translations = {
        en: {
            siteName: "RAZE KB",
            heroTitle: "Master the Art of Offensive Operations",
            heroSubtitle: "Technical field notes, advanced exploitation techniques, and red team methodology · Developed by Raze Software",
            exploreBtn: "Explore Modules",
            followBtn: "Raze Community",
            searchPlaceholder: "Search tactics, techniques, and payloads... (Press 'Ctrl+K' to search)",
            filterPlaceholder: "Filter domains...",
            allModules: "All Modules",
            knowledgeParts: "Knowledge Domains",
            modulesFound: "Modules Found",
            categoriesTotal: "Domains Total",
            detecting: "Technical Modules Detected",
            syncing: "SYNCHRONIZING RAZE KB...",
            home: "Home",
            all: "All",
            parent: "Parent Domain",
            goBack: "Go Back",
            untitled: "Untitled Module",
            general: "General Research",
            noResults: 'No modules found matching "{searchTerm}"',
            emptyCat: "This domain is currently empty.",
            exploringAll: "Exploring the complete offensive security knowledge base.",
            selectCat: "Select a domain to view technical modules.",
            exploringCat: "Displaying {cat} documentation."
        },
        ar: {
            siteName: "ريز كي بي (RAZE KB)",
            heroTitle: "ارتقِ بمهاراتك في العمليات الهجومية",
            heroSubtitle: "ملاحظات ميدانية تقنية، تقنيات اختراق متقدّمة، ومنهجيات الفريق الأحمر (Red Team) — تطوير ريز سوفتوير.",
            exploreBtn: "استكشف الأدلة التقنية",
            followBtn: "مجتمع ريز",
            searchPlaceholder: "ابحث عن الثغرات، التقنيات، والأكواد... (اضغط 'Ctrl+K' للبحث)",
            filterPlaceholder: "تصفية المجالات...",
            allModules: "جميع الوحدات",
            knowledgeParts: "مجالات المعرفة",
            modulesFound: "وحدة تقنية",
            categoriesTotal: "إجمالي المجالات",
            detecting: "وحدات تقنية مكتشفة",
            syncing: "جاري مزامنة قاعدة البيانات...",
            home: "الرئيسية",
            all: "الكل",
            parent: "المجال السابق",
            goBack: "العودة للخلف",
            untitled: "وحدة بدون عنوان",
            general: "أبحاث عامة",
            noResults: 'لم يتم العثور على نتائج لـ "{searchTerm}"',
            emptyCat: "هذا المجال لا يحتوي على بيانات حالياً.",
            exploringAll: "استكشاف قاعدة بيانات الأمن الهجومي الشاملة.",
            selectCat: "اختر مجالاً لاستعراض أدلته التقنية.",
            exploringCat: "استعراض وثائق {cat}."
        },
        de: {
            siteName: "OFFENSIVE SICHERHEITSTIPPS",
            heroTitle: "Meistern Sie Offensive Operationen",
            heroSubtitle: "Technische Feldnotizen, fortgeschrittene Exploitation-Techniken und Red-Team-Methodiken.",
            exploreBtn: "Module erkunden",
            followBtn: "Autor folgen",
            searchPlaceholder: "Suche nach Taktiken, Techniken und Payloads... (Ctrl+K)",
            filterPlaceholder: "Kategorien filtern...",
            allModules: "Alle Module",
            knowledgeParts: "Wissensbereiche",
            modulesFound: "Module gefunden",
            categoriesTotal: "Bereiche gesamt",
            detecting: "Technische Module erkannt",
            syncing: "WISSENSDB WIRD SYNCHRONISIERT...",
            home: "Startseite",
            all: "Alle",
            parent: "Übergeordneter Bereich",
            goBack: "Zurück",
            untitled: "Unbenanntes Modul",
            general: "Allgemeine Forschung",
            noResults: 'Keine Module für "{searchTerm}" gefunden',
            emptyCat: "Dieser Bereich ist derzeit leer.",
            exploringAll: "Erkundung der vollständigen Offensive Security Knowledge Base.",
            selectCat: "Wählen Sie einen Bereich, um technische Module anzuzeigen.",
            exploringCat: "Anzeige der {cat}-Dokumentation."
        },
        ru: {
            siteName: "СОВЕТЫ ПО КИБЕРБЕЗОПАСНОСТИ",
            heroTitle: "Мастерство наступательных операций",
            heroSubtitle: "Технические заметки, продвинутые техники эксплуатации и методологии Red Team.",
            exploreBtn: "Исследовать модули",
            followBtn: "Подписаться на автора",
            searchPlaceholder: "Поиск тактик, техник и полезных нагрузок... (Ctrl+K)",
            filterPlaceholder: "Фильтр категорий...",
            allModules: "Все модули",
            knowledgeParts: "Области знаний",
            modulesFound: "Моделей найдено",
            categoriesTotal: "Всего областей",
            detecting: "Технических модулей обнаружено",
            syncing: "СИНХРОНИЗАЦИЯ БАЗЫ ЗНАНИЙ...",
            home: "Главная",
            all: "Все",
            parent: "Родительский раздел",
            goBack: "Вернуться",
            untitled: "Модуль без названия",
            general: "Общие исследования",
            noResults: 'Модули по запросу "{searchTerm}" не найдены',
            emptyCat: "Этот раздел в данный момент пуст.",
            exploringAll: "Изучение полной базы знаний по наступательной безопасности.",
            selectCat: "Выберите область для просмотра технических модулей.",
            exploringCat: "Просмотр документации {cat}."
        },
        it: {
            siteName: "CONSIGLI DI SICUREZZA OFFENSIVA",
            heroTitle: "Domina le Operazioni Offensive",
            heroSubtitle: "Note tecniche sul campo, tecniche di exploitation avanzate e metodologie Red Team.",
            exploreBtn: "Esplora i moduli",
            followBtn: "Segui l'autore",
            searchPlaceholder: "Cerca tattiche, tecniche e payload... (Ctrl+K)",
            filterPlaceholder: "Filtra categorie...",
            allModules: "Tutti i moduli",
            knowledgeParts: "Domini di conoscenza",
            modulesFound: "Moduli trovati",
            categoriesTotal: "Domini totali",
            detecting: "Moduli tecnici rilevati",
            syncing: "SINCRONIZZAZIONE KNOWLEDGE BASE...",
            home: "Home",
            all: "Tutto",
            parent: "Dominio superiore",
            goBack: "Torna indietro",
            untitled: "Modulo senza titolo",
            general: "Ricerca generale",
            noResults: 'Nessun modulo trovato per "{searchTerm}"',
            emptyCat: "Questo dominio è attualmente vuoto.",
            exploringAll: "Esplorazione della knowledge base completa sulla sicurezza offensiva.",
            selectCat: "Seleziona un dominio per visualizzare i moduli tecnici.",
            exploringCat: "Visualizzazione della documentazione di {cat}."
        },
        zh: {
            siteName: "进攻性安全实战技巧",
            heroTitle: "精通进攻性网络行动",
            heroSubtitle: "技术实战笔记、高级漏洞利用技术和红队渗透测试方法论。",
            exploreBtn: "探索技术模块",
            followBtn: "关注作者",
            searchPlaceholder: "搜索战术、技术和 Payload...（按 Ctrl+K）",
            filterPlaceholder: "筛选类别...",
            allModules: "所有模块",
            knowledgeParts: "知识领域",
            modulesFound: "找到模块",
            categoriesTotal: "领域总数",
            detecting: "检测到技术模块",
            syncing: "正在同步知识库...",
            home: "首页",
            all: "全部",
            parent: "父级领域",
            goBack: "返回",
            untitled: "无标题模块",
            general: "通用研究",
            noResults: '未找到匹配 "{searchTerm}" 的模块',
            emptyCat: "此领域目前为空。",
            exploringAll: "探索完整的进攻性安全知识库。",
            selectCat: "选择一个领域以查看技术模块。",
            exploringCat: "正在显示 {cat} 文档。"
        }
    };

    const icons = {
        'active directory': 'fa-sitemap',
        'windows security': 'fa-windows',
        'linux security': 'fa-linux',
        'macos security': 'fa-apple',
        'aws security': 'fa-aws',
        'azure security': 'fa-cloud',
        'gcp security': 'fa-google',
        'kubernetes & containers': 'fa-cubes',
        'ci cd & devops': 'fa-infinity',
        'other cloud security': 'fa-cloud',
        'web pentesting': 'fa-globe',
        'network pentesting': 'fa-network-wired',
        'cryptography & steganography': 'fa-key',
        'mobile security': 'fa-mobile-alt',
        'hardware security': 'fa-microchip',
        'forensics & incident response': 'fa-shield-halved',
        'red teaming & hacking': 'fa-user-secret',
        'reverse engineering & exploit dev': 'fa-bug',
        'methodologies & resources': 'fa-book'
    };

    // Configure Marked
    marked.setOptions({
        highlight: function(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
        langPrefix: 'hljs language-',
        breaks: true,
        gfm: true
    });

    function init() {
        if (typeof siteData === 'undefined') {
            document.body.innerHTML = '<div style="background:black; color:red; height:100vh; display:flex; align-items:center; justify-content:center; font-family:monospace;">FATAL ERROR: data.js source not found.</div>';
            return;
        }

        // Apply Saved Preferences
        refreshData();
        applyTheme(currentTheme);
        applyLanguage(currentLang);
        langSelect.value = currentLang;

        // Theme Toggle Event
        themeToggle.onclick = toggleTheme;
        
        // Language Change Event
        langSelect.onchange = (e) => applyLanguage(e.target.value);

        // Layout Toggle Event
        if (layoutToggleBtn) {
            updateLayoutButtonIcon();
            layoutToggleBtn.onclick = () => {
                currentLayout = currentLayout === 'list' ? 'grid' : 'list';
                localStorage.setItem('moduleLayout', currentLayout);
                updateLayoutButtonIcon();
                renderGrid();
            };
        }

        const categories = [...new Set(allCheatsheets.map(item => getCategory(item.uri)))].sort();
        renderSidebar([translations[currentLang].home, translations[currentLang].all, ...categories]);
        renderHomeCategories(categories);
        updateCount();
        renderSummaryDirectory();

        // Handle URL Routing on Load
        handleRouting();

        // Keyboard shortcuts
        window.addEventListener('keydown', (e) => {
            // Target slash to focus Command Palette instead of hidden search
            if (e.key === '/' && document.activeElement !== globalSearch && document.activeElement !== cmdInput) {
                e.preventDefault();
                showCmdPalette();
            }
            if (e.key === 'Escape') {
                if (cmdPalette && !cmdPalette.classList.contains('hidden')) {
                    hideCmdPalette();
                } else {
                    window.scrollToGridView();
                }
            }
        });

        // Listen for popstate (browser back/forward)
        window.addEventListener('popstate', handleRouting);

        // Hide Loader
        setTimeout(hideLoader, 500);
    }

    function hideLoader() {
        if (!loader) return;
        loader.style.opacity = '0';
        setTimeout(() => loader.classList.add('hidden'), 400);
    }

    function handleRouting() {
        const params = new URLSearchParams(window.location.search);
        const view = params.get('view') || 'home';
        const cat = params.get('cat');
        const docUri = params.get('doc');

        if (docUri) {
            const item = allCheatsheets.find(i => i.uri === docUri);
            if (item) {
                openDoc(item, false); // false = don't update URL again
                return;
            }
        }

        if (cat) {
            activeCategory = cat;
            activePath = '/' + cat.toLowerCase().replace(/ /g, '-') + '/';
            updateSidebarActive(cat);
            renderGrid();
            showGridView(false);
            return;
        }

        const pathParam = params.get('path');
        if (pathParam) {
            activePath = pathParam;
            const firstSegment = pathParam.split('/').filter(p => p.length > 0)[0];
            if (firstSegment) {
                activeCategory = firstSegment.replace(/-/g, ' ');
                updateSidebarActive(activeCategory);
            }
            renderGrid();
            showGridView(false);
            return;
        }

        if (view === 'grid') {
            activeCategory = 'All';
            updateSidebarActive('All');
            renderGrid();
            showGridView(false);
        } else {
            activeCategory = 'Home';
            updateSidebarActive('Home');
            showHomeView(false);
        }
    }

    function updateSidebarActive(cat) {
        document.querySelectorAll('.nav-item').forEach(el => {
            const labelEl = el.querySelector('.nav-label');
            if (labelEl && labelEl.textContent.trim() === getDisplayName(cat)) {
                el.classList.add('active');
                const icon = el.querySelector('i');
                if (icon) icon.style.color = 'var(--accent)';
            } else {
                el.classList.remove('active');
                const icon = el.querySelector('i');
                if (icon) icon.style.color = 'inherit';
            }
        });
    }

    function updateURL(params = {}) {
        const url = new URL(window.location);
        url.searchParams.delete('view');
        url.searchParams.delete('cat');
        url.searchParams.delete('doc');
        url.searchParams.delete('path');
        
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, value);
        }
        window.history.pushState({}, '', url);
    }

    function getCategory(uri) {
        const parts = uri.split('/').filter(p => p.length > 0);
        return parts.length > 0 ? parts[0].replace(/-/g, ' ') : 'General';
    }

    function getDisplayName(name) {
        if (!name) return '';
        if (name.toLowerCase() === 'home') return translations[currentLang].home;
        if (name.toLowerCase() === 'all') return translations[currentLang].all;
        return name.replace(/-/g, ' ').replace(/_/g, ' ');
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('light-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        currentTheme = theme;
        localStorage.setItem('siteTheme', theme);
    }

    function toggleTheme() {
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('siteLang', lang);
        
        // RTL Support
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);

        refreshData();

        const t = translations[lang];

        // Translate Static UI Elements
        const siteNameEl = document.querySelector('.site-name');
        if (siteNameEl) siteNameEl.textContent = t.siteName;
        
        const searchPlaceholderText = document.getElementById('searchPlaceholderText');
        if (searchPlaceholderText) {
            searchPlaceholderText.textContent = t.searchPlaceholder.split(' (')[0];
        }
        if (globalSearch) globalSearch.placeholder = t.searchPlaceholder;
        if (sidebarSearch) sidebarSearch.placeholder = t.filterPlaceholder;
        const loaderText = document.querySelector('#loader p');
        if (loaderText) loaderText.textContent = t.syncing;

        // Re-render dynamic elements
        const categories = [...new Set(allCheatsheets.map(item => getCategory(item.uri)))].sort();
        renderSidebar(['Home', 'All', ...categories]);
        renderHomeCategories(categories);
        renderGrid('', true); // noURLUpdate = true — don't overwrite URL
        updateCount();
        updateHomeHeader();
        updateLayoutButtonIcon();
        renderSummaryDirectory();
    }

    function updateHomeHeader() {
        const totalModules = allCheatsheets.length;
        const categories = [...new Set(allCheatsheets.map(item => getCategory(item.uri)))];
        const totalDomains = categories.length;

        const homeTitle = document.getElementById('homeTitle');
        const homeSubtitle = document.getElementById('homeSubtitle');
        const summaryLabel = document.getElementById('summaryLabel');

        if (summaryLabel) {
            if (currentLang === 'ar') {
                summaryLabel.textContent = "فهرس قاعدة المعرفة";
            } else if (currentLang === 'de') {
                summaryLabel.textContent = "Inhaltsverzeichnis";
            } else if (currentLang === 'ru') {
                summaryLabel.textContent = "Карта базы знаний";
            } else if (currentLang === 'it') {
                summaryLabel.textContent = "Indice della Knowledge Base";
            } else if (currentLang === 'zh') {
                summaryLabel.textContent = "知识库大纲";
            } else {
                summaryLabel.textContent = "Knowledge Base Outline";
            }
        }

        if (homeTitle) {
            if (currentLang === 'ar') {
                homeTitle.textContent = "قاعدة معرفة ريز — الأبحاث الأمنية الهجومية";
            } else if (currentLang === 'de') {
                homeTitle.textContent = "Raze Wissensdatenbank — Offensive Sicherheit";
            } else if (currentLang === 'ru') {
                homeTitle.textContent = "База знаний Raze — Наступательная безопасность";
            } else if (currentLang === 'it') {
                homeTitle.textContent = "Raze Knowledge Base — Sicurezza Offensiva";
            } else if (currentLang === 'zh') {
                homeTitle.textContent = "Raze 进攻性安全知识库";
            } else {
                homeTitle.textContent = "Raze Knowledge Base — Offensive Security";
            }
        }

        if (homeSubtitle) {
            if (currentLang === 'ar') {
                homeSubtitle.innerHTML = `<strong>${totalModules}</strong> وحدة تقنية عبر <strong>${totalDomains}</strong> مجالات معرفية`;
            } else if (currentLang === 'de') {
                homeSubtitle.innerHTML = `<strong>${totalModules}</strong> Module in <strong>${totalDomains}</strong> Bereichen`;
            } else if (currentLang === 'ru') {
                homeSubtitle.innerHTML = `<strong>${totalModules}</strong> модулей в <strong>${totalDomains}</strong> доменах`;
            } else if (currentLang === 'it') {
                homeSubtitle.innerHTML = `<strong>${totalModules}</strong> moduli in <strong>${totalDomains}</strong> domini`;
            } else if (currentLang === 'zh') {
                homeSubtitle.innerHTML = `在 <strong>${totalDomains}</strong> 个领域中共有 <strong>${totalModules}</strong> 个模块`;
            } else {
                homeSubtitle.innerHTML = `<strong>${totalModules}</strong> modules across <strong>${totalDomains}</strong> domains`;
            }
        }
    }

    function renderSidebar(categories, filter = '') {
        categoryList.innerHTML = '';
        const filterLower = (filter || '').toLowerCase();

        // Build tree from all modules
        const root = { children: {} };
        for (const mod of allCheatsheets) {
            const parts = mod.uri.split('/').filter(p => p.length > 0);
            let node = root;
            for (let i = 0; i < parts.length; i++) {
                node.children = node.children || {};
                if (i === parts.length - 1) {
                    node.files = node.files || [];
                    node.files.push(mod);
                } else {
                    if (!node.children[parts[i]]) {
                        node.children[parts[i]] = { name: parts[i], children: {}, files: [], expanded: false, filtered: false };
                    }
                    node = node.children[parts[i]];
                }
            }
        }

        // Mark nodes that match filter
        function markFiltered(node) {
            let match = false;
            for (const file of (node.files || [])) {
                const t = ((file.title.en || '') + ' ' + (file.title.ar || '')).toLowerCase();
                if (t.includes(filterLower)) match = true;
            }
            for (const n of Object.keys(node.children)) {
                if (markFiltered(node.children[n])) match = true;
            }
            node.filtered = match;
            return match;
        }
        if (filterLower) markFiltered(root);

        // Home
        const homeDiv = document.createElement('div');
        homeDiv.className = 'nav-item';
        homeDiv.innerHTML = `<i class="fas fa-home"></i><span class="nav-label">${translations[currentLang].home}</span>`;
        homeDiv.onclick = () => { showHomeView(); activeCategory = 'Home'; updateSidebarActive('Home'); };
        categoryList.appendChild(homeDiv);

        // All
        const allDiv = document.createElement('div');
        allDiv.className = 'nav-item';
        allDiv.innerHTML = `<i class="fas fa-border-all"></i><span class="nav-label">${translations[currentLang].all}</span><span class="item-count-badge">${allCheatsheets.length}</span>`;
        allDiv.onclick = () => { activeCategory = 'All'; activePath = '/'; renderGrid(); showGridView(); updateSidebarActive('All'); };
        categoryList.appendChild(allDiv);

        function countItems(folder) {
            let c = (folder.files || []).length;
            for (const n of Object.keys(folder.children)) c += countItems(folder.children[n]);
            return c;
        }

        function renderFolder(folder, depth, container) {
            if (filterLower && !folder.filtered) return;

            const nodeDiv = document.createElement('div');
            nodeDiv.className = 'tree-node';
            container.appendChild(nodeDiv);

            const header = document.createElement('div');
            header.className = 'tree-header';
            header.style.paddingLeft = (8 + depth * 14) + 'px';

            const toggle = document.createElement('span');
            toggle.className = 'tree-toggle';
            toggle.innerHTML = '<i class="fas fa-chevron-right"></i>';
            header.appendChild(toggle);

            const icon = document.createElement('i');
            icon.className = 'fas fa-folder';
            header.appendChild(icon);

            const label = document.createElement('span');
            label.className = 'tree-label';
            label.textContent = getDisplayName(folder.name);
            header.appendChild(label);

            const badge = document.createElement('span');
            badge.className = 'item-count-badge';
            badge.textContent = countItems(folder);
            header.appendChild(badge);

            nodeDiv.appendChild(header);

            const wrap = document.createElement('div');
            wrap.className = 'tree-children';
            wrap.style.display = 'none';

            // Subfolders
            const subNames = Object.keys(folder.children).sort();
            for (const sn of subNames) renderFolder(folder.children[sn], depth + 1, wrap);

            // Files
            for (const file of (folder.files || [])) {
                if (filterLower) {
                    const t = ((file.title.en || '') + ' ' + (file.title.ar || '')).toLowerCase();
                    if (!t.includes(filterLower)) continue;
                }
                const leaf = document.createElement('div');
                leaf.className = 'tree-leaf';
                leaf.style.paddingLeft = (8 + (depth + 1) * 14) + 'px';
                const title = (file.title[currentLang] || file.title['en']) || 'untitled';
                leaf.innerHTML = `<i class="far fa-file-alt"></i><span class="tree-label">${title}</span>`;
                leaf.onclick = (e) => {
                    e.stopPropagation();
                    openDoc(file);
                    if (window.innerWidth <= 900) toggleSidebar();
                };
                wrap.appendChild(leaf);
            }

            nodeDiv.appendChild(wrap);

            // Auto-expand on filter
            if (filterLower && folder.filtered) {
                wrap.style.display = 'block';
                toggle.querySelector('i').style.transform = 'rotate(90deg)';
            }

            header.onclick = (e) => {
                e.stopPropagation();
                const expanded = wrap.style.display !== 'none';
                wrap.style.display = expanded ? 'none' : 'block';
                toggle.querySelector('i').style.transform = expanded ? '' : 'rotate(90deg)';
            };
        }

        const names = Object.keys(root.children).sort();
        for (const name of names) renderFolder(root.children[name], 0, categoryList);
    }

    function renderHomeCategories(categories) {
        categoriesPreview.innerHTML = '';

        categories.forEach(cat => {
            const lowCat = cat.toLowerCase();
            const iconName = icons[lowCat] || 'fa-folder-open';
            const prefix = (iconName.startsWith('fa-linux') || iconName.startsWith('fa-windows') || iconName.startsWith('fa-apple') || iconName.startsWith('fa-aws') || iconName.startsWith('fa-google')) ? 'fab' : 'fas';
            
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="cat-icon"><i class="${prefix} ${iconName}"></i></div>
                <div class="cat-info">
                    <div class="cat-name">${cat}</div>
                    <div class="cat-count">${allCheatsheets.filter(i => getCategory(i.uri) === cat).length} modules</div>
                </div>
            `;
            card.onclick = () => {
                activeCategory = cat;
                activePath = '/' + cat.toLowerCase().replace(/ /g, '-') + '/';
                renderGrid();
                showGridView();
                updateSidebarActive(cat);
            };
            categoriesPreview.appendChild(card);
        });
    }

    function updateLayoutButtonIcon() {
        if (!layoutToggleBtn) return;
        const icon = layoutToggleBtn.querySelector('i');
        if (icon) {
            if (currentLayout === 'list') {
                icon.className = 'fas fa-th';
                layoutToggleBtn.title = currentLang === 'ar' ? 'عرض شبكي' : 'Grid View';
            } else {
                icon.className = 'fas fa-list';
                layoutToggleBtn.title = currentLang === 'ar' ? 'عرض قائمة' : 'List View';
            }
        }
    }

    function renderGrid(searchTerm = '', noURLUpdate = false) {
        const t = translations[currentLang];
        gridCards.innerHTML = '';
        
        updateGridBreadcrumb();
        currentCategoryTitle.textContent = activeCategory === 'All' ? t.knowledgeParts : activeCategory;
        
        let desc = "";
        if (searchTerm) {
            desc = t.noResults.replace('{searchTerm}', searchTerm);
        } else if (activeCategory === 'All') {
            desc = t.selectCat;
        } else {
            desc = t.exploringCat.replace('{cat}', activeCategory);
        }
        currentCategoryDesc.textContent = desc;

        if (activeCategory === 'All' && !searchTerm) {
            // Render grid category explorer cards
            const sectionGrid = document.createElement('div');
            sectionGrid.className = 'categories-preview';
            
            const categories = [...new Set(allCheatsheets.map(item => getCategory(item.uri)))].sort();
            categories.forEach(cat => {
                const lowCat = cat.toLowerCase();
                const iconName = icons[lowCat] || 'fa-folder-open';
                const prefix = (iconName.startsWith('fa-linux') || iconName.startsWith('fa-windows') || iconName.startsWith('fa-apple') || iconName.startsWith('fa-aws') || iconName.startsWith('fa-google')) ? 'fab' : 'fas';
                
                const card = document.createElement('div');
                card.className = 'category-card';
                card.innerHTML = `
                    <div class="cat-icon"><i class="${prefix} ${iconName}"></i></div>
                    <div class="cat-info">
                        <div class="cat-name">${cat}</div>
                        <div class="cat-count">${allCheatsheets.filter(i => getCategory(i.uri) === cat).length} ${t.allModules}</div>
                    </div>
                `;
                card.onclick = () => {
                    activeCategory = cat;
                    activePath = '/' + cat.toLowerCase().replace(/ /g, '-') + '/';
                    updateSidebarActive(cat);
                    renderGrid();
                };
                sectionGrid.appendChild(card);
            });
            gridCards.appendChild(sectionGrid);
            document.getElementById('moduleCountTag').textContent = `${categories.length} ${t.categoriesTotal}`;
        } else {
            let filtered = allCheatsheets.filter(item => {
                const matchesPath = searchTerm || item.uri.startsWith(activePath);
                const matchesSearch = !searchTerm || 
                                     item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                     item.uri?.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesPath && matchesSearch;
            });

            if (searchTerm) {
                document.getElementById('moduleCountTag').textContent = `${filtered.length} ${t.modulesFound}`;
                if (filtered.length === 0) {
                    gridCards.innerHTML = `<div class="no-results">${t.noResults.replace('{searchTerm}', searchTerm)}</div>`;
                    return;
                }
                const flatGrid = document.createElement('div');
                flatGrid.className = `section-grid ${currentLayout === 'grid' ? 'grid-mode' : 'list-mode'}`;
                filtered.forEach(item => renderModuleCard(item, flatGrid));
                gridCards.appendChild(flatGrid);
            } else {
                const introFile = allCheatsheets.find(item => item.uri === activePath);
                if (introFile) {
                    const introDiv = document.createElement('div');
                    introDiv.className = 'category-intro-box';
                    introDiv.innerHTML = marked.parse(introFile.content[currentLang] || introFile.content['en']);
                    gridCards.appendChild(introDiv);
                }

                // Group by subfolders
                const segments = {};
                filtered.forEach(item => {
                    if (item.uri === activePath) return; // Skip folder landing intro
                    
                    const localPath = item.uri.substring(activePath.length);
                    const segName = localPath.split('/')[0];
                    if (!segments[segName]) segments[segName] = [];
                    segments[segName].push(item);
                });

                const sortedSegments = Object.keys(segments).sort();
                document.getElementById('moduleCountTag').textContent = `${sortedSegments.length} ${t.detecting}`;

                if (sortedSegments.length === 0 && !introFile) {
                    gridCards.innerHTML = `<div class="no-results">${t.emptyCat}</div>`;
                    return;
                }

                const flatGrid = document.createElement('div');
                flatGrid.className = `section-grid ${currentLayout === 'grid' ? 'grid-mode' : 'list-mode'}`;
                
                // Back to parent directory card
                if (activePath !== '/' && activePath.split('/').filter(p => p.length > 0).length > 1) {
                    const backCard = document.createElement('div');
                    backCard.className = 'card module-card folder-card';
                    
                    if (currentLayout === 'grid') {
                        backCard.innerHTML = `
                            <div class="card-icon"><i class="fas fa-level-up-alt"></i></div>
                            <div class="card-content">
                                <div class="card-meta">${t.parent}</div>
                                <div class="card-title">${t.goBack}</div>
                            </div>
                        `;
                    } else {
                        backCard.innerHTML = `
                            <div class="card-content-wrapper">
                                <div class="card-icon"><i class="fas fa-level-up-alt"></i></div>
                                <div class="card-title">${t.goBack}</div>
                            </div>
                            <div class="card-meta-inline">${t.parent}</div>
                            <div class="card-arrow"><i class="fas fa-chevron-right"></i></div>
                        `;
                    }
                    
                    backCard.onclick = () => {
                        const parts = activePath.split('/').filter(p => p.length > 0);
                        parts.pop();
                        activePath = '/' + parts.join('/') + (parts.length > 0 ? '/' : '');
                        renderGrid();
                    };
                    flatGrid.appendChild(backCard);
                }

                sortedSegments.forEach(seg => {
                    const items = segments[seg];
                    const isFolder = items.length > 1 || items[0].uri !== activePath + seg + '/';
                    const mainItem = items.find(i => i.uri === activePath + seg + '/') || items[0];
                    
                    if (isFolder) {
                        renderFolderCard(seg, items.length, flatGrid);
                    } else {
                        renderModuleCard(mainItem, flatGrid);
                    }
                });
                gridCards.appendChild(flatGrid);
            }
        }

        if (!noURLUpdate) {
            if (!searchTerm && activePath !== '/') {
                updateURL({ view: 'grid', path: activePath });
            } else if (!searchTerm) {
                updateURL({ view: 'grid', cat: activeCategory === 'All' ? null : activeCategory });
            }
        }

        updateCount();
    }

    function renderFolderCard(name, count, container) {
        const card = document.createElement('div');
        card.className = 'card module-card folder-card';
        
        if (currentLayout === 'grid') {
            card.innerHTML = `
                <div class="card-icon"><i class="fas fa-folder"></i></div>
                <div class="card-content">
                    <div class="card-meta">${count} Items</div>
                    <div class="card-title">${getDisplayName(name)}</div>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="card-content-wrapper">
                    <div class="card-icon"><i class="fas fa-folder"></i></div>
                    <div class="card-title">${getDisplayName(name)}</div>
                </div>
                <div class="card-meta-inline">${count} Items</div>
                <div class="card-arrow"><i class="fas fa-chevron-right"></i></div>
            `;
        }
        
        card.onclick = () => {
            activePath = activePath + name + '/';
            renderGrid();
            window.scrollTo(0, 0);
        };
        container.appendChild(card);
    }

    function renderModuleCard(item, container) {
        const cat = getCategory(item.uri);
        const lowCat = cat.toLowerCase();
        const iconName = icons[lowCat] || 'fa-file-code';
        const prefix = (iconName.startsWith('fa-linux') || iconName.startsWith('fa-windows') || iconName.startsWith('fa-apple') || iconName.startsWith('fa-aws') || iconName.startsWith('fa-google')) ? 'fab' : 'fas';

        const card = document.createElement('div');
        card.className = 'card module-card';
        
        const title = (item.title[currentLang] || item.title['en']) || translations[currentLang].untitled;

        if (currentLayout === 'grid') {
            card.innerHTML = `
                <div class="card-icon"><i class="${prefix} ${iconName}"></i></div>
                <div class="card-content">
                    <div class="card-title">${title}</div>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="card-content-wrapper">
                    <div class="card-icon"><i class="${prefix} ${iconName}"></i></div>
                    <div class="card-title">${title}</div>
                </div>
                <div class="card-arrow"><i class="fas fa-chevron-right"></i></div>
            `;
        }
        
        card.onclick = () => openDoc(item);
        container.appendChild(card);
    }

    function updateGridBreadcrumb() {
        if (!gridBreadcrumb) return;
        gridBreadcrumb.innerHTML = '';
        if (activePath === '/') return;

        const parts = activePath.split('/').filter(p => p.length > 0);
        let current = '';

        const rootSpan = document.createElement('span');
        rootSpan.className = 'breadcrumb-item';
        rootSpan.innerHTML = '<i class="fas fa-home"></i>';
        rootSpan.onclick = () => {
            activeCategory = 'All';
            activePath = '/';
            renderGrid();
        };
        gridBreadcrumb.appendChild(rootSpan);

        parts.forEach((part) => {
            const sep = document.createElement('span');
            sep.textContent = ' / ';
            gridBreadcrumb.appendChild(sep);

            current += part + '/';
            const pathForPart = '/' + current;
            const span = document.createElement('span');
            span.className = 'breadcrumb-item';
            span.textContent = getDisplayName(part);
            span.onclick = () => {
                activePath = pathForPart;
                renderGrid();
            };
            gridBreadcrumb.appendChild(span);
        });
    }

    function openDoc(item, updateRoute = true) {
        if (updateRoute) updateURL({ doc: item.uri });
        
        breadcrumb.innerHTML = '';
        const parts = item.uri.split('/').filter(p => p.length > 0);
        let current = '';
        
        const rootSpan = document.createElement('span');
        rootSpan.className = 'breadcrumb-item';
        rootSpan.innerHTML = '<i class="fas fa-home"></i>';
        rootSpan.onclick = () => {
            activeCategory = 'All';
            activePath = '/';
            renderGrid();
            showGridView();
        };
        breadcrumb.appendChild(rootSpan);

        parts.forEach((part) => {
            const sep = document.createElement('span');
            sep.textContent = ' / ';
            breadcrumb.appendChild(sep);

            current += part + '/';
            const pathForPart = '/' + current;
            const span = document.createElement('span');
            span.className = 'breadcrumb-item';
            span.textContent = getDisplayName(part);
            span.onclick = () => {
                activePath = pathForPart;
                renderGrid();
                showGridView();
            };
            breadcrumb.appendChild(span);
        });

        // Removed file-path-link — paths are hidden from users

        // Render Markdown Content
        const rawContent = (item.content[currentLang] || item.content['en']) || 'No documentation found for this module.';
        markdownContent.innerHTML = marked.parse(rawContent);
        
        // Code syntax highlighting
        markdownContent.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        // Generate Table of Contents (ToC)
        generateToC();

        showDetailView();
    }

    function generateToC() {
        if (!tocNav) return;
        tocNav.innerHTML = '';
        
        const headings = markdownContent.querySelectorAll('h2, h3');
        const tocPanel = document.querySelector('.toc-panel');

        if (headings.length === 0) {
            if (tocPanel) tocPanel.style.display = 'none';
            return;
        } else {
            if (tocPanel && window.innerWidth > 1100) {
                tocPanel.style.display = 'block';
            }
        }

        const ul = document.createElement('ul');
        ul.className = 'toc-list';

        headings.forEach((heading, idx) => {
            if (!heading.id) {
                const text = heading.textContent.trim().toLowerCase();
                heading.id = 'toc-' + text.replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-+|-+$/g, '');
                if (heading.id === 'toc-') heading.id = 'toc-heading-' + idx;
            }

            const li = document.createElement('li');
            li.className = `toc-item ${heading.tagName.toLowerCase() === 'h3' ? 'toc-h3' : 'toc-h2'}`;
            li.textContent = heading.textContent.trim();
            li.setAttribute('href', `#${heading.id}`);

            li.onclick = (e) => {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                document.querySelectorAll('.toc-item').forEach(el => el.classList.remove('toc-active'));
                li.classList.add('toc-active');
            };

            ul.appendChild(li);
        });

        tocNav.appendChild(ul);
    }

    // Scroll active heading observer for ToC
    const proseWrapper = document.querySelector('.prose-wrapper');
    if (proseWrapper) {
        proseWrapper.addEventListener('scroll', () => {
            const headings = markdownContent.querySelectorAll('h2, h3');
            if (headings.length === 0) return;

            let activeHeading = null;
            const containerRect = proseWrapper.getBoundingClientRect();

            for (const heading of headings) {
                const rect = heading.getBoundingClientRect();
                const relativeTop = rect.top - containerRect.top;
                
                if (relativeTop <= 30) {
                    activeHeading = heading;
                } else {
                    break;
                }
            }

            if (activeHeading) {
                document.querySelectorAll('.toc-item').forEach(el => {
                    if (el.getAttribute('href') === `#${activeHeading.id}`) {
                        el.classList.add('toc-active');
                    } else {
                        el.classList.remove('toc-active');
                    }
                });
            }
        });
    }

    function updateCount(num = allCheatsheets.length) {
        if (itemCount) {
            itemCount.textContent = `${num} ${translations[currentLang].detecting}`;
        }
    }

    function showGridView(updateRoute = true) {
        if (updateRoute) updateURL({ view: 'grid', cat: activeCategory === 'All' ? null : activeCategory });
        homeView.classList.add('hidden');
        gridView.classList.remove('hidden');
        detailView.classList.add('hidden');
        window.scrollTo(0, 0);
    }

    function showDetailView() {
        homeView.classList.add('hidden');
        gridView.classList.add('hidden');
        detailView.classList.remove('hidden');
        const proseWrapper = document.querySelector('.prose-wrapper');
        if (proseWrapper) proseWrapper.scrollTo(0, 0);
    }

    function showHomeView(updateRoute = true) {
        if (updateRoute) updateURL({ view: 'home' });
        homeView.classList.remove('hidden');
        gridView.classList.add('hidden');
        detailView.classList.add('hidden');
        window.scrollTo(0, 0);
    }

    window.scrollToGridView = () => {
        activeCategory = 'All';
        activePath = '/';
        updateSidebarActive('All');
        renderGrid();
        showGridView();
    };

    // Global Search input listener
    globalSearch.addEventListener('input', (e) => {
        renderGrid(e.target.value);
        showGridView();
    });

    // Sidebar search input listener
    sidebarSearch.addEventListener('input', (e) => {
        const categories = ['All', ...new Set(allCheatsheets.map(item => getCategory(item.uri)))].sort();
        renderSidebar(categories, e.target.value);
    });

    closeDetail.onclick = showGridView;

    // Command Palette Logic
    function showCmdPalette() {
        if (!cmdPalette) return;
        cmdPalette.classList.remove('hidden');
        if (cmdInput) {
            cmdInput.value = '';
            cmdInput.focus();
        }
        renderCmdResults('');
    }

    function hideCmdPalette() {
        if (!cmdPalette) return;
        cmdPalette.classList.add('hidden');
        selectedCmdIndex = -1;
        filteredCmdItems = [];
    }

    if (cmdTrigger) {
        cmdTrigger.onclick = (e) => {
            e.preventDefault();
            showCmdPalette();
        };
    }

    if (cmdBackdrop) {
        cmdBackdrop.onclick = hideCmdPalette;
    }

    const cmdEscBtn = document.querySelector('.cmd-esc');
    if (cmdEscBtn) {
        cmdEscBtn.onclick = hideCmdPalette;
    }

    if (cmdInput) {
        cmdInput.addEventListener('input', (e) => {
            renderCmdResults(e.target.value);
        });

        cmdInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (filteredCmdItems.length === 0) return;
                selectedCmdIndex = (selectedCmdIndex + 1) % filteredCmdItems.length;
                updateSelectedCmdItem();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (filteredCmdItems.length === 0) return;
                selectedCmdIndex = (selectedCmdIndex - 1 + filteredCmdItems.length) % filteredCmdItems.length;
                updateSelectedCmdItem();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedCmdIndex >= 0 && selectedCmdIndex < filteredCmdItems.length) {
                    const item = filteredCmdItems[selectedCmdIndex];
                    openDoc(item);
                    hideCmdPalette();
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                hideCmdPalette();
            }
        });
    }

    // Command palette global hotkey Ctrl+K listener
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (cmdPalette && cmdPalette.classList.contains('hidden')) {
                showCmdPalette();
            } else {
                hideCmdPalette();
            }
        }
    });

    function renderCmdResults(query) {
        if (!cmdResults) return;
        cmdResults.innerHTML = '';
        selectedCmdIndex = -1;

        const term = query.trim().toLowerCase();
        
        filteredCmdItems = allCheatsheets.filter(item => {
            const title = ((item.title[currentLang] || item.title['en']) || '').toLowerCase();
            const content = ((item.content[currentLang] || item.content['en']) || '').toLowerCase();
            return title.includes(term) || content.includes(term) || item.uri.toLowerCase().includes(term);
        }).slice(0, 10); // Limit to top 10 matches for view spacing

        if (filteredCmdItems.length === 0) {
            cmdResults.innerHTML = `<div class="cmd-results-empty">${translations[currentLang].noResults.replace('{searchTerm}', query)}</div>`;
            return;
        }

        selectedCmdIndex = 0; // Highlight first match by default
        
        filteredCmdItems.forEach((item, idx) => {
            const cat = getCategory(item.uri);
            const lowCat = cat.toLowerCase();
            const iconName = icons[lowCat] || 'fa-file-code';
            const prefix = (iconName.startsWith('fa-linux') || iconName.startsWith('fa-windows') || iconName.startsWith('fa-apple') || iconName.startsWith('fa-aws') || iconName.startsWith('fa-google')) ? 'fab' : 'fas';
            const title = (item.title[currentLang] || item.title['en']) || translations[currentLang].untitled;

            const div = document.createElement('div');
            div.className = `cmd-result-item ${idx === 0 ? 'cmd-selected' : ''}`;
            div.innerHTML = `
                <div class="cmd-result-icon"><i class="${prefix} ${iconName}"></i></div>
                <div class="cmd-result-content">
                    <div class="cmd-result-title">${title}</div>
                    <div class="cmd-result-cat">${getDisplayName(cat)}</div>
                </div>
                <div class="cmd-result-arrow"><i class="fas fa-chevron-right"></i></div>
            `;

            div.onclick = () => {
                openDoc(item);
                hideCmdPalette();
            };

            cmdResults.appendChild(div);
        });
    }

    function updateSelectedCmdItem() {
        if (!cmdResults) return;
        const items = cmdResults.querySelectorAll('.cmd-result-item');
        items.forEach((el, idx) => {
            if (idx === selectedCmdIndex) {
                el.classList.add('cmd-selected');
                el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                el.classList.remove('cmd-selected');
            }
        });
    }

    function buildSummaryTree() {
        const tree = {};
        
        const sortedCheatsheets = [...allCheatsheets].sort((a, b) => {
            const titleA = (a.title[currentLang] || a.title['en'] || '').toLowerCase();
            const titleB = (b.title[currentLang] || b.title['en'] || '').toLowerCase();
            return titleA.localeCompare(titleB);
        });

        sortedCheatsheets.forEach(item => {
            const parts = item.uri.split('/').filter(p => p.length > 0);
            if (parts.length === 0) return;
            
            const category = parts[0];
            if (!tree[category]) {
                tree[category] = {
                    name: category,
                    folders: {},
                    files: []
                };
            }
            
            if (parts.length === 1) {
                tree[category].landingItem = item;
            } else if (parts.length === 2) {
                tree[category].files.push(item);
            } else {
                const folderName = parts[1];
                if (!tree[category].folders[folderName]) {
                    tree[category].folders[folderName] = {
                        name: folderName,
                        files: []
                    };
                }
                tree[category].folders[folderName].files.push(item);
            }
        });
        
        return tree;
    }

    function countCategoryFiles(cat) {
        let count = cat.files.length;
        Object.keys(cat.folders).forEach(fKey => {
            count += cat.folders[fKey].files.length;
        });
        return count;
    }

    function renderSummaryDirectory() {
        const summaryDirectory = document.getElementById('summaryDirectory');
        if (!summaryDirectory) return;
        summaryDirectory.innerHTML = '';

        const tree = buildSummaryTree();
        const categories = Object.keys(tree).sort();

        categories.forEach(catKey => {
            const cat = tree[catKey];
            const displayName = getDisplayName(cat.name);
            
            const lowCat = cat.name.toLowerCase();
            const iconName = icons[lowCat] || 'fa-folder';
            const prefix = (iconName.startsWith('fa-linux') || iconName.startsWith('fa-windows') || iconName.startsWith('fa-apple') || iconName.startsWith('fa-aws') || iconName.startsWith('fa-google')) ? 'fab' : 'fas';

            const totalCategoryFiles = countCategoryFiles(cat);

            const node = document.createElement('div');
            node.className = 'summary-tree-node';

            const header = document.createElement('div');
            header.className = 'summary-node-header';

            const toggle = document.createElement('span');
            toggle.className = 'summary-node-toggle';
            toggle.innerHTML = '<i class="fas fa-chevron-right"></i>';

            const titleLink = document.createElement('a');
            titleLink.className = 'summary-node-title';
            titleLink.href = '#';
            titleLink.innerHTML = `<i class="${prefix} ${iconName}" style="color: var(--accent);"></i> ${displayName}`;
            
            titleLink.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                activeCategory = getCategory('/' + cat.name + '/');
                activePath = '/' + cat.name.toLowerCase().replace(/ /g, '-') + '/';
                updateSidebarActive(activeCategory);
                renderGrid();
                showGridView();
            };

            const countBadge = document.createElement('span');
            countBadge.className = 'summary-node-count';
            countBadge.textContent = `${totalCategoryFiles} modules`;

            header.appendChild(toggle);
            header.appendChild(titleLink);
            header.appendChild(countBadge);

            const content = document.createElement('div');
            content.className = 'summary-node-content';

            header.onclick = () => {
                const isExpanded = content.classList.contains('expanded');
                if (isExpanded) {
                    content.classList.remove('expanded');
                    toggle.classList.remove('expanded');
                } else {
                    content.classList.add('expanded');
                    toggle.classList.add('expanded');
                }
            };

            const folders = Object.keys(cat.folders).sort();
            folders.forEach(fKey => {
                const folder = cat.folders[fKey];
                const folderDiv = document.createElement('div');
                folderDiv.className = 'summary-subfolder';

                const subfolderHeader = document.createElement('div');
                subfolderHeader.className = 'summary-subfolder-header';
                subfolderHeader.innerHTML = `<i class="fas fa-folder"></i> ${getDisplayName(folder.name)}`;
                subfolderHeader.onclick = () => {
                    activeCategory = getCategory('/' + cat.name + '/');
                    activePath = '/' + cat.name.toLowerCase().replace(/ /g, '-') + '/' + folder.name.toLowerCase().replace(/ /g, '-') + '/';
                    updateSidebarActive(activeCategory);
                    renderGrid();
                    showGridView();
                };

                const subfolderFiles = document.createElement('div');
                subfolderFiles.className = 'summary-subfolder-files';

                folder.files.forEach(item => {
                    const fileLink = document.createElement('a');
                    fileLink.className = 'summary-file-link';
                    fileLink.href = '#';
                    fileLink.innerHTML = `<i class="far fa-file-alt"></i> ${(item.title[currentLang] || item.title['en']) || translations[currentLang].untitled}`;
                    fileLink.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openDoc(item);
                    };
                    subfolderFiles.appendChild(fileLink);
                });

                folderDiv.appendChild(subfolderHeader);
                folderDiv.appendChild(subfolderFiles);
                content.appendChild(folderDiv);
            });

            if (cat.files.length > 0) {
                const directFilesDiv = document.createElement('div');
                directFilesDiv.className = 'summary-subfolder-files';
                directFilesDiv.style.marginLeft = '0';
                directFilesDiv.style.paddingLeft = '0';
                directFilesDiv.style.borderLeft = 'none';

                cat.files.forEach(item => {
                    const fileLink = document.createElement('a');
                    fileLink.className = 'summary-file-link';
                    fileLink.href = '#';
                    fileLink.innerHTML = `<i class="far fa-file-alt"></i> ${(item.title[currentLang] || item.title['en']) || translations[currentLang].untitled}`;
                    fileLink.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openDoc(item);
                    };
                    directFilesDiv.appendChild(fileLink);
                });
                content.appendChild(directFilesDiv);
            }

            node.appendChild(header);
            node.appendChild(content);
            summaryDirectory.appendChild(node);
        });
    }

    init();
});
