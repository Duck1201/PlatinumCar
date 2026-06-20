// ===================================================================
// Form de pesquisa rapida (index.html)
// ===================================================================
document.querySelector('.search-form')?.addEventListener('submit', (event) => {
    // BUG CORRIGIDO: faltava receber o parametro "event" na função,
    // então event.preventDefault() não funcionava em todos os navegadores
    // e o formulário podia recarregar a página antes do redirecionamento.
    event.preventDefault();

    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const ano = document.getElementById('ano').value;
    const preco = document.getElementById('preco').value;

    if (!marca) {
        alert('Por favor, selecione uma marca');
        return;
    }

    let filtros = `?marca=${encodeURIComponent(marca)}`;
    if (modelo) filtros += `&modelo=${encodeURIComponent(modelo)}`;
    if (ano) filtros += `&ano=${encodeURIComponent(ano)}`;
    if (preco) filtros += `&preco=${encodeURIComponent(preco)}`;

    window.location.href = `inventario.html${filtros}`;
});

// ===================================================================
// Funções de controle da página de inventário (inventario.html)
// ===================================================================

// Atualiza os textos "De / Até" do filtro de preço
function newPrice() {
    const precoMin = document.getElementById('preco-min');
    const precoMax = document.getElementById('preco-max');
    const precoMinDisplay = document.getElementById('precoMin');
    const precoMaxDisplay = document.getElementById('precoMax');

    precoMin.addEventListener('input', () => {
        if (parseInt(precoMin.value) > parseInt(precoMax.value)) {
            precoMin.value = precoMax.value;
        }
        precoMinDisplay.textContent = parseInt(precoMin.value).toLocaleString('pt-BR');
        aplicarFiltros();
    });

    precoMax.addEventListener('input', () => {
        if (parseInt(precoMax.value) < parseInt(precoMin.value)) {
            precoMax.value = precoMin.value;
        }
        precoMaxDisplay.textContent = parseInt(precoMax.value).toLocaleString('pt-BR');
        aplicarFiltros();
    });
}

// Atualiza os textos "De / Até" do filtro de ano
function newYear() {
    const anoMin = document.getElementById('ano-min');
    const anoMax = document.getElementById('ano-max');
    const anoMinDisplay = document.getElementById('anoMin');
    const anoMaxDisplay = document.getElementById('anoMax');

    anoMin.addEventListener('input', () => {
        if (parseInt(anoMin.value) > parseInt(anoMax.value)) {
            anoMin.value = anoMax.value;
        }
        anoMinDisplay.textContent = anoMin.value;
        aplicarFiltros();
    });

    anoMax.addEventListener('input', () => {
        if (parseInt(anoMax.value) < parseInt(anoMin.value)) {
            anoMax.value = anoMin.value;
        }
        anoMaxDisplay.textContent = anoMax.value;
        aplicarFiltros();
    });
}

// BUG CORRIGIDO: a busca da home (marca/modelo/ano/preço) redirecionava
// para inventario.html?marca=...&preco=... mas nada na página lia esses
// parâmetros, e os checkboxes/radios da barra lateral não filtravam
// os carros exibidos. Esta função implementa o filtro de fato.
function aplicarFiltros() {
    const cards = document.querySelectorAll('.inventory-grid .card');
    const semResultados = document.getElementById('sem-resultados');

    const marcasSelecionadas = Array.from(document.querySelectorAll('.filtro-marca:checked')).map((el) => el.value);
    const tipoSelecionado = document.querySelector('.filtro-tipo:checked')?.value || '';
    const precoMin = parseInt(document.getElementById('preco-min').value);
    const precoMax = parseInt(document.getElementById('preco-max').value);
    const anoMin = parseInt(document.getElementById('ano-min').value);
    const anoMax = parseInt(document.getElementById('ano-max').value);
    const termoBusca = (document.getElementById('busca-modelo')?.value || '').trim().toLowerCase();

    let visiveis = 0;

    cards.forEach((card) => {
        const marca = card.dataset.marca || '';
        const tipo = card.dataset.tipo || '';
        const ano = parseInt(card.dataset.ano);
        const preco = parseInt(card.dataset.preco);
        const textoCard = card.textContent.toLowerCase();

        const passaMarca = marcasSelecionadas.length === 0 || marcasSelecionadas.includes(marca);
        const passaTipo = !tipoSelecionado || tipo === tipoSelecionado;
        const passaPreco = preco >= precoMin && preco <= precoMax;
        const passaAno = ano >= anoMin && ano <= anoMax;
        const passaBusca = !termoBusca || textoCard.includes(termoBusca);

        const visivel = passaMarca && passaTipo && passaPreco && passaAno && passaBusca;
        card.style.display = visivel ? '' : 'none';
        if (visivel) visiveis++;
    });

    if (semResultados) {
        semResultados.style.display = visiveis === 0 ? 'block' : 'none';
    }
}

