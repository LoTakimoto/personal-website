// abrir e fechar janela
function toggleWin(id) {
    const win = document.getElementById(id);

    if (win.classList.contains('open')) {
        win.classList.remove('open');
        return;
    }

    win.classList.add('open');
    win.dataset.dragged = 'false';

    if (id === 'win-music') {
        bringToFront(win);
        win.style.top = '46%';
        win.style.left = 'auto';
        win.style.right = '20px';
        win.style.transform = 'translateY(-50%)';
        return;
    }
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

// Fechar pelo botao 'X'
function closeWin(id) {
    document.getElementById(id).classList.remove('open');
}

// traz janela pra frente ao clicar
let zCounter = 10;
function bringToFront(win) {
    win.style.zIndex = ++zCounter;
}

// drag pelo header
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

// relogio
function updateClock() {
    const tz = document.getElementById('timezone').value;
    const now = new Date();
    document.querySelector('#win-clock p').textContent =
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: tz});
}

document.getElementById('timezone').addEventListener('change', updateClock);

updateClock();
setInterval(updateClock, 1000);


//player
const audio = document.getElementById('player-audio');
const btnPlay = document.getElementById('btn-play');
const seek = document.getElementById('player-seek');
const current = document.getElementById('player-current');
const duration = document.getElementById('player-duration');

function formatTime(s) {
    const m = Math.floor( s / 60 );
    const sec = Math.floor( s % 60 ).toString().padStart(2, '0');
    return `${m}:${sec}`;
}

btnPlay.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        btnPlay.textContent = '⏸';
    } else{
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

//

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