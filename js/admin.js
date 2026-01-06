/**
 * VOLTAGE BRIGHT - Admin Panel Scripts
 * Extracted from _v0ltage_ctrl.html for centralized JS management
 */

// Simple password (client-side - for internal use only)
const ADMIN_PASSWORD = 'voltage2024';

// State
let projects = [];
let isLoggedIn = false;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminPanel = document.getElementById('adminPanel');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const galleryGrid = document.getElementById('galleryGrid');
const projectModal = document.getElementById('projectModal');
const addProjectBtn = document.getElementById('addProjectBtn');
const modalClose = document.getElementById('modalClose');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');
const exportBtn = document.getElementById('exportBtn');
const previewBtn = document.getElementById('previewBtn');
const toast = document.getElementById('toast');

// Check session
if (sessionStorage.getItem('voltage_admin_auth') === 'true') {
    showAdminPanel();
}

// Login
loginBtn.addEventListener('click', handleLogin);
passwordInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') handleLogin();
});

function handleLogin() {
    if (passwordInput.value === ADMIN_PASSWORD) {
        sessionStorage.setItem('voltage_admin_auth', 'true');
        showAdminPanel();
    } else {
        loginError.style.display = 'block';
        passwordInput.value = '';
    }
}

function showAdminPanel() {
    isLoggedIn = true;
    loginScreen.style.display = 'none';
    adminPanel.style.display = 'block';
    loadProjects();
}

// Logout
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('voltage_admin_auth');
    location.reload();
});

// Load projects from gallery-data.js
function loadProjects() {
    if (typeof galleryProjects !== 'undefined') {
        projects = [...galleryProjects];
    } else {
        projects = [];
    }
    renderGallery();
    updateStats();
}

// Render gallery
function renderGallery() {
    galleryGrid.innerHTML = projects.map((project, index) => `
        <div class="gallery-card">
            <img src="${project.folder}${project.images[0] || ''}"
                 alt="${project.name}"
                 class="gallery-image"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 150%22><rect fill=%22%2312121a%22 width=%22200%22 height=%22150%22/><text x=%2250%%22 y=%2250%%22 fill=%22%23888%22 text-anchor=%22middle%22 dy=%22.3em%22>No Image</text></svg>'">
            <div class="gallery-info">
                <h3 class="gallery-title">${project.name}</h3>
                <span class="gallery-category">${project.category}</span>
                <p class="gallery-count">${project.images.length} صورة</p>
            </div>
            <div class="gallery-actions">
                <button class="btn-edit" onclick="editProject(${index})">تعديل</button>
                <button class="btn-delete" onclick="deleteProject(${index})">حذف</button>
            </div>
        </div>
    `).join('');
}

// Update stats
function updateStats() {
    document.getElementById('totalProjects').textContent = projects.length;
    document.getElementById('totalImages').textContent = projects.reduce((sum, p) => sum + p.images.length, 0);
    const categories = [...new Set(projects.map(p => p.category))];
    document.getElementById('totalCategories').textContent = categories.length;
}

// Add project
addProjectBtn.addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'إضافة مشروع جديد';
    document.getElementById('projectId').value = '';
    document.getElementById('projectName').value = '';
    document.getElementById('projectNameEn').value = '';
    document.getElementById('projectSlug').value = '';
    document.getElementById('projectCategory').value = 'نيون';
    document.getElementById('projectFolder').value = '';
    document.getElementById('projectImages').value = '';
    projectModal.classList.add('active');
});

// Edit project
function editProject(index) {
    const project = projects[index];
    document.getElementById('modalTitle').textContent = 'تعديل المشروع';
    document.getElementById('projectId').value = index;
    document.getElementById('projectName').value = project.name;
    document.getElementById('projectNameEn').value = project.nameEn || project.slug;
    document.getElementById('projectSlug').value = project.slug;
    document.getElementById('projectCategory').value = project.category;
    document.getElementById('projectFolder').value = project.folder;
    document.getElementById('projectImages').value = project.images.join('\n');
    projectModal.classList.add('active');
}

// Delete project
function deleteProject(index) {
    if (confirm(`هل أنت متأكد من حذف "${projects[index].name}"?`)) {
        projects.splice(index, 1);
        renderGallery();
        updateStats();
        showToast('تم حذف المشروع بنجاح');
    }
}

// Close modal
modalClose.addEventListener('click', () => projectModal.classList.remove('active'));
cancelBtn.addEventListener('click', () => projectModal.classList.remove('active'));

// Save project
saveBtn.addEventListener('click', () => {
    const id = document.getElementById('projectId').value;
    const name = document.getElementById('projectName').value.trim();
    const nameEn = document.getElementById('projectNameEn').value.trim();
    const slug = document.getElementById('projectSlug').value.trim();
    const category = document.getElementById('projectCategory').value;
    const folder = document.getElementById('projectFolder').value.trim();
    const imagesText = document.getElementById('projectImages').value.trim();
    const images = imagesText.split('\n').map(img => img.trim()).filter(img => img);

    if (!name || !slug || !folder || images.length === 0) {
        showToast('يرجى ملء جميع الحقول المطلوبة', true);
        return;
    }

    const project = { name, nameEn, slug, category, folder, images };

    if (id === '') {
        // Add new
        projects.push(project);
        showToast('تم إضافة المشروع بنجاح');
    } else {
        // Update existing
        projects[parseInt(id)] = project;
        showToast('تم تحديث المشروع بنجاح');
    }

    renderGallery();
    updateStats();
    projectModal.classList.remove('active');
});

