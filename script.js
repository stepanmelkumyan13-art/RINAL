// ==============================================
// script.js - Interactive Logic
// ==============================================

// --- Lock Screen Logic ---
const passcodeInput = document.getElementById('passcode-input');
const lockCard = document.getElementById('lock-card');
const errorText = document.getElementById('passcode-error');

// Allow pressing Enter to submit passcode
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
        // Success: Hide error and trigger confetti
        errorText.classList.remove('opacity-100');
        triggerConfetti();
        
        // Fade out Screen 1, Fade in Screen 2 & 3
        const screen1 = document.getElementById('screen-1');
        const main = document.getElementById('main-content');
        
        screen1.style.opacity = '0';
        setTimeout(() => {
            screen1.classList.add('hidden');
            main.classList.remove('hidden');
            // Slight delay before fading in to ensure smooth transition
            setTimeout(() => {
                main.style.opacity = '1';
            }, 50);
        }, 1000); // 1-second fade out
    } else {
        // Error: Show message and shake card
        errorText.classList.add('opacity-100');
        lockCard.classList.add('shake');
        
        // Remove shake class after animation completes so it can happen again
        setTimeout(() => {
            lockCard.classList.remove('shake');
        }, 500); 
    }
}

// --- Confetti Utility (Requires canvas-confetti CDN) ---
function triggerConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        // Left side confetti
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#dfb15b', '#f3e3b3', '#2d0a0e', '#e74c3c']
        });
        // Right side confetti
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#dfb15b', '#f3e3b3', '#2d0a0e', '#e74c3c']
        });

        // Keep animating until duration is up
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// --- Candle Blowout Logic ---
let candleBlown = false;

function blowOutCandle() {
    if(candleBlown) return;
    candleBlown = true;
    
    const flame = document.getElementById('flame');
    const btn = document.getElementById('blow-candle-btn');
    const msg = document.getElementById('wish-message');
    
    // Extinguish flame
    flame.style.display = 'none'; 
    
    // Update button styling and text
    btn.innerHTML = '✨ Wish Made ✨';
    btn.classList.add('bg-gold-500', 'text-vault-900');
    
    // Show success message
    msg.classList.remove('hidden');
    setTimeout(() => {
        msg.classList.add('opacity-100');
    }, 50);

    // Center small confetti burst for the cake
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#dfb15b', '#ffffff']
    });
}

// --- Evasive "NO" Button Logic ---
const noBtn = document.getElementById('no-btn');
const evasiveText = document.getElementById('evasive-text');
const funnyTexts = [
    "Nope, wrong button! 😜", 
    "You gotta see what's inside!", 
    "Try clicking YES instead 💅", 
    "Nice try!"
];

if (noBtn) {
    noBtn.addEventListener('mouseover', evade);
    noBtn.addEventListener('touchstart', evade); // Support for mobile tapping
}

function evade(e) {
    e.preventDefault();
    
    // Random translation bounded by the container
    const x = Math.random() * 200 - 100; // Random value between -100px and 100px
    const y = Math.random() * 100 - 50;  // Random value between -50px and 50px
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
    
    // Cycle random funny text at the bottom of the card
    const randomText = funnyTexts[Math.floor(Math.random() * funnyTexts.length)];
    evasiveText.textContent = randomText;
}

// --- Smooth Scrolling ---
function scrollToVault() {
    document.getElementById('vault-section').scrollIntoView({ behavior: 'smooth' });
}

// --- Modal Logic ---
function openModal(id) {
    const modal = document.getElementById(id);
    const content = modal.querySelector('div'); // The inner content wrapper
    
    modal.classList.remove('hidden');
    // Trigger reflow to ensure the transition runs
    void modal.offsetWidth;
    
    modal.classList.add('opacity-100');
    content.classList.remove('scale-95');
    content.classList.add('scale-100');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    const content = modal.querySelector('div');
    
    modal.classList.remove('opacity-100');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    
    // Wait for the transition to finish before hiding the element
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // This matches duration-300 in Tailwind
}
