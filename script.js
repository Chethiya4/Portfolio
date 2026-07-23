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
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card-elegant, .admin-project-item-cyber');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                playHoverSound();
            });
            el.addEventListener('click', () => {
                playClickSound();
            });
        });
    }
    setupSoundEvents();


    // ----------------------------------------------------
    // 2. THREE.JS PROCEDURAL 3D HUMANOID ROBOT MODEL (ORIGINAL EXACT SPEC)
    // ----------------------------------------------------
    const container = document.getElementById('canvas-3d-container');
    if (container && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        
        // Perspective Camera
        const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 0.3, 7.5);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Lighting System
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        // Key light (Cyan)
        const keyLight = new THREE.DirectionalLight(0x00e5ff, 1.2);
        keyLight.position.set(5, 5, 5);
        scene.add(keyLight);

        // Rim light (Magenta)
        const rimLight = new THREE.DirectionalLight(0xff0066, 0.6);
        rimLight.position.set(-5, 3, 5);
        scene.add(rimLight);

        // 3D Robot Base Group
        const robotGroup = new THREE.Group();
        scene.add(robotGroup);

        // Materials setup
        const metalMaterial = new THREE.MeshStandardMaterial({
            color: 0x1f293d,
            roughness: 0.18,
            metalness: 0.85,
            flatShading: true
        });

        const jointMaterial = new THREE.MeshStandardMaterial({
            color: 0x334155,
            roughness: 0.4,
            metalness: 0.5
        });

        const glowingVisorMat = new THREE.MeshBasicMaterial({
            color: 0x00e5ff
        });

        const glowingCoreMat = new THREE.MeshBasicMaterial({
            color: 0x00e5ff
        });

        // ==========================================
        // ROBOT PARTS CONSTRUCTION
        // ==========================================
        
        // 1. Torso Segment
        const torsoGeom = new THREE.BoxGeometry(1.8, 1.8, 1.0);
        const torso = new THREE.Mesh(torsoGeom, metalMaterial);
        torso.position.y = -0.7;
        robotGroup.add(torso);

        // Glowing Torso Power Core (Reactor Ring)
        const coreTorusGeom = new THREE.TorusGeometry(0.25, 0.05, 8, 32);
        const torsoCore = new THREE.Mesh(coreTorusGeom, glowingCoreMat);
        torsoCore.position.set(0, 0.1, 0.51); // slightly in front
        torso.add(torsoCore);

        // 2. Neck Swivel
        const neckGeom = new THREE.CylinderGeometry(0.2, 0.25, 0.4, 16);
        const neck = new THREE.Mesh(neckGeom, jointMaterial);
        neck.position.set(0, 0.35, 0);
        robotGroup.add(neck);

        // 3. Head Group (Allows independent tracking rotation)
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 0.75, 0);
        robotGroup.add(headGroup);

        // Robot Head Main Mesh
        const headGeom = new THREE.BoxGeometry(1.2, 0.9, 0.95);
        const headMesh = new THREE.Mesh(headGeom, metalMaterial);
        headMesh.position.y = 0.45; // Offset to pivot from base of head
        headGroup.add(headMesh);

        // Glowing Visor/Eyes
        const visorGeom = new THREE.BoxGeometry(0.9, 0.15, 0.1);
        const visorMesh = new THREE.Mesh(visorGeom, glowingVisorMat);
        visorMesh.position.set(0, 0.45, 0.485);
        headGroup.add(visorMesh);

        // Side Antennae / Ear Bolts
        const earGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 8);
        earGeom.rotateZ(Math.PI / 2);
        
        const leftEar = new THREE.Mesh(earGeom, jointMaterial);
        leftEar.position.set(-0.65, 0.45, 0);
        headGroup.add(leftEar);

        const rightEar = new THREE.Mesh(earGeom, jointMaterial);
        rightEar.position.set(0.65, 0.45, 0);
        headGroup.add(rightEar);

        // Top Antenna rod
        const antRodGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
        const antSphereGeom = new THREE.SphereGeometry(0.05, 8, 8);
        
        const antRod = new THREE.Mesh(antRodGeom, jointMaterial);
        antRod.position.set(0, 1.05, 0);
        
        const antSphere = new THREE.Mesh(antSphereGeom, glowingCoreMat);
        antSphere.position.set(0, 1.2, 0);
        
        headGroup.add(antRod);
        headGroup.add(antSphere);

        // 4. Arms & Shoulder Joints
        const shoulderGeom = new THREE.SphereGeometry(0.2, 16, 16);
        const armGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.1, 12);

        // Left Arm Group
        const leftArmGroup = new THREE.Group();
        leftArmGroup.position.set(-1.05, 0.1, 0);
        const leftShoulder = new THREE.Mesh(shoulderGeom, jointMaterial);
        const leftArm = new THREE.Mesh(armGeom, metalMaterial);
        leftArm.position.y = -0.65;
        leftArmGroup.add(leftShoulder);
        leftArmGroup.add(leftArm);
        torso.add(leftArmGroup);

        // Right Arm Group
        const rightArmGroup = new THREE.Group();
        rightArmGroup.position.set(1.05, 0.1, 0);
        const rightShoulder = new THREE.Mesh(shoulderGeom, jointMaterial);
        const rightArm = new THREE.Mesh(armGeom, metalMaterial);
        rightArm.position.y = -0.65;
        rightArmGroup.add(rightShoulder);
        rightArmGroup.add(rightArm);
        torso.add(rightArmGroup);

        // Adjust position of whole robot group
        robotGroup.position.y = 0.3;

        // Mouse NDC sensitivity tracking
        let mouseNDC = { x: 0, y: 0 };
        let targetHeadRotX = 0;
        let targetHeadRotY = 0;

        window.addEventListener('mousemove', (e) => {
            // Get bounding coordinates of canvas viewport
            const rect = container.getBoundingClientRect();
            // Normalized Device Coordinates relative to 3D container center
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);

            mouseNDC.x = x / (window.innerWidth / 2);
            mouseNDC.y = -y / (window.innerHeight / 2);

            // Set head limits
            targetHeadRotY = mouseNDC.x * 0.7; // Left/Right swivel
            targetHeadRotX = -mouseNDC.y * 0.4; // Up/Down tilt
        });

        // 3D Render Loop
        function animate3D() {
            requestAnimationFrame(animate3D);

            // 1. Idle Floating Breathing motion
            const time = Date.now() * 0.0016;
            robotGroup.position.y = 0.2 + Math.sin(time) * 0.12;

            // Idle arm swinging
            leftArmGroup.rotation.z = Math.sin(time) * 0.05 - 0.05;
            leftArmGroup.rotation.x = Math.cos(time) * 0.04;
            
            rightArmGroup.rotation.z = -Math.sin(time) * 0.05 + 0.05;
            rightArmGroup.rotation.x = -Math.cos(time) * 0.04;

            // 2. Smooth Neck/Head tracking coordinates
            headGroup.rotation.y += (targetHeadRotY - headGroup.rotation.y) * 0.08;
            headGroup.rotation.x += (targetHeadRotX - headGroup.rotation.x) * 0.08;

            // Torso rotates slightly to assist head look vector
            torso.rotation.y += (targetHeadRotY * 0.25 - torso.rotation.y) * 0.05;
            torso.rotation.x += (targetHeadRotX * 0.2 - torso.rotation.x) * 0.05;

            renderer.render(scene, camera);
        }
        animate3D();

        // Canvas container resize listener
        window.addEventListener('resize', () => {
            if (container) {
                const width = container.clientWidth;
                const height = container.clientHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        });
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

        // Re-attach card spotlight hover effects
        const projectCards = document.querySelectorAll('.project-card-elegant');
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
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

    // Initialize App Data Load
    loadProjects();

});
