// Elementos da interface
const linkExplore = document.getElementById('link-explore');
const linkSearch = document.getElementById('link-search');
const linkAbout = document.getElementById('link-about');
const linkReference = document.getElementById('link-reference');

const sectionExplorer = document.getElementById('book-explorer');
const sectionSearch = document.getElementById('text-search');
const sectionAbout = document.getElementById('about');
const sectionReference = document.getElementById('reference');

const inputSala = document.getElementById('sala');
const inputPrateleira = document.getElementById('prateleira');
const inputLivro = document.getElementById('livro');
const inputPagina = document.getElementById('pagina');

const btnRandom = document.getElementById('btn-random');
const btnGenerate = document.getElementById('btn-generate');
const bookContent = document.getElementById('book-content');
const currentCoords = document.getElementById('current-coords');

const inputSearchText = document.getElementById('search-text');
const btnSearch = document.getElementById('btn-search');
const searchResults = document.getElementById('search-results');
const searchCoords = document.getElementById('search-coords');
const btnGotoResult = document.getElementById('btn-goto-result');

// Variável global para armazenar o texto buscado
let textoParaDestacar = '';

// Navegação entre seções
linkExplore.addEventListener('click', (e) => {
    e.preventDefault();
    sectionExplorer.style.display = 'block';
    sectionSearch.style.display = 'none';
    sectionAbout.style.display = 'none';
    sectionReference.style.display = 'none';
});

linkSearch.addEventListener('click', (e) => {
    e.preventDefault();
    sectionExplorer.style.display = 'none';
    sectionSearch.style.display = 'block';
    sectionAbout.style.display = 'none';
    sectionReference.style.display = 'none';
});

linkAbout.addEventListener('click', (e) => {
    e.preventDefault();
    sectionExplorer.style.display = 'none';
    sectionSearch.style.display = 'none';
    sectionAbout.style.display = 'block';
    sectionReference.style.display = 'none';
});

linkReference.addEventListener('click', (e) => {
    e.preventDefault();
    sectionExplorer.style.display = 'none';
    sectionSearch.style.display = 'none';
    sectionAbout.style.display = 'none';
    sectionReference.style.display = 'block';
});

// Função para gerar um código hexadecimal aleatório para a sala
function randomHex(length) {
    const hexChars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
    }
    return result;
}

// Função para gerar o conteúdo de um livro com base nas coordenadas
function generateBook(sala, prateleira, livro, pagina) {
    // Função de hash simples para gerar texto determinístico
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }
    
    // Seed para o gerador pseudoaleatório
    const seed = simpleHash(`${sala}-${prateleira}-${livro}-${pagina}`);
    
    // Caracteres possíveis (apenas letras minúsculas, espaço, vírgula e ponto)
    const chars = 'abcdefghijklmnopqrstuvwxyz ,.';
    
    // Tamanho da página (aproximadamente 40 linhas de 80 caracteres)
    const pageSize = 3200;
    
    // Gerar texto
    let content = '';
    let pseudoRandom = seed;
    
    for (let i = 0; i < pageSize; i++) {
        // Atualizar o valor pseudoaleatório
        pseudoRandom = (pseudoRandom * 16807) % 2147483647;
        
        // Selecionar caractere
        const charIndex = Math.abs(pseudoRandom) % chars.length;
        content += chars[charIndex];
        
        // Adicionar quebras de linha e parágrafos ocasionais
        if (i % 80 === 79) {
            content += '\n';
        }
        
        // 5% de chance de adicionar quebra de parágrafo
        if (i % 80 === 0 && Math.abs(pseudoRandom) % 20 === 0) {
            content += '\n';
        }
    }
    
    return content;
}

