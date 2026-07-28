/**
 * CYBERNETIC DECK CONTROL ENGINE
 * Version: v3.12 Elegant 3D Humanoid Robot + Dynamic REST API / MongoDB Integration
 */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // 0. REST API & MONGODB / LOCALSTORAGE CONFIG
    // ----------------------------------------------------
    const API_BASE_URL = window.location.origin.includes('http')
        ? '/api/projects'
        : 'http://localhost:5000/api/projects';

    const API_LINKEDIN_URL = window.location.origin.includes('http')
        ? '/api/linkedin-posts'
        : 'http://localhost:5000/api/linkedin-posts';

    const API_LINKEDIN_CONFIG_URL = window.location.origin.includes('http')
        ? '/api/linkedin-config'
        : 'http://localhost:5000/api/linkedin-config';

    const STORAGE_KEY = 'chethiya_projects_db';
    const STORAGE_KEY_LINKEDIN = 'chethiya_linkedin_posts_db';

    const DEFAULT_PROJECTS = [
        {
            _id: 'proj_01',
            title: 'Student Record Manager',
            description: 'A comprehensive Java & Object-Oriented system built for academic record management and course analytics.',
            technologies: ['JAVA', 'OOP', 'DATA STRUCTURES'],
            projectLink: 'https://github.com/Chethiya4/Student--record-manager.git'
        },
        {
            _id: 'proj_02',
            title: 'Task Manager App',
            description: 'A full-stack productivity tool for tracking tasks, deadlines, and project milestones.',
            technologies: ['EXPRESS', 'MONGODB', 'MONGOOSE'],
            projectLink: 'https://github.com/Chethiya4/Task-Manager'
        },
        {
            _id: 'proj_03',
            title: 'Weather Dashboard Node',
            description: 'A real-time weather metrics dashboard fetching live meteorological data from public APIs.',
            technologies: ['JAVASCRIPT', 'API', 'CSS'],
            projectLink: 'https://github.com/Chethiya4/Weather-Dashboard'
        }
    ];

    const DEFAULT_LINKEDIN_POSTS = [
        {
            _id: 'ln_real_01',
            authorName: 'Chethiya Samaradiwakara',
            authorTitle: 'Undergraduate at USJ | Vice Chairperson IEEE CS',
            authorAvatar: 'personal_photo.jpg',
            postText: 'Excited for this opportunity to learn, lead, and grow alongside an amazing team. ✨ Strong leadership grows through collaboration. Congratulations to Mr. Chethiya Samaradiwakara on being appointed as the Vice Chairperson of the IEEE Computer Society Student Branch Chapter 2026/27 of the University of Sri Jayewardenepura. Wishing you a successful journey of support, teamwork, and dedication in shaping the future of our community. 🌟 #IEEE #USJ #IEEESB #CS',
            postImage: '',
            postLink: 'https://www.linkedin.com/posts/chethiya-samaradiwakara-11a816322_excited-for-this-opportunity-to-learn-lead-share-7456313010702245888-Iwo6/',
            embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7456313010702245888',
            likesCount: 21,
            commentsCount: 1,
            timestamp: new Date('2026-07-20T10:00:00Z').toISOString()
        },
        {
            _id: 'ln_real_02',
            authorName: 'Chethiya Samaradiwakara',
            authorTitle: 'Undergraduate at USJ | Vice Chairperson IEEE CS',
            authorAvatar: 'personal_photo.jpg',
            postText: 'Grateful to have been part of IEEE EXCELLENCIA. ✨ It was a great opportunity to join this special event, meet fellow IEEE members, and be part of an inspiring atmosphere. Every experience like this is a reminder of the value of being involved in such an amazing community. Looking forward to creating more memories, building new connections, and taking part in many more IEEE events in the future. 🌐 #IEEE #IEEEXCELLENCIA #USJ #ComputerScience',
            postImage: '',
            postLink: 'https://www.linkedin.com/posts/chethiya-samaradiwakara-11a816322_ieee-ugcPost-7485775607662800896-DtJv/',
            embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7485775607662800896',
            likesCount: 35,
            commentsCount: 5,
            timestamp: new Date('2026-07-15T10:00:00Z').toISOString()
        },
        {
            _id: 'ln_real_03',
            authorName: 'Chethiya Samaradiwakara',
            authorTitle: 'Undergraduate at USJ | Vice Chairperson IEEE CS',
            authorAvatar: 'personal_photo.jpg',
            postText: 'Glad to be part of the Computer Science Association Board 2026/2027. 💻 Looking ahead with enthusiasm to work with the team, contribute to impactful initiatives, and support our student community. Excited for the journey ahead! 🎓 #CSA #ComputerScience #USJ #Leadership',
            postImage: '',
            postLink: 'https://www.linkedin.com/posts/chethiya-samaradiwakara-11a816322_glad-to-be-part-of-the-computer-science-association-share-7425797608176046080-7PHA/',
            embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7425797608176046080',
            likesCount: 42,
            commentsCount: 8,
            timestamp: new Date('2026-07-10T10:00:00Z').toISOString()
        }
    ];

    let projectsState = [];
    let linkedinState = [];
    let linkedinConfigState = { widgetScript: '', mode: 'cards' };

    // DOM Elements for Projects & Admin Node
    const projectsGrid = document.getElementById('projects-grid');
    const adminProjectsList = document.getElementById('admin-projects-list');

    const projectForm = document.getElementById('project-form');
    const formCardTitle = document.getElementById('form-card-title');
    const inputId = document.getElementById('project-id');
    const inputTitle = document.getElementById('project-title');
    const inputDesc = document.getElementById('project-desc');
    const inputTech = document.getElementById('project-tech');
    const inputLink = document.getElementById('project-link');
    const btnSave = document.getElementById('btn-save-project');
    const btnReset = document.getElementById('btn-reset-form');
    const toastCyber = document.getElementById('toast-cyber');

    // DOM Elements for LinkedIn Node
    const linkedinGrid = document.getElementById('linkedin-grid');
    const btnRefreshLinkedin = document.getElementById('btn-refresh-linkedin');

    const adminLinkedinList = document.getElementById('admin-linkedin-list');
    const linkedinForm = document.getElementById('linkedin-form');
    const lnFormCardTitle = document.getElementById('ln-form-card-title');
    const lnPostId = document.getElementById('ln-post-id');
    const lnPostText = document.getElementById('ln-post-text');
    const lnPostLink = document.getElementById('ln-post-link');
    const lnPostImage = document.getElementById('ln-post-image');
    const lnLikesCount = document.getElementById('ln-likes-count');
    const lnCommentsCount = document.getElementById('ln-comments-count');
    const btnSaveLnPost = document.getElementById('btn-save-ln-post');
    const btnResetLnForm = document.getElementById('btn-reset-ln-form');

    // Admin Tabs
    const tabBtnProjects = document.getElementById('tab-btn-projects');
    const tabBtnLinkedin = document.getElementById('tab-btn-linkedin');
    const tabProjectsContent = document.getElementById('admin-tab-projects-content');
    const tabLinkedinContent = document.getElementById('admin-tab-linkedin-content');

    if (tabBtnProjects && tabBtnLinkedin) {
        tabBtnProjects.addEventListener('click', () => {
            tabBtnProjects.classList.add('active');
            tabBtnLinkedin.classList.remove('active');
            if (tabProjectsContent) tabProjectsContent.classList.remove('hidden');
            if (tabLinkedinContent) tabLinkedinContent.classList.add('hidden');
        });

        tabBtnLinkedin.addEventListener('click', () => {
            tabBtnLinkedin.classList.add('active');
            tabBtnProjects.classList.remove('active');
            if (tabLinkedinContent) tabLinkedinContent.classList.remove('hidden');
            if (tabProjectsContent) tabProjectsContent.classList.add('hidden');
        });
    }

    if (btnRefreshLinkedin) {
        btnRefreshLinkedin.addEventListener('click', () => {
            loadLinkedinPosts();
            showCyberToast('LINKEDIN STREAM REFRESHED!');
        });
    }


    // ----------------------------------------------------
    // 1. INTERACTIVE SOUND EVENTS (Tactile UI Feedback)
    // ----------------------------------------------------
    function setupSoundEvents() {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card-elegant, .admin-project-item-cyber');
        interactiveElements.forEach(el => {
            if (!isTouchDevice) {
                el.addEventListener('mouseenter', () => {
                    playHoverSound();
                }, { passive: true });
            }
            el.addEventListener('click', () => {
                playClickSound();
            }, { passive: true });
        });
    }
    setupSoundEvents();


    // ----------------------------------------------------
    // 2. SPLINE 3D INTERACTIVE ROBOT SCENE
    // ----------------------------------------------------
    const splineViewer = document.querySelector('spline-viewer');
    if (splineViewer) {
        // Function to strip Spline watermark / logo from shadow DOM
        const stripSplineLogo = () => {
            if (splineViewer.shadowRoot) {
                if (!splineViewer.shadowRoot.querySelector('#hide-spline-logo-style')) {
                    const style = document.createElement('style');
                    style.id = 'hide-spline-logo-style';
                    style.textContent = `
                        #logo, #spline-logo, a[href*="spline.design"], a[href*="spline"], .watermark, #watermark {
                            display: none !important;
                            opacity: 0 !important;
                            visibility: hidden !important;
                            pointer-events: none !important;
                        }
                    `;
                    splineViewer.shadowRoot.appendChild(style);
                }
                const logoEl = splineViewer.shadowRoot.querySelector('#logo, #spline-logo, a[href*="spline.design"], a[href*="spline"]');
                if (logoEl) {
                    logoEl.remove();
                }
            }
        };

        stripSplineLogo();
        splineViewer.addEventListener('load', stripSplineLogo);
        if (window.MutationObserver && splineViewer.shadowRoot) {
            const observer = new MutationObserver(stripSplineLogo);
            observer.observe(splineViewer.shadowRoot, { childList: true, subtree: true });
        } else {
            const intervalId = setInterval(stripSplineLogo, 250);
            setTimeout(() => clearInterval(intervalId), 3000);
        }
    }


    // ----------------------------------------------------
    // 3. AUDIO FEEDBACK SYSTEM (Web Audio API Synthesizer)
    // ----------------------------------------------------
    let audioCtx = null;
    let soundEnabled = false;
    const soundToggleBtn = document.getElementById('sound-toggle');
    const soundIconOn = soundToggleBtn ? soundToggleBtn.querySelector('.sound-icon.on') : null;
    const soundIconOff = soundToggleBtn ? soundToggleBtn.querySelector('.sound-icon.off') : null;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
    }

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            initAudio();
            soundEnabled = !soundEnabled;
            if (soundIconOn && soundIconOff) {
                if (soundEnabled) {
                    soundIconOn.classList.remove('hidden');
                    soundIconOff.classList.add('hidden');
                    playClickSound();
                } else {
                    soundIconOn.classList.add('hidden');
                    soundIconOff.classList.remove('hidden');
                }
            }
        });
    }

    function playHoverSound() {
        if (!soundEnabled || !audioCtx) return;
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
        
        gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    }

    function playClickSound() {
        if (!soundEnabled || !audioCtx) return;
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }


    // ----------------------------------------------------
    // 4. REST API CLIENT & MONGODB / LOCALSTORAGE DATA MANAGEMENT
    // ----------------------------------------------------
    function getLocalProjects() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
            return DEFAULT_PROJECTS;
        }
        try {
            return JSON.parse(data);
        } catch {
            return DEFAULT_PROJECTS;
        }
    }

    function saveLocalProjects(projects) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }

    async function loadProjects() {
        try {
            const response = await fetch(API_BASE_URL);
            if (response.ok) {
                projectsState = await response.json();
            } else {
                throw new Error('API server returned non-OK status');
            }
        } catch (err) {
            console.log('Using LocalStorage fallback dataset:', err.message);
            projectsState = getLocalProjects();
        }

        renderProjectsGrid();
        renderAdminProjectsList();
        setupSoundEvents();
    }

    async function createProject(projectData) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });

            if (response.ok) {
                const created = await response.json();
                projectsState.unshift(created);
                showCyberToast('PROJECT NODE CREATED IN MONGODB!');
            } else {
                throw new Error('API creation failed');
            }
        } catch (err) {
            const newProj = {
                _id: 'proj_' + Date.now(),
                ...projectData,
                technologies: Array.isArray(projectData.technologies)
                    ? projectData.technologies
                    : projectData.technologies.split(',').map(t => t.trim()).filter(Boolean)
            };
            projectsState.unshift(newProj);
            saveLocalProjects(projectsState);
            showCyberToast('PROJECT NODE SAVED LOCALLY!');
        }

        renderProjectsGrid();
        renderAdminProjectsList();
        resetForm();
        setupSoundEvents();
    }

    async function updateProject(id, projectData) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });

            if (response.ok) {
                const updated = await response.json();
                const idx = projectsState.findIndex(p => p._id === id);
                if (idx !== -1) projectsState[idx] = updated;
                showCyberToast('PROJECT NODE UPDATED IN DATABASE!');
            } else {
                throw new Error('API update failed');
            }
        } catch (err) {
            const idx = projectsState.findIndex(p => p._id === id);
            if (idx !== -1) {
                projectsState[idx] = {
                    ...projectsState[idx],
                    ...projectData,
                    technologies: Array.isArray(projectData.technologies)
                        ? projectData.technologies
                        : projectData.technologies.split(',').map(t => t.trim()).filter(Boolean)
                };
                saveLocalProjects(projectsState);
                showCyberToast('PROJECT NODE UPDATED LOCALLY!');
            }
        }

        renderProjectsGrid();
        renderAdminProjectsList();
        resetForm();
        setupSoundEvents();
    }

    async function deleteProject(id) {
        if (!confirm('CONFIRM DELETION OF TARGET PROJECT NODE?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                projectsState = projectsState.filter(p => p._id !== id);
                showCyberToast('PROJECT NODE REMOVED FROM DATABASE!');
            } else {
                throw new Error('API deletion failed');
            }
        } catch (err) {
            projectsState = projectsState.filter(p => p._id !== id);
            saveLocalProjects(projectsState);
            showCyberToast('PROJECT NODE REMOVED LOCALLY!');
        }

        renderProjectsGrid();
        renderAdminProjectsList();
        if (inputId && inputId.value === id) resetForm();
        setupSoundEvents();
    }


    // ----------------------------------------------------
    // 5. DYNAMIC DOM RENDER FUNCTIONS
    // ----------------------------------------------------
    function renderProjectsGrid() {
        if (!projectsGrid) return;

        if (projectsState.length === 0) {
            projectsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 40px 0;">
                    [ NO REGISTERED PROJECTS FOUND IN DATABASE NODE ]
                </div>
            `;
            return;
        }

        projectsGrid.innerHTML = projectsState.map((project, index) => {
            const techList = Array.isArray(project.technologies)
                ? project.technologies
                : (project.technologies ? project.technologies.split(',') : []);

            const techBadges = techList
                .map(t => `<span class="badge">${escapeHTML(t.trim())}</span>`)
                .join('');

            const linkUrl = project.projectLink || '#';
            const regNum = `REG_0${index + 1}`;

            return `
                <article class="project-card-elegant">
                    <div class="card-glow"></div>
                    <div class="card-inner">
                        <span class="project-num">[ ${regNum} ]</span>
                        <h3 class="project-title-elegant">${escapeHTML(project.title)}</h3>
                        <p class="project-desc-elegant">
                            ${escapeHTML(project.description)}
                        </p>
                        <div class="project-meta-elegant">
                            ${techBadges}
                        </div>
                        <div class="project-links-row">
                            <a href="${escapeHTML(linkUrl)}" target="_blank" rel="noopener noreferrer" class="project-link-btn">CODE DECK</a>
                            <a href="${escapeHTML(linkUrl)}" target="_blank" rel="noopener noreferrer" class="project-link-btn primary">LIVE DEMO</a>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        // Re-attach card spotlight hover effects with cached rect bounds
        const projectCards = document.querySelectorAll('.project-card-elegant');
        projectCards.forEach(card => {
            let rect = null;
            card.addEventListener('mouseenter', () => {
                rect = card.getBoundingClientRect();
            }, { passive: true });

            card.addEventListener('mousemove', (e) => {
                if (!rect) rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                rect = null;
            }, { passive: true });
        });
    }

    function renderAdminProjectsList() {
        if (!adminProjectsList) return;

        if (projectsState.length === 0) {
            adminProjectsList.innerHTML = `
                <div style="text-align: center; color: var(--text-secondary); padding: 30px 0;">
                    [ NO DATABASE RECORDS FOUND ]
                </div>
            `;
            return;
        }

        adminProjectsList.innerHTML = projectsState.map(project => {
            const techList = Array.isArray(project.technologies)
                ? project.technologies
                : (project.technologies ? project.technologies.split(',') : []);

            const techBadges = techList
                .map(t => `<span class="tech-badge-cyber">${escapeHTML(t.trim())}</span>`)
                .join('');

            const linkUrl = project.projectLink || '';

            return `
                <div class="admin-project-item-cyber" data-id="${project._id}">
                    <div class="admin-project-info-cyber">
                        <h4 class="admin-project-title-cyber">${escapeHTML(project.title)}</h4>
                        <p class="admin-project-desc-cyber">${escapeHTML(project.description)}</p>
                        <div class="admin-project-techs-cyber">${techBadges}</div>
                        ${linkUrl ? `<a href="${escapeHTML(linkUrl)}" target="_blank" rel="noopener noreferrer" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); word-break: break-all;">${escapeHTML(linkUrl)}</a>` : ''}
                    </div>
                    <div class="admin-project-actions-cyber">
                        <button class="btn-cyber-action btn-cyber-edit" onclick="handleEditProject('${project._id}')">EDIT</button>
                        <button class="btn-cyber-action btn-cyber-delete" onclick="handleDeleteProject('${project._id}')">DELETE</button>
                    </div>
                </div>
            `;
        }).join('');
    }


    // ----------------------------------------------------
    // 6. FORM HANDLERS & CRUD EVENTS
    // ----------------------------------------------------
    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const id = inputId ? inputId.value : '';
            const title = inputTitle.value.trim();
            const description = inputDesc.value.trim();
            const techInput = inputTech.value.trim();
            const projectLink = inputLink.value.trim();

            if (!title || !description) {
                showCyberToast('ENTER REQUIRED TITLE & DESCRIPTION!');
                return;
            }

            const projectData = {
                title,
                description,
                technologies: techInput ? techInput.split(',').map(t => t.trim()).filter(Boolean) : [],
                projectLink
            };

            if (id) {
                updateProject(id, projectData);
            } else {
                createProject(projectData);
            }
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', resetForm);
    }

    function resetForm() {
        if (inputId) inputId.value = '';
        if (projectForm) projectForm.reset();
        if (formCardTitle) formCardTitle.textContent = 'ADD / UPDATE PROJECT NODE';
        if (btnSave) {
            const btnText = btnSave.querySelector('.btn-text');
            if (btnText) btnText.textContent = 'SAVE PROJECT';
        }
    }

    window.handleEditProject = function (id) {
        const project = projectsState.find(p => p._id === id);
        if (!project) return;

        if (inputId) inputId.value = project._id;
        if (inputTitle) inputTitle.value = project.title;
        if (inputDesc) inputDesc.value = project.description;
        if (inputTech) {
            inputTech.value = Array.isArray(project.technologies)
                ? project.technologies.join(', ')
                : project.technologies;
        }
        if (inputLink) inputLink.value = project.projectLink || '';

        if (formCardTitle) formCardTitle.textContent = 'UPDATE TARGET PROJECT NODE';
        if (btnSave) {
            const btnText = btnSave.querySelector('.btn-text');
            if (btnText) btnText.textContent = 'UPDATE PROJECT';
        }

        if (projectForm) {
            projectForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    window.handleDeleteProject = function (id) {
        deleteProject(id);
    };


    // ----------------------------------------------------
    // 7. COMMS DATA PACKET TRANSMISSION ANIMATION
    // ----------------------------------------------------
    const commsForm = document.getElementById('comms-form');
    const transmitStatus = document.getElementById('transmit-status');
    const statusOutput = document.getElementById('status-output');
    const btnCloseStatus = document.getElementById('btn-close-status');

    if (commsForm) {
        commsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            transmitStatus.classList.remove('hidden');
            btnCloseStatus.classList.add('hidden');
            
            const logs = [
                "INITIALIZING SECURE COMMS ROUTER...",
                "GENERATING TEMPORARY RSA-4096 SECURITY SHARDS...",
                "ENCRYPTING PAYLOAD MESSAGE DATA...",
                "TRANSMITTING ENCRYPTED SHARDS [S1, S2, S3]...",
                "WAITING FOR NODE RECEPTOR ACK...",
                "TRANSMISSION SUCCESSFUL."
            ];

            let logIndex = 0;
            
            function printTransmitLog() {
                if (logIndex < logs.length) {
                    statusOutput.textContent = logs[logIndex];
                    logIndex++;
                    
                    if (soundEnabled && audioCtx) {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(500 + Math.random() * 200, audioCtx.currentTime);
                        gain.gain.setValueAtTime(0.008, audioCtx.currentTime);
                        gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
                        osc.start();
                        osc.stop(audioCtx.currentTime + 0.03);
                    }
                    setTimeout(printTransmitLog, 700 + Math.random() * 500);
                } else {
                    btnCloseStatus.classList.remove('hidden');
                }
            }
            printTransmitLog();
        });
    }

    if (btnCloseStatus) {
        btnCloseStatus.addEventListener('click', () => {
            transmitStatus.classList.add('hidden');
            commsForm.reset();
        });
    }


    // ----------------------------------------------------
    // 8. HELPERS & TOAST
    // ----------------------------------------------------
    function showCyberToast(msg) {
        if (!toastCyber) return;
        toastCyber.textContent = msg;
        toastCyber.classList.remove('hidden');
        setTimeout(() => {
            toastCyber.classList.add('hidden');
        }, 3000);
    }

    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // ----------------------------------------------------
    // 9. FLOATING AI ASSISTANT CHAT BOT ENGINE
    // ----------------------------------------------------
    const aiToggleBtn = document.getElementById('ai-toggle-btn');
    const aiChatBox = document.getElementById('ai-chat-box');
    const aiChatClose = document.getElementById('ai-chat-close');
    const aiUserInput = document.getElementById('ai-user-input');
    const aiCharCount = document.getElementById('ai-char-count');
    const aiBtnSend = document.getElementById('ai-btn-send');
    const aiChatHistory = document.getElementById('ai-chat-history');

    if (aiToggleBtn && aiChatBox) {
        let isChatOpen = false;

        const toggleChat = (state) => {
            isChatOpen = typeof state === 'boolean' ? state : !isChatOpen;
            if (isChatOpen) {
                aiChatBox.classList.remove('hidden');
                aiToggleBtn.classList.add('open');
                const botIcon = aiToggleBtn.querySelector('.icon-bot');
                const closeIcon = aiToggleBtn.querySelector('.icon-close');
                if (botIcon) botIcon.classList.add('hidden');
                if (closeIcon) closeIcon.classList.remove('hidden');
                if (aiUserInput) aiUserInput.focus();
            } else {
                aiChatBox.classList.add('hidden');
                aiToggleBtn.classList.remove('open');
                const botIcon = aiToggleBtn.querySelector('.icon-bot');
                const closeIcon = aiToggleBtn.querySelector('.icon-close');
                if (botIcon) botIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');
            }
        };

        aiToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleChat();
        });

        if (aiChatClose) {
            aiChatClose.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleChat(false);
            });
        }

        // Close when clicking outside
        document.addEventListener('mousedown', (event) => {
            if (isChatOpen && aiChatBox && !aiChatBox.contains(event.target) && !aiToggleBtn.contains(event.target)) {
                toggleChat(false);
            }
        });

        // Input char counting & Enter handling
        if (aiUserInput && aiCharCount) {
            aiUserInput.addEventListener('input', () => {
                aiCharCount.textContent = aiUserInput.value.length;
            });

            aiUserInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendAiMessage();
                }
            });
        }

        if (aiBtnSend) {
            aiBtnSend.addEventListener('click', () => {
                sendAiMessage();
            });
        }

        function sendAiMessage() {
            if (!aiUserInput) return;
            const text = aiUserInput.value.trim();
            if (!text) return;

            // Render User Message
            appendChatMessage(text, 'user');
            aiUserInput.value = '';
            if (aiCharCount) aiCharCount.textContent = '0';

            // Simulate AI Bot Response after short delay
            setTimeout(() => {
                const responses = [
                    "Hello! I am Chethiya's AI Assistant. How can I help you explore this portfolio today?",
                    "Great query! Chethiya is a Full Stack Engineer specializing in React, Node.js, Express, and MongoDB.",
                    "You can check out the Operations Registry section to view active projects or manage them in the Admin Node!",
                    "Transmission received! Let me know if you need CV details or contact links."
                ];
                const reply = responses[Math.floor(Math.random() * responses.length)];
                appendChatMessage(reply, 'bot');
            }, 600);
        }

        function appendChatMessage(msg, sender) {
            if (!aiChatHistory) return;
            const msgDiv = document.createElement('div');
            msgDiv.className = `ai-msg-item ${sender}`;
            msgDiv.textContent = msg;
            aiChatHistory.appendChild(msgDiv);
            aiChatHistory.scrollTop = aiChatHistory.scrollHeight;
        }
    }

    // ----------------------------------------------------
    // 10. LINKEDIN POST STREAM ENGINE & CONTROLLER
    // ----------------------------------------------------
    function getLocalLinkedinPosts() {
        const data = localStorage.getItem(STORAGE_KEY_LINKEDIN);
        if (!data) {
            localStorage.setItem(STORAGE_KEY_LINKEDIN, JSON.stringify(DEFAULT_LINKEDIN_POSTS));
            return DEFAULT_LINKEDIN_POSTS;
        }
        try { return JSON.parse(data); } catch { return DEFAULT_LINKEDIN_POSTS; }
    }

    function saveLocalLinkedinPosts(posts) {
        localStorage.setItem(STORAGE_KEY_LINKEDIN, JSON.stringify(posts));
    }

    async function loadLinkedinPosts() {
        try {
            const response = await fetch(API_LINKEDIN_URL);
            if (response.ok) {
                linkedinState = await response.json();
            } else {
                throw new Error('API server returned non-OK status');
            }
        } catch (err) {
            linkedinState = getLocalLinkedinPosts();
        }

        try {
            const configResp = await fetch(API_LINKEDIN_CONFIG_URL);
            if (configResp.ok) {
                linkedinConfigState = await configResp.json();
                if (lnWidgetCode && linkedinConfigState.widgetScript) {
                    lnWidgetCode.value = linkedinConfigState.widgetScript;
                }
            }
        } catch (err) {
            console.log('LinkedIn Config load error:', err.message);
        }

        renderLinkedinFeed();
        renderAdminLinkedinList();
        setupSoundEvents();
    }

    function getLinkedinEmbedUrl(url) {
        if (!url) return '';
        if (url.includes('/embed/feed/update/')) return url;
        const numMatch = url.match(/\d{18,20}/);
        if (url.includes('ugcPost') && numMatch) {
            return `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${numMatch[0]}`;
        }
        if (numMatch) {
            return `https://www.linkedin.com/embed/feed/update/urn:li:share:${numMatch[0]}`;
        }
        return url;
    }

    function renderLinkedinFeed() {
        if (!linkedinGrid) return;

        if (linkedinState.length === 0) {
            linkedinGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 40px 0;">
                    [ NO LINKEDIN POSTS AVAILABLE IN STREAM ]
                </div>
            `;
            return;
        }

        linkedinGrid.innerHTML = linkedinState.map(post => {
            const embedSrc = post.embedUrl || (post.postLink ? getLinkedinEmbedUrl(post.postLink) : '');

            return `
                <div class="linkedin-white-card">
                    <iframe src="${escapeHTML(embedSrc)}" height="590" width="100%" frameborder="0" allowfullscreen="" title="LinkedIn Live Post Embed"></iframe>
                </div>
            `;
        }).join('');
    }

    function renderAdminLinkedinList() {
        if (!adminLinkedinList) return;

        if (linkedinState.length === 0) {
            adminLinkedinList.innerHTML = `
                <div style="text-align: center; color: var(--text-secondary); padding: 20px 0;">
                    [ NO LINKEDIN POSTS SAVED ]
                </div>
            `;
            return;
        }

        adminLinkedinList.innerHTML = linkedinState.map(post => {
            const timeAgo = formatRelativeTime(post.timestamp || post.createdAt);
            const snippet = post.postText.length > 80 ? post.postText.substring(0, 80) + '...' : post.postText;

            return `
                <div class="admin-project-item-cyber" data-id="${post._id}">
                    <div class="admin-project-info-cyber">
                        <h4 class="admin-project-title-cyber">${escapeHTML(snippet)}</h4>
                        <p class="admin-project-desc-cyber" style="font-family: var(--font-mono); font-size: 0.75rem;">
                            Posted: ${escapeHTML(timeAgo)} | 👍 ${post.likesCount || 0} Likes | 💬 ${post.commentsCount || 0} Comments
                        </p>
                    </div>
                    <div class="admin-project-actions-cyber">
                        <button class="btn-cyber-action btn-cyber-edit" onclick="handleEditLinkedinPost('${post._id}')">EDIT</button>
                        <button class="btn-cyber-action btn-cyber-delete" onclick="handleDeleteLinkedinPost('${post._id}')">DELETE</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function formatHashtags(text) {
        if (!text) return '';
        return text.replace(/#(\w+)/g, '<span class="linkedin-hashtag">#$1</span>');
    }

    function formatRelativeTime(dateStr) {
        if (!dateStr) return 'Recently';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 30) return date.toLocaleDateString();
        if (diffDays > 0) return `${diffDays}d ago`;
        if (diffHours > 0) return `${diffHours}h ago`;
        if (diffMins > 0) return `${diffMins}m ago`;
        return 'Just now';
    }

    if (linkedinForm) {
        linkedinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = lnPostId ? lnPostId.value : '';
            const postText = lnPostText.value.trim();
            const postLink = lnPostLink.value.trim();
            const postImage = lnPostImage ? lnPostImage.value.trim() : '';
            const likesCount = parseInt(lnLikesCount.value) || 0;
            const commentsCount = parseInt(lnCommentsCount.value) || 0;

            if (!postText) {
                showCyberToast('ENTER POST CONTENT!');
                return;
            }

            const postData = {
                authorName: 'Chethiya Samaradiwakara',
                authorTitle: 'Undergraduate at USJ | Vice Chairperson IEEE CS',
                authorAvatar: 'personal_photo.jpg',
                postText,
                postImage,
                postLink: postLink || 'https://www.linkedin.com/in/chethiya-samaradiwakara-11a816322/',
                likesCount,
                commentsCount
            };

            if (id) {
                await updateLinkedinPost(id, postData);
            } else {
                await createLinkedinPost(postData);
            }
        });
    }

    if (btnResetLnForm) {
        btnResetLnForm.addEventListener('click', resetLinkedinForm);
    }

    function resetLinkedinForm() {
        if (lnPostId) lnPostId.value = '';
        if (lnPostImage) lnPostImage.value = '';
        if (linkedinForm) linkedinForm.reset();
        if (lnFormCardTitle) lnFormCardTitle.textContent = 'ADD / SHOWCASE LINKEDIN POST';
        if (btnSaveLnPost) {
            const btnText = btnSaveLnPost.querySelector('.btn-text');
            if (btnText) btnText.textContent = 'SAVE LINKEDIN POST';
        }
    }

    async function createLinkedinPost(postData) {
        try {
            const response = await fetch(API_LINKEDIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
            if (response.ok) {
                const created = await response.json();
                linkedinState.unshift(created);
                showCyberToast('LINKEDIN POST CREATED IN MONGODB!');
            } else {
                throw new Error('API failed');
            }
        } catch (err) {
            const newMem = {
                _id: 'ln_' + Date.now(),
                ...postData,
                timestamp: new Date().toISOString()
            };
            linkedinState.unshift(newMem);
            saveLocalLinkedinPosts(linkedinState);
            showCyberToast('LINKEDIN POST SAVED LOCALLY!');
        }

        renderLinkedinFeed();
        renderAdminLinkedinList();
        resetLinkedinForm();
        setupSoundEvents();
    }

    async function updateLinkedinPost(id, postData) {
        try {
            const response = await fetch(`${API_LINKEDIN_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
            if (response.ok) {
                const updated = await response.json();
                const idx = linkedinState.findIndex(p => p._id === id);
                if (idx !== -1) linkedinState[idx] = updated;
                showCyberToast('LINKEDIN POST UPDATED IN DATABASE!');
            } else {
                throw new Error('API failed');
            }
        } catch (err) {
            const idx = linkedinState.findIndex(p => p._id === id);
            if (idx !== -1) {
                linkedinState[idx] = { ...linkedinState[idx], ...postData };
                saveLocalLinkedinPosts(linkedinState);
                showCyberToast('LINKEDIN POST UPDATED LOCALLY!');
            }
        }

        renderLinkedinFeed();
        renderAdminLinkedinList();
        resetLinkedinForm();
        setupSoundEvents();
    }

    async function deleteLinkedinPost(id) {
        if (!confirm('CONFIRM DELETION OF TARGET LINKEDIN POST?')) return;
        try {
            const response = await fetch(`${API_LINKEDIN_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                linkedinState = linkedinState.filter(p => p._id !== id);
                showCyberToast('LINKEDIN POST DELETED FROM DATABASE!');
            } else {
                throw new Error('API failed');
            }
        } catch (err) {
            linkedinState = linkedinState.filter(p => p._id !== id);
            saveLocalLinkedinPosts(linkedinState);
            showCyberToast('LINKEDIN POST DELETED LOCALLY!');
        }

        renderLinkedinFeed();
        renderAdminLinkedinList();
        if (lnPostId && lnPostId.value === id) resetLinkedinForm();
        setupSoundEvents();
    }

    window.handleEditLinkedinPost = function (id) {
        const post = linkedinState.find(p => p._id === id);
        if (!post) return;

        if (lnPostId) lnPostId.value = post._id;
        if (lnPostText) lnPostText.value = post.postText;
        if (lnPostLink) lnPostLink.value = post.postLink || '';
        if (lnPostImage) lnPostImage.value = post.postImage || '';
        if (lnLikesCount) lnLikesCount.value = post.likesCount || 0;
        if (lnCommentsCount) lnCommentsCount.value = post.commentsCount || 0;

        if (lnFormCardTitle) lnFormCardTitle.textContent = 'UPDATE TARGET LINKEDIN POST';
        if (btnSaveLnPost) {
            const btnText = btnSaveLnPost.querySelector('.btn-text');
            if (btnText) btnText.textContent = 'UPDATE POST';
        }

        if (linkedinForm) {
            linkedinForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    window.handleDeleteLinkedinPost = function (id) {
        deleteLinkedinPost(id);
    };

    // Initialize App Data Load
    loadProjects();
    loadLinkedinPosts();

});
