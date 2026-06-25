// Função para formatar um número comum em moeda brasileira (Ex: de 150000 para 150.000)
function formatarMoeda(valor) {
    // Utiliza a API nativa do JS (Intl.NumberFormat) para formatar números baseados na região 'pt-BR'
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(valor)
        .replace('R$', '')
        .trim(); // Removemos o 'R$' gerado porque o próprio HTML já o inclui
}

(() => {
    // --- Lógica dos Filtros de Preço (Página de Inventário) ---
    // Captura as barras deslizantes (inputs range) e os textos (spans) onde o valor aparece
    const precoMin = document.getElementById('preco-min');
    const precoMax = document.getElementById('preco-max');
    const precoMinDisplay = document.getElementById('precoMin');
    const precoMaxDisplay = document.getElementById('precoMax');

    // Só executa se estivermos na página que possui esses elementos
    if (precoMin && precoMax && precoMinDisplay && precoMaxDisplay) {
        // Ouve as mudanças na barra de Preço Mínimo
        precoMin.addEventListener('input', () => {
            // Impede que o preço mínimo ultrapasse o preço máximo
            if (parseInt(precoMin.value) > parseInt(precoMax.value)) {
                precoMin.value = precoMax.value;
            }
            // Atualiza o texto na tela formatado como moeda
            precoMinDisplay.textContent = formatarMoeda(parseInt(precoMin.value));
        });

        // Ouve as mudanças na barra de Preço Máximo
        precoMax.addEventListener('input', () => {
            // Impede que o preço máximo seja menor que o preço mínimo
            if (parseInt(precoMax.value) < parseInt(precoMin.value)) {
                precoMax.value = precoMin.value;
            }
            // Atualiza o texto na tela formatado como moeda
            precoMaxDisplay.textContent = formatarMoeda(parseInt(precoMax.value));
        });

        // Formata os valores assim que a página abre, antes do usuário mexer
        precoMinDisplay.textContent = formatarMoeda(parseInt(precoMin.value));
        precoMaxDisplay.textContent = formatarMoeda(parseInt(precoMax.value));
    }

    // --- Lógica dos Filtros de Ano (Página de Inventário) ---
    // Captura os inputs range referentes ao ano do carro
    const anoMin = document.getElementById('ano-min');
    const anoMax = document.getElementById('ano-max');
    const anoMinDisplay = document.getElementById('anoMin');
    const anoMaxDisplay = document.getElementById('anoMax');

    if (anoMin && anoMax && anoMinDisplay && anoMaxDisplay) {
        // Validação similar ao do preço: impede anos inconsistentes
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
})();

// Função engatilhada ao clicar em "BUSCAR VEICULOS" (Página Início)
function buscarVeiculos(event) {
    event.preventDefault(); // Impede a página de recarregar como seria o padrão do formulário

    // Pega os valores preenchidos no formulário
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const ano = document.getElementById('ano').value;
    const preco = document.getElementById('preco').value;

    // Exige no mínimo que a marca seja selecionada
    if (!marca) {
        alert('Por favor, selecione uma marca');
        return;
    }

    // Constrói a URL para a página de inventário adicionando os filtros como parâmetros (Query Strings)
    let filtros = `?marca=${marca}`;
    if (modelo) filtros += `&modelo=${modelo}`;
    if (ano) filtros += `&ano=${ano}`;
    if (preco) filtros += `&preco=${preco}`;

    // Redireciona o usuário para a página de inventário com os filtros aplicados
    window.location.href = `inventario.html${filtros}`;
}

// Função para o Carrossel de Imagens na página de Detalhes
function trocarImagem(thumb) {
    // Captura o elemento da imagem principal grande
    const mainImage = document.getElementById('imagemPrincipal');

    // Dá um efeito rápido de esmaecimento (opacidade cai) para não parecer um corte seco
    mainImage.style.opacity = 0.5;

    // Após 150 milissegundos, troca a fonte (src) da imagem e volta a opacidade
    setTimeout(() => {
        mainImage.src = thumb.src; // Substitui o caminho da imagem
        mainImage.style.opacity = 1; // Retorna o brilho
    }, 150);

    // Remove a classe 'active' (borda preta) de todas as miniaturas
    document.querySelectorAll('.thumbnail-gallery img').forEach((img) => {
        img.classList.remove('active');
    });

    // Destaca a miniatura que acabou de ser clicada
    thumb.classList.add('active');
}
