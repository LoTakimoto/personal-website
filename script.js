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


    // ABOUT ME CENTERED
    if (id === 'win-about') {
        bringToFront(win);
        win.style.top = '44%';
        win.style.left = '50%';
        win.style.right = '50%';
        win.style.transform = 'translate(-50%, -50%)';
        return;
    }

    // files open on diagonal :)

    if (id.startsWith('win-file-')) {
        const aboutWin = document.getElementById('win-about');
        const aboutRect = aboutWin.getBoundingClientRect();

        let maxIndex = -1;
        document.querySelectorAll('[id^="win-file-"].open').forEach(w => {
            if (w !== win && w.dataset.dragged !== 'true') {
                const idx = parseInt(w.dataset.cascadeIndex ?? '-1');
                if (idx > maxIndex) maxIndex = idx;
            }
        });

        const newIndex = maxIndex + 1;
        win.dataset.cascadeIndex = newIndex;

        const offset = (newIndex % 6) * 30;

        win.style.top = (aboutRect.top + aboutRect.height * 0.13 + offset) + 'px';
        win.style.left = (aboutRect.left + aboutRect.width * 0.47 + offset) + 'px';
        win.style.transform = 'none';

        bringToFront(win);
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
// WINDOW Z-INDEX 
// ==========================
let zCounter = 10;
function bringToFront(win) {
    win.style.zIndex = ++zCounter;
}

// ==========================
// WINDOW DRAG
// ==========================
function makeDraggable(win) {
    const dragArea = win.querySelector('#socials-drag-area') || win.querySelector('header');
    if (!dragArea) return;

    dragArea.addEventListener('mousedown', function (e) {
        bringToFront(win);

        const rect = win.getBoundingClientRect();
        win.style.transform = 'none';
        win.style.left = rect.left + 'px';
        win.style.top = rect.top + 'px';

        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;

        function onMouseMove(e) {
            win.dataset.dragged = 'true';

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
}


// aplica o drag em todas as janelas que ja existem no HTML
document.querySelectorAll('main > section').forEach(makeDraggable); 







// ==========================
// TASKBAR 
// ==========================

//settings 

document.getElementById('settings-btn').addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();

    const btn = document.getElementById('settings-btn');
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 200);
});




//taskbar-clock

const tzPositions = {
    'America/Sao_Paulo': '72px',
    'America/Toronto':   '80px',
    'Europe/London':     '80px',
    'Asia/Tokyo':        '88px'
}; 

document.getElementById('tz-selector').style.right = tzPositions['America/Sao_Paulo'];

let currentTz = 'America/Sao_Paulo';

function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: currentTz });
    document.getElementById('clock-display').textContent = time;
}

// open/close dropdown
document.getElementById('tz-arrow-wrap').addEventListener('click', () => {
    const arrow = document.getElementById('tz-arrow');
    arrow.classList.add('clicked');
    setTimeout(() => arrow.classList.remove('clicked'), 300);

    clickSound.currentTime = 0;
    clickSound.play();

    document.getElementById('tz-dropdown').classList.toggle('open');
});

// timezone select
document.querySelectorAll('#tz-dropdown li').forEach(li => {
    li.addEventListener('click', () => {
        currentTz = li.dataset.tz;

        document.getElementById('tz-label').textContent = li.textContent;
        document.getElementById('tz-selector').style.right = tzPositions[currentTz] || '77px';

        document.querySelectorAll('#tz-dropdown li').forEach(i => i.classList.remove('active'));
        li.classList.add('active');

        document.getElementById('tz-dropdown').classList.remove('open');
        updateClock();
    });
});

// close when clicked outside
document.addEventListener('click', (e) => {
    if (!document.getElementById('tz-selector').contains(e.target)) {
        document.getElementById('tz-dropdown').classList.remove('open');
    }
});

updateClock();
setInterval(updateClock, 1000);


// home button

document.getElementById('home-btn').addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();

    const screen = document.getElementById('welcome-screen');
    screen.style.display = 'flex';
    screen.style.opacity = '0';
    screen.style.transition = 'opacity 0.8s ease';
    setTimeout(() => screen.style.opacity = '1', 10);
});

document.querySelectorAll('main > section.open').forEach(w => {
    w.classList.remove('open');
});



