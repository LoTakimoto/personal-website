// ==========================
// OPEN & CLOSE SYSTEM
// ==========================
function toggleWin(id) {
    const win = document.getElementById(id);

    if (win.classList.contains('open')) {
        win.classList.remove('open');
        return;
    }

    win.classList.add('open');
    win.dataset.dragged = 'false';

    // MUSIC PLAYER OPENS FIXED ON THE RIGHT

    if (id === 'win-music') {
        bringToFront(win);
        win.style.top = '46%';
        win.style.left = 'auto';
        win.style.right = '20px';
        win.style.transform = 'translateY(-50%)';
        return;
    }

    // CASCADE LOGIC 
    let maxIndex = -1;
    document.querySelectorAll('main > section.open').forEach(w => {
        if (w !== win && w.dataset.dragged !== 'true') {
            const idx = parseInt(w.dataset.cascadeIndex ?? '-1');
            if (idx > maxIndex) maxIndex = idx;
        }
    });

    const newIndex = maxIndex + 1;
    win.dataset.cascadeIndex = newIndex;

    const offset = (newIndex % 6) * 35;
    win.style.top = `calc(37% + ${offset}px)`;
    win.style.left = `calc(48% + ${offset}px)`;
    win.style.transform = 'translate(-50%, -50%)';

    bringToFront(win);
}

// CLOSE WINDOW [x]
function closeWin(id) {
    document.getElementById(id).classList.remove('open');
}

// ==========================
// WINDOW Z-INDEX (BRING THE WINDOW TO THE FRONT)
// ==========================
let zCounter = 10;
function bringToFront(win) {
    win.style.zIndex = ++zCounter;
}

// ==========================
// WINDOW DRAG
// ==========================
document.querySelectorAll('main > section').forEach(win => {
    const header = win.querySelector('header');
    if (!header) return;

    header.addEventListener('mousedown', function (e) {
        bringToFront(win);

        const rect = win.getBoundingClientRect();
        win.style.transform = 'none';
        win.style.left = rect.left + 'px';
        win.style.top = rect.top + 'px';

        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;

        function onMouseMove(e) {
            win.dataset.dragged = 'true'; //marca como arrastada ao mover

            const maxY = window.innerHeight - win.offsetHeight;
            const maxX = window.innerWidth - win.offsetWidth;

            let newX = e.clientX - startX;
            let newY = e.clientY - startY;

            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            win.style.left = newX + 'px';
            win.style.top = newY + 'px';
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    win.addEventListener('mousedown', () => bringToFront(win));
});

// ==========================
// TASKBAR CLOCK
// ==========================
// ==========================
// TASKBAR CLOCK
// ==========================
function updateClock() {
    const tz = document.getElementById('timezone').value;
    const now = new Date();
    document.getElementById('clock-display').textContent =
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: tz });
}

document.getElementById('timezone').addEventListener('change', updateClock);

document.getElementById('tz-arrow').addEventListener('click', () => {   // <- fora do updateClock
    document.getElementById('timezone').click();
});

updateClock();
setInterval(updateClock, 1000);


// ==========================
// MUSIC PLAYER
// ==========================
const audio = document.getElementById('player-audio');
const btnPlay = document.getElementById('btn-play');
const seek = document.getElementById('player-seek');
const current = document.getElementById('player-current');
const duration = document.getElementById('player-duration');

function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
}

btnPlay.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        btnPlay.textContent = '⏸';
    } else {
        audio.pause();
        btnPlay.textContent = '▶';
    }
});

audio.addEventListener('timeupdate', () => {
    seek.value = audio.currentTime;
    seek.max = audio.duration || 0;
    current.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
    duration.textContent = formatTime(audio.duration);
    seek.max = audio.duration;
});

seek.addEventListener('input', () => {
    audio.currentTime = seek.value;
});

// ==========================
// MUSIC ICON ANIMATION
// ==========================

