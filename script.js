const STORAGE_KEY = 'falange_dados';

function getDados() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
}

function salvarDados(dados) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function renderCorredores() {
    const container = document.getElementById('corredoresGrupos');
    if (!container) return;

    const dados = getDados();
    let html = '';

    for (let inicio = 1; inicio <= 60; inicio += 10) {
        const fim = Math.min(inicio + 9, 60);
        html += '<div class="grupo"><h3>Corredores ' + inicio + ' a ' + fim + '</h3><div class="botoes-corredor">';

        for (let i = inicio; i <= fim; i++) {
            const temItens = dados[i] && dados[i].length > 0;
            const classe = temItens ? 'has-items' : '';
            html += '<a href="corredor.html?id=' + i + '" class="' + classe + '">' + i + '</a>';
        }

        html += '</div></div>';
    }

    container.innerHTML = html;
}

function setupSearch() {
    const input = document.getElementById('searchInput');
    const btn = document.getElementById('searchBtn');
    const resultsBox = document.getElementById('searchResults');
    const corredoresSection = document.getElementById('corredoresSection');

    if (!input || !btn) return;

    function executarBusca() {
        const termo = input.value.trim().toLowerCase();
        if (!termo) {
            resultsBox.classList.add('hidden');
            corredoresSection.classList.remove('hidden');
            return;
        }

        if (/^\d+$/.test(termo)) {
            const num = parseInt(termo, 10);
            if (num >= 1 && num <= 60) {
                window.location.href = 'corredor.html?id=' + num;
                return;
            }
        }

        const dados = getDados();
        const resultados = [];

        for (const corredor in dados) {
            dados[corredor].forEach(function(item) {
                if (item.nome.toLowerCase().includes(termo)) {
                    resultados.push({
                        corredor: corredor,
                        nome: item.nome,
                        quantidade: item.quantidade
                    });
                }
            });
        }

        if (resultados.length === 0) {
            resultsBox.innerHTML = '<h3>Nenhum resultado para "' + input.value + '"</h3>';
        } else {
            let html = '<h3>Resultados para "' + input.value + '" (' + resultados.length + ')</h3>';
            resultados.forEach(function(r) {
                html += '<div class="result-item"><div class="info"><div class="nome">' + r.nome + '</div><div class="corredor-tag">Corredor ' + r.corredor + '</div><div class="qtd">' + r.quantidade + ' palete' + (r.quantidade > 1 ? 's' : '') + '</div></div><a href="corredor.html?id=' + r.corredor + '">Abrir</a></div>';
            });
            resultsBox.innerHTML = html;
        }

        resultsBox.classList.remove('hidden');
        corredoresSection.classList.add('hidden');
    }

    btn.addEventListener('click', executarBusca);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') executarBusca();
    });

    input.addEventListener('input', function() {
        if (input.value.trim() === '') {
            resultsBox.classList.add('hidden');
            corredoresSection.classList.remove('hidden');
        }
    });
}

let corredorAtual = null;
let editandoId = null;

function initCorredorPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id || isNaN(id) || id < 1 || id > 60) {
        window.location.href = 'index.html';
        return;
    }

    corredorAtual = id;
    document.getElementById('tituloCorredor').textContent = 'Corredor ' + id;
    document.title = 'Corredor ' + id + ' - Falange';

    renderLista();
    setupFormulario();
}

function renderLista() {
    const dados = getDados();
    const lista = dados[corredorAtual] || [];
    const container = document.getElementById('listaMercadorias');
    const msgVazio = document.getElementById('msgVazio');

    if (lista.length === 0) {
        container.innerHTML = '';
        msgVazio.classList.remove('hidden');
        return;
    }

    msgVazio.classList.add('hidden');

    let html = '';
    lista.forEach(function(item) {
        html += '<div class="item-card"><div class="info"><div class="nome">' + item.nome + '</div><div class="qtd">' + item.quantidade + ' palete' + (item.quantidade > 1 ? 's' : '') + '</div></div><div class="item-actions"><button class="btn-edit" onclick="editarItem(\'' + item.id + '\')">✍🏻</button><button class="btn-move" onclick="moverItem(\'' + item.id + '\')">🔄</button><button class="btn-delete" onclick="removerItem(\'' + item.id + '\')">🗑️</button></div></div>';
    });

    container.innerHTML = html;
}
        return;
    }

    msgVazio.classList.add('hidden');

    let html = '';
    lista.forEach(function(item) {
        html += '<div class="item-card"><div class="info"><div class="nome">' + item.nome + '</div><div class="qtd">' + item.quantidade + ' palete' + (item.quantidade > 1 ? 's' : '') + '</div></div><div class="item-actions"><button class="btn-edit" onclick="editarItem(\'' + item.id + '\')">✍🏻</button><button class="btn-delete" onclick="removerItem(\'' + item.id + '\')">🗑️</button></div></div>';
    });

    container.innerHTML = html;
}

