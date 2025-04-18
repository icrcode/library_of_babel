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

const searchAlgorithm = document.getElementById('search-algorithm');
const usedAlgorithm = document.getElementById('used-algorithm');

const searchStats = document.getElementById('search-stats');
const tempoDecorridoElement = document.getElementById('tempo-decorrido');
const tentativasBuscaElement = document.getElementById('tentativas-busca');
const velocidadeBuscaElement = document.getElementById('velocidade-busca');
const estimativaTempoElement = document.getElementById('estimativa-tempo');
const progressBar = document.getElementById('progress-bar');

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
function generateBook(sala, prateleira, livro, pagina, textoInserir = null) {
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

    // Caracteres possíveis (letras minúsculas e maiúsculas, espaço, vírgula e ponto)
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ,.';

    // Tamanho da página (aproximadamente 40 linhas de 80 caracteres)
    const pageSize = 3200;

    // Gerar texto
    let content = '';
    let pseudoRandom = seed;

    // Se temos um texto para inserir, vamos colocá-lo em uma posição aleatória dentro do conteúdo
    if (textoInserir) {
        // Gerar posição aleatória, mas não muito no início ou fim
        const posicaoInsercao = 500 + (Math.abs(seed) % 1500);

        // Gerar primeira parte do conteúdo
        for (let i = 0; i < posicaoInsercao; i++) {
            pseudoRandom = (pseudoRandom * 16807) % 2147483647;
            const charIndex = Math.abs(pseudoRandom) % chars.length;
            content += chars[charIndex];

            if (i % 80 === 79) {
                content += '\n';
            }

            if (i % 80 === 0 && Math.abs(pseudoRandom) % 20 === 0) {
                content += '\n';
            }
        }

        // Inserir o texto buscado
        content += textoInserir;

        // Continuar gerando o restante do conteúdo
        const restante = pageSize - posicaoInsercao - textoInserir.length;
        for (let i = 0; i < restante; i++) {
            pseudoRandom = (pseudoRandom * 16807) % 2147483647;
            const charIndex = Math.abs(pseudoRandom) % chars.length;
            content += chars[charIndex];

            if ((posicaoInsercao + textoInserir.length + i) % 80 === 79) {
                content += '\n';
            }

            if ((posicaoInsercao + textoInserir.length + i) % 80 === 0 && Math.abs(pseudoRandom) % 20 === 0) {
                content += '\n';
            }
        }
    } else {
        // Geração padrão sem inserção de texto
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
        alert('O Setor deve ser um código hexadecimal de 8 caracteres.');
        return;
    }

    if (prateleira < 1 || prateleira > 5) {
        alert('A Unidade deve ser um número de 1 a 5.');
        return;
    }

    if (livro < 1 || livro > 32) {
        alert('O Arquivo deve ser um número de 1 a 32.');
        return;
    }

    if (pagina < 1 || pagina > 410) {
        alert('A Segmento deve ser um número de 1 a 410.');
        return;
    }

    // Mostrar carregando
    bookContent.innerHTML = '<div class="loading">Carregando...</div>';

    // Atraso artificial para simular o carregamento
    setTimeout(() => {
        // Verificar se existe um texto específico para estas coordenadas
        let textoEspecial = null;

        // Verificar no mapa de hash direto
        if (window.directHashMap) {
            for (const key in window.directHashMap) {
                if (key.includes(`-${sala}-${prateleira}-${livro}-${pagina}`)) {
                    textoEspecial = window.directHashMap[key];
                    break;
                }
            }
        }

        // Gerar o conteúdo, possivelmente com texto especial
        const content = generateBook(sala, prateleira, livro, pagina, textoEspecial);

        // Limpar conteúdo anterior
        bookContent.innerHTML = '';

        // Criar elemento para conter o texto formatado
        const contentElement = document.createElement('div');
        contentElement.className = 'content-wrapper';

        // Verificar se há texto para destacar
        if (textoParaDestacar) {
            // Substituir o texto buscado por uma versão destacada
            const regex = new RegExp(textoParaDestacar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

            // Formatar o texto para exibição
            // Melhorar a quebra de parágrafos e evitar estourar o container
            let formattedContent = content.replace(/\s{2,}/g, ' '); // Remover excesso de espaços

            // Dividir o texto em parágrafos mais curtos para melhor formatação
            formattedContent = formatarTextoParagrafos(formattedContent);

            // Aplicar o destaque
            formattedContent = formattedContent.replace(regex, `<span class="highlighted">${textoParaDestacar}</span>`);

            // Definir o conteúdo no elemento
            contentElement.innerHTML = formattedContent;

            // Limpar o texto para destacar após usar
            textoParaDestacar = '';
        } else {
            // Formatar o texto para exibição
            // Melhorar a quebra de parágrafos e evitar estourar o container
            let formattedContent = content.replace(/\s{2,}/g, ' '); // Remover excesso de espaços

            // Dividir o texto em parágrafos mais curtos para melhor formatação
            formattedContent = formatarTextoParagrafos(formattedContent);

            // Definir o conteúdo no elemento
            contentElement.innerHTML = formattedContent;
        }

        // Adicionar ao bookContent
        bookContent.appendChild(contentElement);

        

        // Atualizar as coordenadas exibidas
        currentCoords.textContent = `Setor ${sala}, Unidade ${prateleira}, Arquivo ${livro}, Segmento ${pagina}`;
    }, 500);
}

// Função para formatar o texto em parágrafos uniformes
function formatarTextoParagrafos(texto) {
    // Primeiro dividimos o texto por quebras de linha
    const linhas = texto.split('\n');
    let resultado = '';
    let paragrafoAtual = '';

    // Para cada linha, formamos parágrafos com tamanho adequado
    linhas.forEach(linha => {
        if (linha.trim() === '') {
            // Linha vazia indica quebra de parágrafo
            if (paragrafoAtual !== '') {
                resultado += `<p class="book-paragraph">${paragrafoAtual}</p>`;
                paragrafoAtual = '';
            }
        } else {
            // Adicionamos a linha ao parágrafo atual
            paragrafoAtual += ' ' + linha.trim();

            // Se o parágrafo atingir um tamanho razoável, fechamos ele
            if (paragrafoAtual.length > 400) {
                resultado += `<p class="book-paragraph">${paragrafoAtual}</p>`;
                paragrafoAtual = '';
            }
        }
    });

    // Se ainda tiver texto no parágrafo atual, fecha ele
    if (paragrafoAtual !== '') {
        resultado += `<p class="book-paragraph">${paragrafoAtual}</p>`;
    }

    return resultado;
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

// Evento de mudança no algoritmo de busca para atualizar a interface
searchAlgorithm.addEventListener('change', function () {
    // Se for Hash Direto, adiciona a classe para o estilo diferenciado
    if (this.value === 'direct-hash') {
        searchStats.classList.add('direct-hash-active');
    } else {
        searchStats.classList.remove('direct-hash-active');
    }
});

// Função para calcular diretamente as coordenadas com base no texto
function calculateDirectHash(text) {
    // Cria um hash único baseado no texto
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Converte para um número de 32 bits
    }

    // Usa o hash para gerar coordenadas determinísticas
    const hashHex = Math.abs(hash).toString(16).padStart(8, '0').substring(0, 8);

    // Gera valores determinísticos para cada coordenada
    const prateleira = (Math.abs(hash) % 5) + 1;
    const livro = (Math.abs(hash >> 8) % 32) + 1;
    const pagina = (Math.abs(hash >> 16) % 410) + 1;

    // Criamos uma chave especial para associar com este texto
    const coordKey = `${text}-${hashHex}-${prateleira}-${livro}-${pagina}`;

    // Armazenamos a associação entre o texto e as coordenadas
    if (!window.directHashMap) {
        window.directHashMap = {};
    }
    window.directHashMap[coordKey] = text;

    return {
        sala: hashHex,
        prateleira: prateleira,
        livro: livro,
        pagina: pagina,
        textKey: coordKey
    };
}

// Implementação dos Algoritmos de Busca de Texto

// 1. Algoritmo Boyer-Moore
function boyerMooreSearch(text, pattern) {
    if (pattern.length === 0) return 0;

    // Pré-processamento: tabela de deslocamento para caracteres ruins
    const badCharTable = {};
    const patternLength = pattern.length;

    // Inicializa a tabela com o tamanho padrão
    for (let i = 0; i < patternLength - 1; i++) {
        badCharTable[pattern[i]] = patternLength - 1 - i;
    }

    // Verificação principal
    let offset = 0;
    while (offset <= text.length - patternLength) {
        let scanIndex = patternLength - 1;

        // Verifica os caracteres da direita para a esquerda
        while (scanIndex >= 0 && pattern[scanIndex] === text[offset + scanIndex]) {
            scanIndex--;
        }

        // Encontrou uma correspondência
        if (scanIndex < 0) {
            return offset;
        }

        // Calcula o deslocamento baseado no caractere ruim
        const badCharShift = badCharTable[text[offset + patternLength - 1]] || patternLength;
        offset += Math.max(1, badCharShift);
    }

    // Padrão não encontrado
    return -1;
}

// 2. Algoritmo Rabin-Karp
function rabinKarpSearch(text, pattern) {
    if (pattern.length === 0) return 0;
    if (pattern.length > text.length) return -1;

    const prime = 101; // Número primo para cálculo de hash
    const base = 256; // Base para representação de caracteres

    // Função para calcular hash
    function calculateHash(str, length) {
        let hash = 0;
        for (let i = 0; i < length; i++) {
            hash = (hash * base + str.charCodeAt(i)) % prime;
        }
        return hash;
    }

    const patternLength = pattern.length;
    const patternHash = calculateHash(pattern, patternLength);
    let textHash = calculateHash(text, patternLength);

    // Valor para ajudar no cálculo de rolling hash
    let h = 1;
    for (let i = 0; i < patternLength - 1; i++) {
        h = (h * base) % prime;
    }

    // Deslizar a janela pelo texto
    for (let i = 0; i <= text.length - patternLength; i++) {
        // Verificar correspondência de hash
        if (patternHash === textHash) {
            // Verificar correspondência de caractere por caractere
            let match = true;
            for (let j = 0; j < patternLength; j++) {
                if (text[i + j] !== pattern[j]) {
                    match = false;
                    break;
                }
            }
            if (match) return i;
        }

        // Calcular hash para a próxima janela
        if (i < text.length - patternLength) {
            textHash = (base * (textHash - text.charCodeAt(i) * h) + text.charCodeAt(i + patternLength)) % prime;
            // Para lidar com hash negativo
            if (textHash < 0) textHash += prime;
        }
    }

    return -1;
}

// 3. Algoritmo Knuth-Morris-Pratt (KMP)
function kmpSearch(text, pattern) {
    if (pattern.length === 0) return 0;

    // Pré-processamento: construir tabela de falha
    function computeFailTable(pattern) {
        const table = new Array(pattern.length).fill(0);
        let i = 1;
        let j = 0;

        while (i < pattern.length) {
            if (pattern[i] === pattern[j]) {
                j++;
                table[i] = j;
                i++;
            } else {
                if (j !== 0) {
                    j = table[j - 1];
                } else {
                    table[i] = 0;
                    i++;
                }
            }
        }

        return table;
    }

    const failTable = computeFailTable(pattern);

    // Buscar no texto
    let i = 0; // índice para text
    let j = 0; // índice para pattern

    while (i < text.length) {
        if (pattern[j] === text[i]) {
            i++;
            j++;
        }

        if (j === pattern.length) {
            return i - j; // Encontrou o padrão
        } else if (i < text.length && pattern[j] !== text[i]) {
            if (j !== 0) {
                j = failTable[j - 1];
            } else {
                i++;
            }
        }
    }

    return -1; // Padrão não encontrado
}

// 4. Algoritmo Naive Search (Força Bruta)
function naiveSearch(text, pattern) {
    if (pattern.length === 0) return 0;
    if (pattern.length > text.length) return -1;

    // Verificar cada posição possível no texto
    for (let i = 0; i <= text.length - pattern.length; i++) {
        let found = true;

        // Verificar se o padrão corresponde a partir desta posição
        for (let j = 0; j < pattern.length; j++) {
            if (text[i + j] !== pattern[j]) {
                found = false;
                break;
            }
        }

        // Se todos os caracteres corresponderem, retorna a posição
        if (found) {
            return i;
        }
    }

    // Padrão não encontrado
    return -1;
}

// Buscar texto
btnSearch.addEventListener('click', () => {
    const searchText = inputSearchText.value.trim();
    const algoritmoSelecionado = searchAlgorithm.value;

    if (!searchText) {
        alert('Por favor, digite um texto para buscar.');
        return;
    }

    // Se for o método de hash direto, calcule instantaneamente
    if (algoritmoSelecionado === 'direct-hash') {
        // Calcular coordenadas diretamente
        const coords = calculateDirectHash(searchText);

        // Vamos garantir que o texto esteja presente quando o usuário visitar
        textoParaDestacar = searchText;

        // Exibir resultados (mas não as estatísticas para hash direto)
        searchStats.style.display = 'none';
        searchResults.style.display = 'block';
        searchCoords.textContent = `Sala ${coords.sala}, Prateleira ${coords.prateleira}, Livro ${coords.livro}, Página ${coords.pagina}`;
        usedAlgorithm.textContent = 'Hash Direto (Instantâneo)';

        // Armazenar coordenadas para o botão "Ir para este livro"
        searchResults.dataset.sala = coords.sala;
        searchResults.dataset.prateleira = coords.prateleira;
        searchResults.dataset.livro = coords.livro;
        searchResults.dataset.pagina = coords.pagina;

        // Configurar o botão "Ir para este livro"
        btnGotoResult.style.display = 'block';
        btnGotoResult.onclick = () => {
            inputSala.value = coords.sala;
            inputPrateleira.value = coords.prateleira;
            inputLivro.value = coords.livro;
            inputPagina.value = coords.pagina;

            // Voltar para o explorador e atualizar o livro
            linkExplore.click();
            updateBook();
        };

        return;
    }

    // Verificar o tamanho do texto
    if (searchText.length > 3200) {
        alert('O texto de busca não pode ter mais de 3200 caracteres.');
        return;
    }

    // Verificar se o texto contém apenas caracteres válidos
    const validChars = /^[a-zA-Z ,.]*$/;
    if (!validChars.test(searchText)) {
        alert('O texto de busca só pode conter letras minúsculas, maiúsculas, espaços, vírgulas e pontos.');
        return;
    }

    // Armazenar o texto para destacar quando o livro for carregado
    textoParaDestacar = searchText;

    // Obter o algoritmo selecionado
    usedAlgorithm.textContent = searchAlgorithm.options[searchAlgorithm.selectedIndex].text;

    // Simulação da busca
    searchResults.style.display = 'none';
    searchStats.style.display = 'block';

    // Estimar dificuldade baseada no tamanho do texto
    let dificuldade;

    if (searchText.length <= 1) {
        dificuldade = 29; // Apenas um caractere
    } else if (searchText.length <= 3) {
        dificuldade = 1000; // Textos muito curtos
    } else if (searchText.length <= 5) {
        dificuldade = 50000; // Textos curtos
    } else if (searchText.length <= 7) {
        dificuldade = 500000; // Textos médios
    } else if (searchText.length <= 10) {
        dificuldade = 5000000; // Textos longos
    } else {
        dificuldade = 50000000; // Textos muito longos
    }

    // Ajuste baseado no algoritmo (estimativa simplificada)
    let fatorAlgoritmo = 1;

    switch (algoritmoSelecionado) {
        case 'boyer-moore':
            fatorAlgoritmo = 0.8; // Mais eficiente
            break;
        case 'rabin-karp':
            fatorAlgoritmo = 0.9;
            break;
        case 'kmp':
            fatorAlgoritmo = 0.95;
            break;
        case 'naive':
            fatorAlgoritmo = 1.2; // Menos eficiente
            break;
    }

    dificuldade = Math.round(dificuldade * fatorAlgoritmo);

    // Inicializar as variáveis de busca
    let startSala = '00000000';
    let currentSala = startSala;
    let currentPrateleira = 1;
    let currentLivro = 1;
    let currentPagina = 1;

    // Variáveis para controlar a busca (declaradas antes do evento de cancelar)
    let buscaAtiva = true;
    let tentativas = 0;
    let encontrado = false;
    let foundSala, foundPrateleira, foundLivro, foundPagina;

    // Variáveis para controlar o tempo
    const tempoInicio = Date.now();
    let ultimaAtualizacao = tempoInicio;
    let ultimasTentativas = 0;

    // Guardar o evento original
    const originalOnClick = btnSearch.onclick;

    // Desabilitar o botão de busca e mudar seu texto
    btnSearch.textContent = 'Cancelar Busca';

    // Criar um novo evento para cancelar a busca
    btnSearch.onclick = function () {
        // Marcar a busca como inativa
        buscaAtiva = false;

        // Esconder estatísticas
        searchStats.style.display = 'none';
        searchResults.style.display = 'none';

        // Atualizar o texto do botão
        btnSearch.textContent = 'Buscar';

        // Mostrar mensagem de cancelamento
        alert('Busca cancelada após ' + tentativas + ' tentativas.');

        // Restaurar o evento original do botão
        btnSearch.onclick = originalOnClick;
    };

    // Mostrar resultados e indicar busca em andamento
    searchResults.style.display = 'block';
    searchCoords.textContent = 'Buscando...';
    btnGotoResult.style.display = 'none';

    // Mostrar e reiniciar estatísticas
    searchStats.style.display = 'block';
    tempoDecorridoElement.textContent = '0';
    tentativasBuscaElement.textContent = '0';
    velocidadeBuscaElement.textContent = '0';
    estimativaTempoElement.textContent = 'calculando...';
    progressBar.style.width = '0%';

    // Função para calcular taxa de busca e estimativa de tempo
    function calcularEstimativa(tentativasAtuais, tempoAtual) {
        const tempoDecorrido = (tempoAtual - tempoInicio) / 1000; // em segundos
        const tentativasPorSegundo = tentativasAtuais / tempoDecorrido;

        // Cálculo mais realista de probabilidade
        // Espaço de busca efetivo baseado no comprimento do texto
        // Usando estimativa mais conservadora
        // Considerando que cada caractere tem 29 possibilidades (a-z, espaço, vírgula, ponto)
        let dificuldade;

        if (searchText.length <= 1) {
            dificuldade = 29; // Apenas um caractere
        } else if (searchText.length <= 3) {
            dificuldade = 1000; // Textos muito curtos
        } else if (searchText.length <= 5) {
            dificuldade = 50000; // Textos curtos
        } else if (searchText.length <= 7) {
            dificuldade = 500000; // Textos médios
        } else if (searchText.length <= 10) {
            dificuldade = 5000000; // Textos longos
        } else {
            dificuldade = 50000000; // Textos muito longos
        }

        // Ajuste baseado no algoritmo (estimativa simplificada)
        let fatorAlgoritmo = 1;

        switch (algoritmoSelecionado) {
            case 'boyer-moore':
                fatorAlgoritmo = 0.7; // Boyer-Moore é geralmente mais rápido
                break;
            case 'rabin-karp':
            case 'kmp':
                fatorAlgoritmo = 0.85; // Rabin-Karp e KMP são moderadamente rápidos
                break;
            case 'naive':
                fatorAlgoritmo = 1.2; // Naive é mais lento
                break;
        }

        dificuldade = dificuldade * fatorAlgoritmo;

        // Tentativas estimadas com base na dificuldade e nas tentativas já realizadas
        const tentativasEstimadas = Math.max(tentativasAtuais * 2, dificuldade);

        // Tempo estimado em segundos
        let tempoEstimado = (tentativasEstimadas - tentativasAtuais) / tentativasPorSegundo;

        // Converter para formato legível
        let unidade = "segundos";
        if (tempoEstimado > 60) {
            tempoEstimado /= 60;
            unidade = "minutos";

            if (tempoEstimado > 60) {
                tempoEstimado /= 60;
                unidade = "horas";

                if (tempoEstimado > 24) {
                    tempoEstimado /= 24;
                    unidade = "dias";

                    if (tempoEstimado > 365) {
                        tempoEstimado /= 365;
                        unidade = "anos";
                    }
                }
            }
        }

        // Calcular progresso (agora baseado em tentativas estimadas mais realistas)
        const progresso = Math.min(99, (tentativasAtuais / tentativasEstimadas) * 100);

        return {
            taxa: tentativasPorSegundo.toFixed(1),
            estimativa: tempoEstimado.toFixed(1) + " " + unidade,
            tempoDecorrido: tempoDecorrido.toFixed(2),
            progresso: progresso.toFixed(6)
        };
    }

    // Função para atualizar as estatísticas na interface
    function atualizarEstatisticas(tentativasAtuais, tempoAtual) {
        const { taxa, estimativa, tempoDecorrido, progresso } = calcularEstimativa(tentativasAtuais, tempoAtual);

        // Atualizar elementos na interface
        tempoDecorridoElement.textContent = tempoDecorrido;
        tentativasBuscaElement.textContent = tentativasAtuais;
        velocidadeBuscaElement.textContent = taxa;
        estimativaTempoElement.textContent = estimativa;

        // Atualizar barra de progresso (limitado a 99% até encontrar)
        progressBar.style.width = progresso + '%';

        return { taxa, estimativa, tempoDecorrido };
    }

    // Função para realizar um lote de buscas
    function realizarLoteDeBuscas() {
        // Se a busca foi cancelada, não continuar
        if (!buscaAtiva) {
            return;
        }

        // Número de tentativas por lote (ajuste para controlar o desempenho)
        const tentativasPorLote = 20;

        // Fazer um lote de tentativas
        for (let i = 0; i < tentativasPorLote && !encontrado && buscaAtiva; i++) {
            tentativas++;

            // Atualizar texto de status a cada 50 tentativas ou 2 segundos
            const tempoAtual = Date.now();
            const tempoDesdeUltimaAtualizacao = tempoAtual - ultimaAtualizacao;

            if (tentativas % 50 === 0 || tempoDesdeUltimaAtualizacao > 2000) {
                const { taxa, estimativa, tempoDecorrido } = atualizarEstatisticas(tentativas, tempoAtual);

                searchCoords.textContent = `Buscando... (${tentativas} tentativas em ${tempoDecorrido}s, 
                    ${taxa} tentativas/s, estimativa: ${estimativa})`;

                ultimaAtualizacao = tempoAtual;
                ultimasTentativas = tentativas;
            }

            // Gerar coordenadas aleatórias
            foundSala = randomHex(8);
            foundPrateleira = Math.floor(Math.random() * 5) + 1;
            foundLivro = Math.floor(Math.random() * 32) + 1;
            foundPagina = Math.floor(Math.random() * 410) + 1;

            // Gerar conteúdo para estas coordenadas
            const conteudo = generateBook(foundSala, foundPrateleira, foundLivro, foundPagina);

            // Verificar se o texto está presente usando o algoritmo selecionado
            let encontradoEm = -1;

            switch (algoritmoSelecionado) {
                case 'boyer-moore':
                    encontradoEm = boyerMooreSearch(conteudo, searchText);
                    break;
                case 'rabin-karp':
                    encontradoEm = rabinKarpSearch(conteudo, searchText);
                    break;
                case 'kmp':
                    encontradoEm = kmpSearch(conteudo, searchText);
                    break;
                case 'naive':
                    encontradoEm = naiveSearch(conteudo, searchText);
                    break;
                default:
                    encontradoEm = boyerMooreSearch(conteudo, searchText);
            }

            if (encontradoEm !== -1) {
                encontrado = true;
                
                // Garantir que o texto seja inserido na posição exata onde foi encontrado
                const novoConteudo = generateBook(foundSala, foundPrateleira, foundLivro, foundPagina, searchText);
                
                // Armazenar coordenadas com o texto inserido
                if (!window.directHashMap) {
                    window.directHashMap = {};
                }
                const coordKey = `${searchText}-${foundSala}-${foundPrateleira}-${foundLivro}-${foundPagina}`;
                window.directHashMap[coordKey] = searchText;
            }
        }

        // Verificar se terminou a busca ou continuar
        if (encontrado) {
            // Calcular tempo total decorrido
            const tempoFinal = Date.now();
            const tempoTotal = ((tempoFinal - tempoInicio) / 1000).toFixed(2);

            // Atualizar estatísticas finais
            tempoDecorridoElement.textContent = tempoTotal;
            tentativasBuscaElement.textContent = tentativas;
            velocidadeBuscaElement.textContent = (tentativas / tempoTotal).toFixed(1);
            estimativaTempoElement.textContent = 'Concluído!';
            progressBar.style.width = '100%';

            // Texto encontrado!
            searchCoords.textContent = `Sala ${foundSala}, Prateleira ${foundPrateleira}, Livro ${foundLivro}, Página ${foundPagina}
                (encontrado em ${tempoTotal} segundos após ${tentativas} tentativas)`;

            // Mostrar qual algoritmo foi usado
            let nomeAlgoritmo;
            switch (algoritmoSelecionado) {
                case 'boyer-moore':
                    nomeAlgoritmo = 'Boyer-Moore';
                    break;
                case 'rabin-karp':
                    nomeAlgoritmo = 'Rabin-Karp';
                    break;
                case 'kmp':
                    nomeAlgoritmo = 'Knuth-Morris-Pratt (KMP)';
                    break;
                case 'naive':
                    nomeAlgoritmo = 'Naive Search (Força Bruta)';
                    break;
                default:
                    nomeAlgoritmo = 'Boyer-Moore';
            }
            usedAlgorithm.textContent = nomeAlgoritmo;

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

// Event listener para o botão de cancelar busca
document.getElementById('btn-cancel-search').addEventListener('click', function () {
    // Salvar informação que devemos voltar para a tela de busca
    localStorage.setItem('redirectToSearch', 'true');

    // Recarregar a página
    window.location.reload();
});

// Verificar no carregamento se deve ir para a tela de busca
document.addEventListener('DOMContentLoaded', function () {
    // Verificar se precisa voltar para a tela de busca
    if (localStorage.getItem('redirectToSearch') === 'true') {
        // Limpar o flag
        localStorage.removeItem('redirectToSearch');

        // Redirecionar para a tela de busca após um pequeno delay
        setTimeout(function () {
            linkSearch.click();
        }, 100);
    }
});

// Inicializar com a seção Sobre e depois mostrar um livro aleatório
linkAbout.click();
setTimeout(() => {
    btnRandom.click();
}, 3000);