// Export
exportBtn.addEventListener('click', () => {
    const jsContent = `// Gallery Data - Auto-generated from Admin Panel
// Last updated: ${new Date().toLocaleString('ar-SA')}

const galleryProjects = ${JSON.stringify(projects, null, 2)};

// Category translations
const categoryTranslations = {
    'نيون': 'Neon',
    'فعاليات': 'Events',
    'معارض': 'Exhibitions',
    'ألعاب': 'Games',
    'مقاهي': 'Cafes',
    'مناسبات': 'Occasions'
};
`;
    const blob = new Blob([jsContent], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gallery-data.js';
    a.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير الملف بنجاح');
});

// Preview
previewBtn.addEventListener('click', () => {
    window.open('index.html', '_blank');
});

// Section Switching
document.querySelectorAll('.admin-nav-btn[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.dataset.section;

        // Update nav buttons
        document.querySelectorAll('.admin-nav-btn[data-section]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update sections
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        const targetSection = document.getElementById(section + 'Section');
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
        }

        // Hide other sections
        document.querySelectorAll('.admin-section').forEach(s => {
            if (!s.classList.contains('active')) {
                s.style.display = 'none';
            }
        });
    });
});

// Export Content JSON
const exportContentBtn = document.getElementById('exportContentBtn');
exportContentBtn.addEventListener('click', () => {
    const content = {
        hero: {
            titleAr: document.getElementById('heroTitleAr').value,
            descAr: document.getElementById('heroDescAr').value,
            statsProjects: document.getElementById('statsProjects').value,
            statsClients: document.getElementById('statsClients').value
        },
        about: {
            story: document.getElementById('aboutStory').value,
            mission: document.getElementById('aboutMission').value
        },
        contact: {
            phoneSales: document.getElementById('phoneSales').value,
            phoneSupport: document.getElementById('phoneSupport').value,
            phoneProjects: document.getElementById('phoneProjects').value,
            email: document.getElementById('email').value
        },
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website-content.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير المحتوى بنجاح');
});

// Save Content Button
const saveContentBtn = document.getElementById('saveContentBtn');
saveContentBtn.addEventListener('click', () => {
    // Store in localStorage for persistence
    const content = {
        hero: {
            titleAr: document.getElementById('heroTitleAr').value,
            descAr: document.getElementById('heroDescAr').value,
            statsProjects: document.getElementById('statsProjects').value,
            statsClients: document.getElementById('statsClients').value
        },
        about: {
            story: document.getElementById('aboutStory').value,
            mission: document.getElementById('aboutMission').value
        },
        contact: {
            phoneSales: document.getElementById('phoneSales').value,
            phoneSupport: document.getElementById('phoneSupport').value,
            phoneProjects: document.getElementById('phoneProjects').value,
            email: document.getElementById('email').value
        }
    };
    localStorage.setItem('voltage_content', JSON.stringify(content));
    showToast('تم حفظ التغييرات - قم بالتصدير لتحديث الموقع');
});

// Load saved content from localStorage
function loadSavedContent() {
    const saved = localStorage.getItem('voltage_content');
    if (saved) {
        const content = JSON.parse(saved);
        if (content.hero) {
            document.getElementById('heroTitleAr').value = content.hero.titleAr || '';
            document.getElementById('heroDescAr').value = content.hero.descAr || '';
            document.getElementById('statsProjects').value = content.hero.statsProjects || '300';
            document.getElementById('statsClients').value = content.hero.statsClients || '400';
        }
        if (content.about) {
            document.getElementById('aboutStory').value = content.about.story || '';
            document.getElementById('aboutMission').value = content.about.mission || '';
        }
        if (content.contact) {
            document.getElementById('phoneSales').value = content.contact.phoneSales || '';
            document.getElementById('phoneSupport').value = content.contact.phoneSupport || '';
            document.getElementById('phoneProjects').value = content.contact.phoneProjects || '';
            document.getElementById('email').value = content.contact.email || '';
        }
    }
}

// Call on page load
loadSavedContent();

// Toast notification
function showToast(message, isError = false) {
    toast.textContent = message;
    toast.className = 'toast show' + (isError ? ' error' : '');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Keyboard shortcut to close modal
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        projectModal.classList.remove('active');
    }
});

// ===== GitHub Integration =====

// Load GitHub settings from localStorage
function loadGitHubSettings() {
    const settings = localStorage.getItem('voltage_github_settings');
    if (settings) {
        const parsed = JSON.parse(settings);
        document.getElementById('githubToken').value = parsed.token || '';
        document.getElementById('githubRepo').value = parsed.repo || 'ridrisa/voltage-ultimate';
    }
    updateGitHubStatus();
}