function setupFormulario() {
    const btnAdicionar = document.getElementById('btnAdicionar');
    const formBox = document.getElementById('formBox');
    const btnSalvar = document.getElementById('btnSalvar');
    const btnCancelar = document.getElementById('btnCancelar');
    const inputNome = document.getElementById('inputNome');
    const inputQtd = document.getElementById('inputQtd');
    const formTitle = document.getElementById('formTitle');

    btnAdicionar.addEventListener('click', function() {
        editandoId = null;
        formTitle.textContent = 'Nova mercadoria';
        inputNome.value = '';
        inputQtd.value = '1';
        formBox.classList.remove('hidden');
        inputNome.focus();
    });

    btnCancelar.addEventListener('click', function() {
        formBox.classList.add('hidden');
        editandoId = null;
    });

    btnSalvar.addEventListener('click', function() {
        const nome = inputNome.value.trim();
        const qtd = parseInt(inputQtd.value, 10) || 1;

        if (!nome) {
            alert('Digite o nome da mercadoria');
            inputNome.focus();
            return;
        }

        const dados = getDados();
        if (!dados[corredorAtual]) dados[corredorAtual] = [];

        if (editandoId) {
            const item = dados[corredorAtual].find(function(i) { return i.id === editandoId; });
            if (item) {
                item.nome = nome;
                item.quantidade = qtd;
            }
        } else {
            dados[corredorAtual].push({
                id: gerarId(),
                nome: nome,
                quantidade: qtd
            });
        }

        salvarDados(dados);
        formBox.classList.add('hidden');
        editandoId = null;
        renderLista();
    });
}

function editarItem(id) {
    const dados = getDados();
    const lista = dados[corredorAtual] || [];
    const item = lista.find(function(i) { return i.id === id; });
    if (!item) return;

    editandoId = id;
    document.getElementById('formTitle').textContent = 'Editar mercadoria';
    document.getElementById('inputNome').value = item.nome;
    document.getElementById('inputQtd').value = item.quantidade;
    document.getElementById('formBox').classList.remove('hidden');
    document.getElementById('inputNome').focus();
}

function removerItem(id) {
    if (!confirm('Remover esta mercadoria?')) return;

    const dados = getDados();
    if (!dados[corredorAtual]) return;

    dados[corredorAtual] = dados[corredorAtual].filter(function(i) { return i.id !== id; });
    if (dados[corredorAtual].length === 0) {
        delete dados[corredorAtual];
    }

    salvarDados(dados);
    renderLista();
}
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(() => console.log("Service Worker registrado!"))
      .catch(err => console.log("Erro:", err));
  });
}
function moverItem(id) {
    const novoCorredor = prompt('Para qual corredor deseja mover esta mercadoria? (1 a 60)');
    
    if (!novoCorredor) return; // Cancelou

    const destino = parseInt(novoCorredor, 10);

    if (isNaN(destino) || destino < 1 || destino > 60) {
        alert('Número de corredor inválido. Digite um número de 1 a 60.');
        return;
    }

    if (destino == corredorAtual) {
        alert('A mercadoria já está neste corredor.');
        return;
    }

    const dados = getDados();
    const lista = dados[corredorAtual] || [];
    const item = lista.find(function(i) { return i.id === id; });

    if (!item) return;

    // Remove do corredor atual
    dados[corredorAtual] = lista.filter(function(i) { return i.id !== id; });
    if (dados[corredorAtual].length === 0) {
        delete dados[corredorAtual];
    }

    // Adiciona no corredor de destino
    if (!dados[destino]) {
        dados[destino] = [];
    }
    dados[destino].push(item);

    salvarDados(dados);
    renderLista();
    alert('Mercadoria movida para o Corredor ' + destino + ' com sucesso!');
}