// ==========================
// MUSIC PLAYER
// ==========================
const audio = document.getElementById('player-audio');
audio.volume = 0.5;
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
welcomeSound.volume = 1;

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

    const time = now.toLocaleTimeString('en-US', { hour:'numeric', minute: '2-digit', hour12: true});
    const [hourMinute, period] = time.split(' ');

    document.getElementById('welcome-time').textContent = hourMinute;
    document.getElementById('welcome-period').textContent = period;

    document.getElementById('welcome-date').textContent =
        now.toLocaleDateString('en-US', {weekday: 'long', day: 'numeric', month: 'long'});
}
updateWelcomeClock();
setInterval(updateWelcomeClock, 1000);

// ==========================
// SOUND EFFECTS 
// ==========================
const clickSound = new Audio('assets/click2.mp3');
clickSound.volume = 0.3;

document.querySelectorAll('aside button').forEach(btn => {
    btn.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.volume = 0.67;
        clickSound.play();
    });
});


// ==========================
// SOUND EFFECTS — HOVER
// ==========================
const hoverSound1 = new Audio('assets/hover1.mp3');
hoverSound1.volume = 0.6;

const hoverSound2 = new Audio('assets/hover2.mp3');
hoverSound2.volume = 0.5;

const hoverSound3 = new Audio('assets/paper.wav');
hoverSound3.volume = 0.4;

const hoverSound4 = new Audio('assets/musicplayer.mp3');
hoverSound4.volume = 0.4;

const hoverSound5 = new Audio('assets/bubble.mp3');
hoverSound5.volume = 0.1;

let hoverTimeout = null;

document.querySelectorAll('aside button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        hoverTimeout = setTimeout(() => {
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
                setTimeout(() => {
                    hoverSound4.currentTime = 0;
                    hoverSound4.play();
                }, 250);
            }

            if (btn.id === 'icon-socials') {
                setTimeout(() => {
                    hoverSound5.currentTime = 0;
                    hoverSound5.play();
                }, 250);
            }
        }, 120);
    });

    btn.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
    });
});


const welcomeEnter = document.getElementById('welcome-enter');

welcomeEnter.addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();

    welcomeEnter.classList.add('clicked');
    setTimeout(() => welcomeEnter.classList.remove('clicked'), 400);
});

// MUTE BUTTON

let isMuted = false;

const hoverSocials = new Audio('assets/socialshover.mp3');
hoverSocials.volume = 0.1;

const allSounds = [ 
    clickSound, hoverSound1, hoverSound2, hoverSound3, hoverSound4, hoverSound5, welcomeSound, hoverSocials
];

document.getElementById('sound-btn').addEventListener('click', () => {
    isMuted = !isMuted;

    allSounds.forEach(s => s.muted = isMuted);
    audio.muted = isMuted; 

    document.getElementById('sound-btn').src = isMuted
        ? 'assets/soundoff.png'
        : 'assets/soundon.png';

        const btn = document.getElementById('sound-btn');
        btn.classList.add('clicked');
        setTimeout(() => btn.classList.remove('clicked'), 300);
});

document.querySelectorAll('#social-github, #social-instagram, #social-discord').forEach(link => {
    link.addEventListener('mouseenter', () => {
        hoverSocials.currentTime = 0.01;
        hoverSocials.play();
        
    });

    link.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play();
    });
});


const aboutData = {
    'about-me': {
        type: 'folder',
        files: {
            'loren': {
                type: 'text',
                title: 'loren.txt', 
                content: `❔ Hi, I'm <span class="highlight">Lorena</span> - but call me <span class="highlight">Loren</span>! I'm a 16 year old high school student from <span class="highlight">São Paulo</span>, <span class="highlight">Brazil</span>, and I am japanese-brazilian :)
                
                I love expressing myself through <span class="highlight">music</span>, <span class="highlight">photography</span> and <span class="highlight">cinematography</span>, while my curiosity constantly draws me toward <span class="highlight">STEM</span> - especially <span class="highlight">astronomy</span> and <span class="highlight">computer science</span>‼️ 
                
                🌟 If you'd like to know more about me, feel free to explore the pages on the left!`
            }
        }
    },
    'skills': {
        type: 'folder',
        files: {
            'programming': {
                type: 'text',
                title: 'programming.txt',
                content: `💫 My <span class="highlight">strongest</span> programming language is <span class="highlight">C++</span> 
                Which I mainly use for <span class="highligh">competitive programming</span> and algorithmic <span class="highlight">problem solving</span>, especially while participating in the <span class="highlight">Brazilian Olympiad in Informatics</span> (OBI).
                
                > I use <span class="highlight">Python</span> for general purpose projects and scripting
                
                and I'm also diving deeper into <span class="highlight">HTML/CSS/JavaScript</span> to build my first <span class="highlight">personal website</span>! 💻`
            },
            'olympiads': { 
                type: 'text',
                title: 'olympiads.txt',
                content: `- I've always loved<span class="highlight"> learning</span> and <span class="highlight">challenging</span> myself...

                Over the years, that passion has <span class="highlight">led me</span> to earn more than a dozen <span class="highlight">national medals</span> in academic <span class="highlight">Olympiads</span>, including astronomy, robotics and mathematics!

                These experiences have played an important <span class="highlight">role</span> in shaping <span class="highlight">who I am</span> 

                🥇 While my <span class="highlight">interests</span> now extend <span class="highlight">beyond</span> olympiads, they remain one of my <span class="highlight">proudest achievements</span> :)`
            },
            'art': {
                type: 'text',
                title: 'art.txt',
                content: `test test test`
            }
        }
    },
    'gallery': {
        type: 'folder',
        files: {
            // pngs
        }
    }
};



