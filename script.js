// ==============================================
// Navigation / Page Transitions
// ==============================================
function goToPage(url) {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => { window.location.href = url; }, 500);
}

// 🌸 The "Two Panes/Flower Wipe" Transition Logic
function triggerFlowerTransition(url) {
    // 1. Create the overlay screen
    const wipe = document.createElement('div');
    wipe.className = 'flower-wipe';
    
    // 2. Fill it with tulips
    for(let i=0; i<60; i++) {
        const tulip = document.createElement('span');
        tulip.className = 'flower-wipe-tulip';
        tulip.innerText = '🌷';
        tulip.style.animationDelay = (Math.random() * 1) + 's';
        wipe.appendChild(tulip);
    }
    
    document.body.appendChild(wipe);

    // 3. Slide it down to cover the screen
    setTimeout(() => {
        wipe.classList.add('active');
    }, 10); // small delay to ensure CSS transition triggers

    // 4. Once screen is covered (0.8s), change the page URL
    setTimeout(() => {
        window.location.href = url;
    }, 850); 
}

// If the page loads and has an entrance wipe (like note.html), slide it away!
document.addEventListener("DOMContentLoaded", () => {
    const entranceWipe = document.getElementById('entrance-flower-wipe');
    if (entranceWipe) {
        // Fill it with tulips first so it matches the previous page
        for(let i=0; i<60; i++) {
            const tulip = document.createElement('span');
            tulip.className = 'flower-wipe-tulip';
            tulip.innerText = '🌷';
            entranceWipe.appendChild(tulip);
        }
        
        // Wait a brief moment, then slide the curtain down to reveal the Note
        setTimeout(() => {
            entranceWipe.classList.replace('active', 'exit');
        }, 300);

        // Remove from DOM after it finishes sliding
        setTimeout(() => {
            entranceWipe.remove();
        }, 1200);
    }
});


// ==============================================
// Page 1: Passcode Logic
// ==============================================
const passcodeInput = document.getElementById('passcode-input');
if (passcodeInput) {
    passcodeInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPasscode(); });
}
function clearPasscode() {
    if(passcodeInput) passcodeInput.value = '';
    const err = document.getElementById('passcode-error');
    if(err) err.classList.remove('opacity-100');
}
function checkPasscode() {
    const val = passcodeInput.value.trim().toLowerCase();
    if (val === 'shhh') {
        if(typeof confetti !== 'undefined') confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#dfb15b'] });
        goToPage('dashboard.html');
    } else {
        document.getElementById('passcode-error').classList.add('opacity-100');
        document.getElementById('lock-card').classList.add('shake');
        setTimeout(() => { document.getElementById('lock-card').classList.remove('shake'); }, 500); 
    }
}

// ==============================================
// Page 2: Dashboard Game Logic
// ==============================================
let candleBlown = false;
function blowOutCandle() {
    if(candleBlown) return;
    candleBlown = true;
    document.getElementById('flame').style.display = 'none'; 
    const btn = document.getElementById('blow-candle-btn');
    btn.innerHTML = '✨ Wish Made ✨';
    if(typeof confetti !== 'undefined') confetti({ particleCount: 100, origin: { y: 0.6 } });
}

const noBtn = document.getElementById('no-btn');
if (noBtn) {
    const evade = (e) => {
        e.preventDefault();
        noBtn.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 100 - 50}px)`;
        document.getElementById('evasive-text').textContent = ["Nope! 😜", "Click YES 💅", "Nice try!"][Math.floor(Math.random()*3)];
    };
    noBtn.addEventListener('mouseover', evade);
    noBtn.addEventListener('touchstart', evade); 
}