// Função para atualizar o conteúdo do livro
function updateBook() {
    const sala = inputSala.value;
    const prateleira = inputPrateleira.value;
    const livro = inputLivro.value;
    const pagina = inputPagina.value;
    
    // Validar inputs
    if (!/^[0-9a-f]{8}$/.test(sala)) {
        alert('A sala deve ser um código hexadecimal de 8 caracteres.');
        return;
    }
    
    if (prateleira < 1 || prateleira > 5) {
        alert('A prateleira deve ser um número de 1 a 5.');
        return;
    }
    
    if (livro < 1 || livro > 32) {
        alert('O livro deve ser um número de 1 a 32.');
        return;
    }
    
    if (pagina < 1 || pagina > 410) {
        alert('A página deve ser um número de 1 a 410.');
        return;
    }
    
    // Mostrar carregando
    bookContent.textContent = 'Carregando...';
    
    // Atraso artificial para simular o carregamento
    setTimeout(() => {
        // Gerar o conteúdo
        const content = generateBook(sala, prateleira, livro, pagina);
        
        // Verificar se há texto para destacar
        if (textoParaDestacar) {
            // Criar elemento div para o conteúdo
            bookContent.innerHTML = '';
            
            // Substituir o texto buscado por uma versão destacada
            const regex = new RegExp(textoParaDestacar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            const htmlContent = content.replace(regex, `<span class="highlighted">${textoParaDestacar}</span>`);
            
            // Adicionar o conteúdo com destaque ao elemento
            const preElement = document.createElement('pre');
            preElement.innerHTML = htmlContent;
            bookContent.appendChild(preElement);
            
            // Limpar o texto para destacar após usar
            textoParaDestacar = '';
        } else {
            // Sem texto para destacar, mostrar conteúdo normal
            bookContent.textContent = content;
        }
        
        // Atualizar as coordenadas exibidas
        currentCoords.textContent = `Sala ${sala}, Prateleira ${prateleira}, Livro ${livro}, Página ${pagina}`;
    }, 500);
}

// Gerar livro aleatório
btnRandom.addEventListener('click', () => {
    inputSala.value = randomHex(8);
    inputPrateleira.value = Math.floor(Math.random() * 5) + 1;
    inputLivro.value = Math.floor(Math.random() * 32) + 1;
    inputPagina.value = Math.floor(Math.random() * 410) + 1;
    
    updateBook();
});

// Gerar livro com coordenadas atuais
btnGenerate.addEventListener('click', updateBook);

// Buscar texto
btnSearch.addEventListener('click', () => {
    const text = inputSearchText.value.trim();
    
    if (!text) {
        alert('Por favor, digite um texto para buscar.');
        return;
    }
    
    // Verificar o tamanho do texto
    if (text.length > 3200) {
        alert('O texto de busca não pode ter mais de 3200 caracteres.');
        return;
    }
    
    // Verificar se o texto contém apenas caracteres válidos
    const validChars = /^[a-z ,.]*$/;
    if (!validChars.test(text)) {
        alert('O texto de busca só pode conter letras minúsculas, espaços, vírgulas e pontos.');
        return;
    }
    
    // Armazenar o texto para destacar quando o livro for carregado
    textoParaDestacar = text;
    
    // Desabilitar o botão de busca e mudar seu texto
    btnSearch.disabled = true;
    btnSearch.textContent = 'Cancelar Busca';
    
    // Mudar a função do botão para cancelar a busca em andamento
    let buscaAtiva = true;
    const originalOnClick = btnSearch.onclick;
    btnSearch.onclick = () => {
        buscaAtiva = false;
        btnSearch.textContent = 'Buscar';
        btnSearch.onclick = originalOnClick;
        searchCoords.textContent = 'Busca cancelada após ' + tentativas + ' tentativas.';
        btnGotoResult.style.display = 'none';
        btnSearch.disabled = false;
    };
    
    // Mostrar resultados e indicar busca em andamento
    searchResults.style.display = 'block';
    searchCoords.textContent = 'Buscando...';
    btnGotoResult.style.display = 'none';
    
    // Variáveis para controlar a busca
    let tentativas = 0;
    let encontrado = false;
    let foundSala, foundPrateleira, foundLivro, foundPagina;
    
    // Função para realizar um lote de buscas
    function realizarLoteDeBuscas() {
        // Número de tentativas por lote (ajuste para controlar o desempenho)
        const tentativasPorLote = 20;
        
        // Fazer um lote de tentativas
        for (let i = 0; i < tentativasPorLote && !encontrado && buscaAtiva; i++) {
            tentativas++;
            
            // Atualizar texto de status a cada 50 tentativas
            if (tentativas % 50 === 0) {
                searchCoords.textContent = `Buscando... (${tentativas} tentativas)`;
            }
            
            // Gerar coordenadas aleatórias
            foundSala = randomHex(8);
            foundPrateleira = Math.floor(Math.random() * 5) + 1;
            foundLivro = Math.floor(Math.random() * 32) + 1;
            foundPagina = Math.floor(Math.random() * 410) + 1;
            
            // Gerar conteúdo para estas coordenadas
            const conteudo = generateBook(foundSala, foundPrateleira, foundLivro, foundPagina);
            
            // Verificar se o texto está presente
            if (conteudo.includes(text)) {
                encontrado = true;
            }
        }
        
        // Verificar se terminou a busca ou continuar
        if (encontrado) {
            // Texto encontrado!
            searchCoords.textContent = `Sala ${foundSala}, Prateleira ${foundPrateleira}, Livro ${foundLivro}, Página ${foundPagina}`;
            btnGotoResult.textContent = "Ir para este livro";
            btnGotoResult.style.display = 'block';
            btnGotoResult.onclick = () => {
                inputSala.value = foundSala;
                inputPrateleira.value = foundPrateleira;
                inputLivro.value = foundLivro;
                inputPagina.value = foundPagina;
                
                // Voltar para o explorador e atualizar o livro
                linkExplore.click();
                updateBook();
            };
            
            // Restaurar o botão de busca
            btnSearch.disabled = false;
            btnSearch.textContent = 'Buscar';
            btnSearch.onclick = originalOnClick;
        } else if (buscaAtiva) {
            // Continuar buscando no próximo frame
            setTimeout(realizarLoteDeBuscas, 0);
        }
    }
    
    // Iniciar o processo de busca
    setTimeout(realizarLoteDeBuscas, 100);
});

// Inicializar com um livro aleatório
btnRandom.click();
