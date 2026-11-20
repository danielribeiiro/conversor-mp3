
const formulario = document.getElementById("formulario-converter");
const mensagem = document.getElementById("mensagem");
const baixar = document.getElementById("baixar");
const botao = document.getElementById("botao");

const arquivoInput = document.getElementById("arquivo");
const nomeArquivo = document.getElementById("nome-arquivo");
const areaDisco = document.getElementById("area-disco");
const cartao = document.getElementById("cartao");
const rotulo = document.getElementById("rotulo");

let arquivoSelecionado = null;
let urlAnterior = null;

// ===================================
// ATUALIZAR ESTADO VISUAL
// ===================================

function mudarEstado(estado) {
    cartao.dataset.estado = estado;
}

// ===================================
// MOSTRAR MENSAGEM
// ===================================

function mostrarMensagem(texto, tipo = "normal") {
    mensagem.textContent = texto;

    const cores = {
        normal: "#94a3b8",
        sucesso: "#4ade80",
        erro: "#f87171"
    };

    mensagem.style.color = cores[tipo] || cores.normal;
}

// ===================================
// SELECIONAR ARQUIVO
// ===================================

function selecionarArquivo(arquivo) {

    if (!arquivo) return;

    const nome = arquivo.name.toLowerCase();

    if (!nome.endsWith(".mp4") ||
        (arquivo.type && arquivo.type !== "video/mp4")) {

        mostrarMensagem("Selecione um arquivo MP4 válido.", "erro");
        return;
    }

    arquivoSelecionado = arquivo;

    nomeArquivo.textContent = arquivo.name;
    rotulo.textContent = "MP4";

    mudarEstado("pronto");

    baixar.hidden = true;
    mostrarMensagem("Vídeo selecionado! Pronto para converter.");

    if (urlAnterior) {
        URL.revokeObjectURL(urlAnterior);
        urlAnterior = null;
    }
}

// ===================================
// INPUT DE ARQUIVO
// ===================================

arquivoInput.addEventListener("change", () => {
    selecionarArquivo(arquivoInput.files[0]);
});

// ===================================
// ARRASTAR E SOLTAR
// ===================================

["dragenter", "dragover"].forEach(evento => {

    areaDisco.addEventListener(evento, (e) => {
        e.preventDefault();
        areaDisco.classList.add("arrastando");
    });

});

["dragleave", "drop"].forEach(evento => {

    areaDisco.addEventListener(evento, (e) => {
        e.preventDefault();
        areaDisco.classList.remove("arrastando");
    });

});

areaDisco.addEventListener("drop", (e) => {

    const arquivo = e.dataTransfer.files[0];

    selecionarArquivo(arquivo);

});

// ===================================
// CONVERSÃO MP4 PARA MP3
// ===================================

formulario.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    if (!arquivoSelecionado) {
        mostrarMensagem("Escolha um vídeo MP4 primeiro.", "erro");
        return;
    }

    const dados = new FormData();

    dados.append("arquivo", arquivoSelecionado);

    botao.disabled = true;
    botao.textContent = "Convertendo...";

    baixar.hidden = true;

    mudarEstado("convertendo");

    mostrarMensagem("Convertendo seu vídeo em áudio...");

    try {

        const resposta = await fetch("http://localhost:8081/converter", {
            method: "POST",
            body: dados
        });

        if (!resposta.ok) {
            throw new Error("Falha na conversão.");
        }

        const blob = await resposta.blob();

        if (blob.size === 0) {
            throw new Error("O arquivo convertido está vazio.");
        }

        if (urlAnterior) {
            URL.revokeObjectURL(urlAnterior);
        }

        urlAnterior = URL.createObjectURL(blob);

        baixar.href = urlAnterior;

        baixar.download = arquivoSelecionado.name.replace(
            /\.mp4$/i,
            ".mp3"
        );

        baixar.hidden = false;

        mudarEstado("concluido");

        mostrarMensagem(
            "Conversão concluída! Seu MP3 está pronto.",
            "sucesso"
        );

    } catch (erro) {

        console.error(erro);

        mudarEstado("pronto");

        mostrarMensagem(
            "Não foi possível converter. Verifique se a API está funcionando.",
            "erro"
        );

    } finally {

        botao.disabled = false;
        botao.textContent = "Converter para MP3";

    }

});

// ===================================
// LIMPAR URL QUANDO SAIR DA PÁGINA
// ===================================

window.addEventListener("beforeunload", () => {

    if (urlAnterior) {
        URL.revokeObjectURL(urlAnterior);
    }

});