const aboutDisplay = document.querySelector('.about-display');

// ===============
// about me - folder expand
// ===============

document.querySelectorAll('.about-folder').forEach(folder => {
    folder.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play();
        const filesList = folder.querySelector('.about-files');
        const folderKey = folder.dataset.folder;

        // fecha as outras pastas abertas antes de abrir essa
        document.querySelectorAll('.about-files').forEach(list => {
            if (list !== filesList) {
                list.style.display = 'none';
            }
        });

        // alterna a pasta clicada (abre se tava fechada, fecha se estava aberta)
        const isOpen = filesList.style.display === 'flex';
        filesList.style.display = isOpen ? 'none' : 'flex';

        // abriu -> mostra os arquivos no display
        if (!isOpen) {
            renderFolderInDisplay(folderKey);
        } else {
            aboutDisplay.innerHTML = '';
        }
    });
});

function renderFolderInDisplay(folderKey) {
    const folder = aboutData[folderKey];
    aboutDisplay.innerHTML = '';

    Object.keys(folder.files).forEach(fileKey => {
        const file = folder.files[fileKey];

        const item = document.createElement('div');
        item.classList.add('display-file');
        item.dataset.file = fileKey;
        item.innerHTML = `
            <span class="file-icon">📄</span>
            <span class="file-name">${file.title}</span>
        `;

        aboutDisplay.appendChild(item);
    });
}

// abrir arquivo no FILE VIEWER

function openAboutFile(folderKey, fileKey) {
    const file = aboutData[folderKey].files[fileKey];
    if (!file) return;

    const winId = `win-file-${folderKey}-${fileKey}`;
    let win = document.getElementById(winId);

    if (!win) {
        const template = document.getElementById('win-file-viewer');
        win = template.cloneNode(true);
        win.id = winId;

        // title
        const title = win.querySelector('h2');
        title.removeAttribute('id');
        title.textContent = file.title;

        // close button
        const closeBtn = win.querySelector('.btn-close');
        closeBtn.setAttribute('onclick', `closeWin('${winId}')`);

        //content
        const content = win.querySelector('article');
        content.removeAttribute('id');
        content.innerHTML = '';

        if (file.type === 'text') {
            const p = document.createElement('p');
            p.innerHTML = file.content;
            content.appendChild(p);
        }

        if (file.type === 'image') {
            const img = document.createElement('img');
            img.src = file.src;
            content.appendChild(img);
        }

        document.querySelector('main').appendChild(win);
        makeDraggable(win);
    }

    toggleWin(winId);

}

// clique nos arquivos da SIDEBAR (esquerda)

document.querySelectorAll('.about-file').forEach(fileEl => {
    fileEl.addEventListener('click', (e) => {
        e.stopPropagation(); // !!!! impede o clique de "borbulhar" pra pasta 

        clickSound.currentTime = 0;
        clickSound.play();

        const folderKey = fileEl.closest('.about-folder').dataset.folder;
        const fileKey = fileEl.dataset.file;


        openAboutFile(folderKey, fileKey);
    });
});

// clique nos arquivos do DISPLAY (lado direito)
aboutDisplay.addEventListener('click', (e) => {
    const fileEl = e.target.closest('.display-file');
    if (!fileEl) return;

    const folderKey = document.querySelector('.about-files[style*="flex"]')
        .closest('.about-folder').dataset.folder;
    const fileKey = fileEl.dataset.file;

    document.body.classList.add('loading-file');

    setTimeout(() => {
        document.body.classList.remove('loading-file');
        openAboutFile(folderKey, fileKey);
    }, 250);
});