// Liga os checkboxes de marca, radios de tipo, campo de busca e botão "Limpar filtros"
function setupFiltrosInterativos() {
    document.querySelectorAll('.filtro-marca').forEach((el) => el.addEventListener('change', aplicarFiltros));
    document.querySelectorAll('.filtro-tipo').forEach((el) => el.addEventListener('change', aplicarFiltros));
    document.getElementById('busca-modelo')?.addEventListener('input', aplicarFiltros);

    document.getElementById('limpar-filtros')?.addEventListener('click', () => {
        document.querySelectorAll('.filtro-marca').forEach((el) => (el.checked = false));
        const todos = document.querySelector('.filtro-tipo[value=""]');
        if (todos) todos.checked = true;

        const precoMin = document.getElementById('preco-min');
        const precoMax = document.getElementById('preco-max');
        precoMin.value = precoMin.min;
        precoMax.value = precoMax.max;
        document.getElementById('precoMin').textContent = parseInt(precoMin.value).toLocaleString('pt-BR');
        document.getElementById('precoMax').textContent = parseInt(precoMax.value).toLocaleString('pt-BR');

        const anoMin = document.getElementById('ano-min');
        const anoMax = document.getElementById('ano-max');
        anoMin.value = anoMin.min;
        anoMax.value = anoMax.max;
        document.getElementById('anoMin').textContent = anoMin.value;
        document.getElementById('anoMax').textContent = anoMax.value;

        const buscaModelo = document.getElementById('busca-modelo');
        if (buscaModelo) buscaModelo.value = '';

        aplicarFiltros();
    });
}

// Lê os parâmetros enviados pela busca rápida da home (?marca=&modelo=&ano=&preco=)
// e já aplica esse filtro inicial na página de inventário.
function aplicarFiltrosDaUrl() {
    const params = new URLSearchParams(window.location.search);
    const marca = params.get('marca');
    const modelo = params.get('modelo');
    const ano = params.get('ano');
    const preco = params.get('preco');

    if (marca) {
        const checkbox = document.querySelector(`.filtro-marca[value="${marca}"]`);
        if (checkbox) checkbox.checked = true;
    }

    if (ano) {
        const anoMin = document.getElementById('ano-min');
        const anoMinDisplay = document.getElementById('anoMin');
        const anoValido = Math.min(Math.max(parseInt(ano), parseInt(anoMin.min)), parseInt(anoMin.max));
        anoMin.value = anoValido;
        anoMinDisplay.textContent = anoValido;
    }

    if (preco) {
        const precoMax = document.getElementById('preco-max');
        const precoMaxDisplay = document.getElementById('precoMax');
        const precoValido = Math.min(Math.max(parseInt(preco), parseInt(precoMax.min)), parseInt(precoMax.max));
        precoMax.value = precoValido;
        precoMaxDisplay.textContent = precoValido.toLocaleString('pt-BR');
    }

    if (modelo) {
        const buscaModelo = document.getElementById('busca-modelo');
        if (buscaModelo) buscaModelo.value = modelo;
    }

    aplicarFiltros();
}

// ===================================================================
// Inicialização
// ===================================================================
if (location.href.includes('inventario.html')) {
    newPrice();
    newYear();
    setupFiltrosInterativos();
    aplicarFiltrosDaUrl();
}