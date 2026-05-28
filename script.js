/**
 * CYBERNETIC DECK CONTROL ENGINE
 * Version: v3.12 Elegant 3D Humanoid Robot
 */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // 1. INTERACTIVE SOUND EVENTS (Tactile UI Feedback)
    // ----------------------------------------------------
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card-elegant');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            playHoverSound();
        });
        el.addEventListener('click', () => {
            playClickSound();
        });
    });

    // ----------------------------------------------------
    // 2. THREE.JS PROCEDURAL 3D HUMANOID ROBOT MODEL
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
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });
    }

    // ----------------------------------------------------
    // 3. PROJECT CARD SPOTLIGHT GLOW EFFECT
    // ----------------------------------------------------
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

    // ----------------------------------------------------
    // 4. WEB AUDIO FEEDBACK TONES
    // ----------------------------------------------------
    let audioCtx = null;
    let soundEnabled = false;
    const soundToggle = document.getElementById('sound-toggle');
    const soundIconOn = soundToggle.querySelector('.sound-icon.on');
    const soundIconOff = soundToggle.querySelector('.sound-icon.off');

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    soundToggle.addEventListener('click', () => {
        initAudio();
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            soundIconOn.classList.remove('hidden');
            soundIconOff.classList.add('hidden');
            playClickSound();
        } else {
            soundIconOn.classList.add('hidden');
            soundIconOff.classList.remove('hidden');
        }
    });

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
    // 5. COMMS DATA PACKET TRANSMISSION ANIMATION
    // ----------------------------------------------------
    const commsForm = document.getElementById('comms-form');
    const transmitStatus = document.getElementById('transmit-status');
    const statusOutput = document.getElementById('status-output');
    const btnCloseStatus = document.getElementById('btn-close-status');

    commsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show status panel
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
                
                // Keyboard sound clicks
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

    btnCloseStatus.addEventListener('click', () => {
        transmitStatus.classList.add('hidden');
        commsForm.reset();
    });
});
