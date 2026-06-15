// abrir e fechar janela
function toggleWin(id) {
    const win = document.getElementById(id);

    if(win.classList.contains('open')) {
        win.classList.contains('open');
        return
    }

    win.classList.add('open');

    //reset da posiçao pro centro
    win.style.top = '50%';
    win.style.top = '50%';
    win.style.transform = 'translate(-50%, -50%';

    bringToFront(win);
}


// Fechar pelo botao 'X'
function closeWin(id) {
    document.getElementById(id).classList.remove('open');
}

let zCounter = 10;
function bringToFront(win) {
    win.style.zIndex = ++zCounter
}

