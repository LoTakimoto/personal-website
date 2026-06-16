// abrir e fechar janela
function toggleWin(id) {
    const win = document.getElementById(id);

    if(win.classList.contains('open')) {
        win.classList.remove('open');
        return
    }

    win.classList.add('open');

    //reset da posiçao pro centro
    win.style.top = '50%';
    win.style.left = '50%';
    win.style.transform = 'translate(-50%, -50%)';

    bringToFront(win);
}


// Fechar pelo botao 'X'
function closeWin(id) {
    document.getElementById(id).classList.remove('open');
}


//traz janela pra frente ao clicar 
let zCounter = 10;
function bringToFront(win) {
    win.style.zIndex = ++zCounter
}

// drag pelo header

document.querySelectorAll('main > section').forEach(win => {
    const header = win.querySelector('header');

    header.addEventListener('mousedown', function (e) {
        bringToFront(win);

        // pega a posiçao real ANTES de mexer em qualquer coisa
        const rect = win.getBoundingClientRect();
        win.style.transform = 'none';
        win.style.left = rect.left + 'px';
        win.style.top = rect.top + 'px';

        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;

        function onMouseMove(e) {
            const maxX = window.innerWidth - win.offsetWidth;
            const maxY = window.innerHeight - win.offsetHeight;

            let newX = e.clientX - startX;
            let newY = e.clientY - startY;

            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            win.style.left = newX + 'px';
            win.style.top = newY + 'px';
        }

        function onMouseUp(){
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    win.addEventListener('mousedown', () => bringToFront(win));
});



//relogio

function updateClock(){
    const now = new Date();
    document.querySelector('#win-clock p').textContent =
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit'});
        
}
updateClock();
setInterval(updateClock, 1000);