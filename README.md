# Biblioteca de Alexandria Virtual

Uma implementação digital da Biblioteca de Babel, conceito criado por Jorge Luis Borges. Este projeto permite explorar uma biblioteca virtual que contém todos os textos possíveis que podem ser escritos com o alfabeto latino.

## Características

- Interface intuitiva e responsiva
- Geração determinística de textos baseada em coordenadas
- Sistema de navegação por coordenadas (sala, prateleira, livro e página)
- Funcionalidade de busca de texto
- Design inspirado em bibliotecas antigas

## Como Usar

1. **Explorar Livros**
   - Use as coordenadas para navegar pela biblioteca
   - Cada livro é identificado por:
     - Sala (código hexadecimal de 8 caracteres)
     - Prateleira (1-5)
     - Livro (1-32)
     - Página (1-410)

2. **Gerar Livros Aleatórios**
   - Clique no botão "Livro Aleatório" para gerar coordenadas aleatórias
   - O mesmo livro será sempre gerado para as mesmas coordenadas

3. **Buscar Textos**
   - Use a seção de busca para encontrar textos específicos
   - O sistema retornará as coordenadas onde o texto foi "encontrado"

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)

## Sobre o Projeto

Este projeto é uma demonstração conceitual inspirada na obra "A Biblioteca de Babel" de Jorge Luis Borges. Na história original, a biblioteca contém todos os livros possíveis de 410 páginas, cada um com 40 linhas por página e 80 caracteres por linha.

A versão digital implementa um algoritmo determinístico que gera texto pseudoaleatório baseado nas coordenadas fornecidas, permitindo que o mesmo texto seja sempre gerado para as mesmas coordenadas.

## Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. 