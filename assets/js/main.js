// Form para pesquisa dos carros no index
document.querySelector('.search-form')?.addEventListener('submit', () => {
    event.preventDefault();

    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const ano = document.getElementById('ano').value;
    const preco = document.getElementById('preco').value;

    if (!marca) {
        alert('Por favor, selecione uma marca');
        return;
    }

    let filtros = `?marca=${marca}`;
    if (modelo) filtros += `&modelo=${modelo}`;
    if (ano) filtros += `&ano=${ano}`;
    if (preco) filtros += `&preco=${preco}`;

    window.location.href = `html/inventario.html${filtros}`;
});

// Funções de controle para a pagina inventario
function newPrice() {
    // Atualizar Preço
    const precoMin = document.getElementById('preco-min');
    const precoMax = document.getElementById('preco-max');
    const precoMinDisplay = document.getElementById('precoMin');
    const precoMaxDisplay = document.getElementById('precoMax');

    precoMin.addEventListener('input', () => {
        if (parseInt(precoMin.value) > parseInt(precoMax.value)) {
            precoMin.value = precoMax.value;
        }
        precoMinDisplay.textContent = parseInt(precoMin.value).toLocaleString('pt-BR');
    });

    precoMax.addEventListener('input', () => {
        if (parseInt(precoMax.value) < parseInt(precoMin.value)) {
            precoMax.value = precoMin.value;
        }
        precoMaxDisplay.textContent = parseInt(precoMax.value).toLocaleString('pt-BR');
    });
}

function newYear() {
    // Atualizar Ano
    const anoMin = document.getElementById('ano-min');
    const anoMax = document.getElementById('ano-max');
    const anoMinDisplay = document.getElementById('anoMin');
    const anoMaxDisplay = document.getElementById('anoMax');

    anoMin.addEventListener('input', () => {
        if (parseInt(anoMin.value) > parseInt(anoMax.value)) {
            anoMin.value = anoMax.value;
        }
        anoMinDisplay.textContent = anoMin.value;
    });

    anoMax.addEventListener('input', () => {
        if (parseInt(anoMax.value) < parseInt(anoMin.value)) {
            anoMax.value = anoMin.value;
        }
        anoMaxDisplay.textContent = anoMax.value;
    });
}

// Chamar funções
if (location.href.includes('inventario.html')) {
    newPrice();
    newYear();
}
