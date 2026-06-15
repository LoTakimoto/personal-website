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


        // distancia do mouse ao canto da janela
        const startX = e.clientX - win.offsetLeft;
        const startY = e.clientY - win.offsetTop;

        // antes de arrastar, tira o transform do centro 
        // pocisiona c/ left/top fixo
        win.style.transform = 'none';
        win.style.left = win.offsetLeft + 'px';
        win.style.top = win.offsetTop + 'px';

        function onMouseMove(e) {
            win.style.left = (e.clientX - startX) + 'px';
            win.style.top = (e.clientY - startY) + 'px';
        }

        function onMouseUp(){
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    })

    // traz p frente ao clicar em qualquer parte da janela
    win.addEventListener('mousedown', () => bringToFront(win));
});

//relogio

function updateClock(){
    const now = new Date();
    document.querySelector('#win-clock p').textContent =
        now.toLoca
leTimeString('pt-BR', { hour: '2-digit', minute: '2-digit'});
        
}
updateClock();
setInterval(updateClock, 1000);