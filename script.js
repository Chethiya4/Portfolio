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

    const STORAGE_KEY = 'chethiya_projects_db';

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

    let projectsState = [];

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
                    "Hello! I am Chethiya's AI assistant powered by GPT-4. How can I help you explore this portfolio today?",
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

    // Initialize App Data Load
    loadProjects();

});
