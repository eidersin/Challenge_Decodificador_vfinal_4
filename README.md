# Projeto ONE - Criptografia e Descriptografia

Este é um projeto desenvolvido por [Wanderson Teixeira Sousa](https://www.linkedin.com/in/dersonts/) como parte do programa ONE - Oracle Next Education. A aplicação permite criptografar e descriptografar textos utilizando substituições específicas para cada letra minúscula sem acentos. A interface é simples e responsiva, adaptando-se a diferentes tamanhos de tela.

## Funcionalidades

### 1. Criptografia de Texto
Substitui letras minúsculas específicas no texto de entrada por cadeias de caracteres predefinidas:
- `e` -> `enter`
- `i` -> `imes`
- `a` -> `ai`
- `o` -> `ober`
- `u` -> `ufat`

### 2. Descriptografia de Texto
Reverte as substituições realizadas durante a criptografia para obter o texto original:
- `enter` -> `e`
- `imes` -> `i`
- `ai` -> `a`
- `ober` -> `o`
- `ufat` -> `u`

### 3. Validação de Texto
Garante que o texto de entrada contenha apenas letras minúsculas e espaços, rejeitando quaisquer caracteres acentuados ou maiúsculos.

### 4. Carregamento de Arquivo
Permite que o usuário carregue um arquivo de texto contendo o texto a ser criptografado ou descriptografado. O conteúdo do arquivo é validado para garantir que só contenha caracteres permitidos.

### 5. Copiar Texto
Copia o texto criptografado ou descriptografado para a área de transferência do sistema.

### 6. Limpar Texto
Limpa o campo de entrada e o campo de saída, removendo qualquer texto presente.

### 7. Alternar Tema
Permite alternar entre o tema claro e o tema escuro para melhor usabilidade.

### 8. Interface Responsiva
A interface adapta-se automaticamente a diferentes tamanhos de tela, garantindo uma experiência de usuário consistente em dispositivos móveis e desktops.