// Save GitHub settings
document.getElementById('saveGithubSettings').addEventListener('click', () => {
    const token = document.getElementById('githubToken').value.trim();
    const repo = document.getElementById('githubRepo').value.trim();

    if (!token || !repo) {
        showToast('يرجى إدخال Token واسم المستودع', true);
        return;
    }

    localStorage.setItem('voltage_github_settings', JSON.stringify({ token, repo }));
    showToast('تم حفظ إعدادات GitHub بنجاح');
    updateGitHubStatus();

    // Test the connection
    testGitHubConnection(token, repo);
});

// Update GitHub status indicator
function updateGitHubStatus() {
    const settings = localStorage.getItem('voltage_github_settings');
    const statusEl = document.getElementById('githubStatus');
    if (statusEl) {
        if (settings && JSON.parse(settings).token) {
            statusEl.innerHTML = '<span class="status-connected">✓ متصل</span>';
        } else {
            statusEl.innerHTML = '<span class="status-disconnected">غير متصل</span>';
        }
    }
}

// Test GitHub connection
async function testGitHubConnection(token, repo) {
    try {
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            showToast('✓ تم الاتصال بـ GitHub بنجاح');
        } else {
            showToast('فشل الاتصال - تحقق من Token والمستودع', true);
        }
    } catch (error) {
        showToast('خطأ في الاتصال بـ GitHub', true);
    }
}

// Commit file to GitHub
async function commitToGitHub(filePath, content, message) {
    const settings = localStorage.getItem('voltage_github_settings');
    if (!settings) {
        showToast('يرجى إعداد GitHub أولاً من الإعدادات', true);
        return false;
    }

    const { token, repo } = JSON.parse(settings);
    if (!token || !repo) {
        showToast('إعدادات GitHub غير مكتملة', true);
        return false;
    }

    try {
        // Get the current file SHA (required for updates)
        const getFileResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        let sha = null;
        if (getFileResponse.ok) {
            const fileData = await getFileResponse.json();
            sha = fileData.sha;
        }

        // Prepare the request body
        const body = {
            message: message,
            content: btoa(unescape(encodeURIComponent(content))), // Base64 encode with UTF-8 support
            branch: 'master'
        };

        if (sha) {
            body.sha = sha;
        }

        // Commit the file
        const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            return true;
        } else {
            const error = await response.json();
            console.error('GitHub API Error:', error);
            return false;
        }
    } catch (error) {
        console.error('GitHub Commit Error:', error);
        return false;
    }
}

// Auto-publish to GitHub when saving gallery
async function publishGalleryToGitHub() {
    const jsContent = `// Gallery Data - Auto-generated from Admin Panel
// Last updated: ${new Date().toLocaleString('ar-SA')}

const galleryProjects = ${JSON.stringify(projects, null, 2)};

// Category translations
const categoryTranslations = {
    'نيون': 'Neon',
    'فعاليات': 'Events',
    'معارض': 'Exhibitions',
    'ألعاب': 'Games',
    'مقاهي': 'Cafes',
    'مناسبات': 'Occasions'
};
`;

    showToast('جاري النشر إلى GitHub...');
    const success = await commitToGitHub(
        'js/gallery-data.js',
        jsContent,
        `📸 تحديث معرض الأعمال - ${new Date().toLocaleDateString('ar-SA')}`
    );

    if (success) {
        showToast('✓ تم النشر! سيتم تحديث الموقع تلقائياً خلال دقيقة');
    } else {
        showToast('فشل النشر - تحقق من إعدادات GitHub', true);
    }
}

// Add "Publish to GitHub" button functionality
const publishBtn = document.getElementById('publishGitHubBtn');
if (publishBtn) {
    publishBtn.addEventListener('click', publishGalleryToGitHub);
}

// Load GitHub settings on page load
loadGitHubSettings();

// Social Media Links Handler
const saveSocialLinksBtn = document.getElementById('saveSocialLinks');
if (saveSocialLinksBtn) {
    // Load existing social links
    const socialLinks = JSON.parse(localStorage.getItem('voltage_social_links') || '{}');
    if (socialLinks.instagram) document.getElementById('socialInstagram').value = socialLinks.instagram;
    if (socialLinks.twitter) document.getElementById('socialTwitter').value = socialLinks.twitter;
    if (socialLinks.linkedin) document.getElementById('socialLinkedIn').value = socialLinks.linkedin;
    if (socialLinks.tiktok) document.getElementById('socialTikTok').value = socialLinks.tiktok;
    if (socialLinks.snapchat) document.getElementById('socialSnapchat').value = socialLinks.snapchat;

    saveSocialLinksBtn.addEventListener('click', () => {
        const links = {
            instagram: document.getElementById('socialInstagram').value.trim(),
            twitter: document.getElementById('socialTwitter').value.trim(),
            linkedin: document.getElementById('socialLinkedIn').value.trim(),
            tiktok: document.getElementById('socialTikTok').value.trim(),
            snapchat: document.getElementById('socialSnapchat').value.trim()
        };

        localStorage.setItem('voltage_social_links', JSON.stringify(links));
        showToast('تم حفظ روابط التواصل الاجتماعي');
    });
}
