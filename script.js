const btnUpload = document.getElementById('uploads');
const realFile = document.getElementById('realFile');
const fileNameSpan = document.getElementById('fileName');
const divTamanho = document.getElementById('tamanho');

function paraoconversor() {
    document.getElementsByClassName('box')[0].style.scale = '0'
    setTimeout(() => {
    document.getElementsByClassName('box')[0].style.scale = '1'
    document.getElementById('conteudo1').style.display = 'none'
    document.getElementsByClassName('conteudo2')[0].style.display = 'block'
    }, 300)

}

// Ao clicar no seu botão estilizado, abre o Explorer
btnUpload.addEventListener('click', () => {
    realFile.click();
});

// Quando um arquivo for escolhido no Explorer
realFile.addEventListener('change', () => {
    const file = realFile.files[0];

    if (realFile.files[0] !== undefined) {
        if (!file.type.startsWith('image/')) {
            alert('Formato inválido! Por favor, selecione apenas arquivos de imagem.');
            realFile.value = ''; // Limpa o input
            return; // Para a execução aqui
        }

        if (file) {
            document.getElementById('button').style.display = 'block'
            fileNameSpan.textContent = file.name;
            divTamanho.style.display = 'block';
        } else {
            fileNameSpan.textContent = 'Nenhum arquivo escolhido';
            divTamanho.style.display = 'none';
            document.getElementById('button').style.display = 'none'
        }
    }
    // Verifica se o tipo do arquivo começa com "image/"

});

    btnUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
});

btnUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) {
    realFile.files = e.dataTransfer.files;
    realFile.dispatchEvent(new Event('change')); // Dispara o código acima automaticamente
    }
});

function converter() {
    const file = realFile.files[0];
    if (!file) return alert('Escolha uma imagem primeiro!');

    // Pega largura e altura digitadas (usa 256 se estiver vazio, e limita entre 16 e 256)
    const wInput = parseInt(document.getElementById('width').value);
    const hInput = parseInt(document.getElementById('height').value);

    const img = new Image();
    img.onload = () => {
    const largura = Number(document.getElementById('width').value) || img.width;

    const altura = Number(document.getElementById('height').value) || img.height;

    const canvas = document.createElement('canvas');
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, largura, altura);
    canvas.toBlob(blob => {
        blob.arrayBuffer().then(pngBuf => {
        const header = new ArrayBuffer(22);
        const view = new DataView(header);
        view.setUint16(0, 0, true);
        view.setUint16(2, 1, true);
        view.setUint16(4, 1, true);
        view.setUint8(6, largura === 256 ? 0 : largura);
        view.setUint8(7, altura === 256 ? 0 : altura);
        view.setUint8(8, 0);
        view.setUint8(9, 0);
        view.setUint16(10, 1, true);
        view.setUint16(12, 32, true);
        view.setUint32(14, pngBuf.byteLength, true);
        view.setUint32(18, 22, true);
        const icoBlob = new Blob([header, pngBuf], { type: 'image/x-icon' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(icoBlob);
            const nomeLimpo = file.name.replace(/\.[^/.]+$/, "");
        a.download = nomeLimpo + '.ico';

        a.click();
        });
    }, 'image/png');
    };
    img.src = URL.createObjectURL(file);
}