const musicBtn = document.getElementById('icon-music');
const musicImg = musicBtn.querySelector('img');
const musicFrames = [
    'assets/music2.png',
    'assets/music3.png',
    'assets/music4.png',
    'assets/music3.png'
];
const musicSpeeds = [330, 330, 310, 330];

let musicInterval = null;
let musicFrame = 0;

musicBtn.addEventListener('mouseenter', () => {
    musicFrame = 0;
    function nextFrame() {
        musicImg.src = musicFrames[musicFrame];
        const delay = musicSpeeds[musicFrame];
        musicFrame = (musicFrame + 1) % musicFrames.length;
        musicInterval = setTimeout(nextFrame, delay);
    }
    nextFrame();
});

musicBtn.addEventListener('mouseleave', () => {
    clearTimeout(musicInterval);
    musicImg.src = 'assets/music1.png'
});

// ==========================
// ICON CLICK ANIMATION
// ==========================
document.querySelectorAll('aside button').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.add('clicked');
        setTimeout(() => btn.classList.remove('clicked'), 250);
    });
});

// ==========================
// WELCOME SCREEN
// ==========================

const welcomeSound = new Audio('assets/welcome.mp3');
welcomeSound.volume = 0.6;

function enterSite() {
    setTimeout(() => {
        welcomeSound.currentTime = 0;
        welcomeSound.play();

        const screen = document.getElementById('welcome-screen');
        screen.style.transition = 'opacity 1s ease';
        screen.style.opacity = '0';
        setTimeout(() => screen.style.display = 'none', 1000);
    }, 450);
}

function updateWelcomeClock() {
    const now = new Date();
    document.getElementById('welcome-time').textContent =
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('welcome-date').textContent =
        now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}
updateWelcomeClock();
setInterval(updateWelcomeClock, 1000);

// ==========================
// SOUND EFFECTS — CLIQUE
// ==========================
const clickSound = new Audio('assets/click.mp3');
clickSound.volume = 0.3;

document.querySelectorAll('aside button').forEach(btn => {
    btn.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.volume = 0.3;
        clickSound.play();
    });
});

// ==========================
// SOUND EFFECTS — HOVER (todos os sons juntos, um só listener)
// ==========================
const hoverSound1 = new Audio('assets/hover1.mp3');
hoverSound1.volume = 0.25;

const hoverSound2 = new Audio('assets/hover2.mp3');
hoverSound2.volume = 0.15;

const hoverSound3 = new Audio('assets/paper.wav');
hoverSound3.volume = 0.05;

const hoverSound4 = new Audio('assets/#.mp3');
hoverSound4.volume = 0.03;

const hoverSound5 = new Audio('assets/bubble.mp3');
hoverSound5.volume = 0.035;

document.querySelectorAll('aside button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        hoverSound1.currentTime = 0;
        hoverSound1.play();

        if (btn.id === 'icon-about') {
            hoverSound2.currentTime = 0;
            hoverSound2.play();
        }

        if (btn.id === 'icon-projects') {
            hoverSound3.currentTime = 0;
            hoverSound3.play();
        }

        if (btn.id === 'icon-music') {
            hoverSound4.currentTime = 0;
            hoverSound4.play();
        }

        if (btn.id === 'icon-socials') {
            hoverSound5.currentTime = 0;
            hoverSound5.play();
        }
    });
});

document.querySelector('.btn-link').addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();
});

document.querySelector('.about-photo').addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();
})


const welcomeEnter = document.getElementById('welcome-enter');

welcomeEnter.addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();

    welcomeEnter.classList.add('clicked');
    setTimeout(() => welcomeEnter.classList.remove('clicked'), 400);
});


document.getElementById('timezone').addEventListener('change', () => {
    const sel = document.getElementById('timezone');
    document.getElementById('tz-label').textContent = sel.options[sel.selectedIndex].text;
    updateClock();
});