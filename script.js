// ==============================================
// script.js - Interactive Logic & Routing
// ==============================================

// --- PAGE 1: Lock Screen Logic ---
const passcodeInput = document.getElementById('passcode-input');
const lockCard = document.getElementById('lock-card');
const errorText = document.getElementById('passcode-error');

if (passcodeInput) {
    passcodeInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') checkPasscode();
    });
}

function clearPasscode() {
    passcodeInput.value = '';
    errorText.classList.remove('opacity-100');
}

function checkPasscode() {
    const val = passcodeInput.value.trim().toLowerCase();
    if (val === 'shhh') {
        errorText.classList.remove('opacity-100');
        
        // Confetti burst on success
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#dfb15b', '#f3e3b3'] });
        }
        
        // Fade out and Redirect to Dashboard Page
        const screen1 = document.getElementById('screen-1');
        screen1.style.opacity = '0';
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1200); 
    } else {
        errorText.classList.add('opacity-100');
        lockCard.classList.add('shake');
        setTimeout(() => { lockCard.classList.remove('shake'); }, 500); 
    }
}

// --- PAGE 2: Dashboard Logic ---
let candleBlown = false;
function blowOutCandle() {
    if(candleBlown) return;
    candleBlown = true;
    
    const flame = document.getElementById('flame');
    const btn = document.getElementById('blow-candle-btn');
    const msg = document.getElementById('wish-message');
    
    flame.style.display = 'none'; 
    btn.innerHTML = '✨ Wish Made ✨';
    btn.classList.add('bg-[#dfb15b]', 'text-[#1a0507]');
    
    msg.classList.remove('hidden');
    setTimeout(() => { msg.classList.add('opacity-100'); }, 50);

    if (typeof confetti !== 'undefined') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#dfb15b', '#ffffff'] });
    }
}

const noBtn = document.getElementById('no-btn');
const evasiveText = document.getElementById('evasive-text');
const funnyTexts = ["Nope, wrong button! 😜", "You gotta see what's inside!", "Try clicking YES instead 💅", "Nice try!"];

if (noBtn) {
    noBtn.addEventListener('mouseover', evade);
    noBtn.addEventListener('touchstart', evade); 
}

function evade(e) {
    e.preventDefault();
    const x = Math.random() * 200 - 100; 
    const y = Math.random() * 100 - 50;  
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
    evasiveText.textContent = funnyTexts[Math.floor(Math.random() * funnyTexts.length)];
}

function goToVault() {
    // Redirect to Vault Page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        window.location.href = 'vault.html';
    }, 500);
}

// --- PAGE 3: Vault & Tulips Logic ---

// Triggers the falling tulips, THEN opens the note
function triggerTulipsAndNote() {
    // 1. Create the container for tulips
    const container = document.createElement('div');
    container.className = 'tulip-container';
    document.body.appendChild(container);

    // 2. Generate 40 tulips with random start positions and speeds
    for (let i = 0; i < 40; i++) {
        const tulip = document.createElement('div');
        tulip.className = 'falling-tulip';
        tulip.innerText = '🌷';
        
        // Random horizontal start position
        tulip.style.left = (Math.random() * 100) + 'vw';
        
        // Randomize speed (between 2s and 4.5s)
        tulip.style.animationDuration = (Math.random() * 2.5 + 2) + 's'; 
        
        // Stagger the drops (between 0s and 1.5s delay)
        tulip.style.animationDelay = (Math.random() * 1.5) + 's';
        
        container.appendChild(tulip);
    }

    // 3. Open the Note Modal exactly 2 seconds into the tulip animation
    setTimeout(() => {
        openModal('note-modal');
    }, 2000);

    // 4. Clean up the tulip container from the DOM after animation finishes
    setTimeout(() => {
        container.remove();
    }, 6000);
}

function openModal(id) {
    const modal = document.getElementById(id);
    if(!modal) return;
    const content = modal.querySelector('div'); 
    
    modal.classList.remove('hidden');
    void modal.offsetWidth; // Reflow
    
    modal.classList.add('opacity-100');
    content.classList.remove('scale-95');
    content.classList.add('scale-100');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if(!modal) return;
    const content = modal.querySelector('div');
    
    modal.classList.remove('opacity-100');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 500); 
}
