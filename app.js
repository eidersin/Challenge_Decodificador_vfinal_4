document.addEventListener('DOMContentLoaded', function() {
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    const cryptBtn = document.querySelector('.crypt-btn');
    const decryptBtn = document.querySelector('.decrypt-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const outputMessage = document.querySelector('.output-message');
    const outputText = document.querySelector('.output-text');
    const textarea = document.getElementById('texto');
    const fileInput = document.getElementById('fileInput');

    // Adicionar listener para alternar entre os temas
    themeToggleCheckbox.addEventListener('change', function() {
        document.body.classList.toggle('dark-theme');
    });

    // Função de validação de texto: Apenas letras minúsculas e sem acento
    function validarTexto(texto) {
        const regex = /^[a-z\s]*$/;
        return regex.test(texto);
    }

    // Função de criptografar texto
    function encryptText(text) {
        const substituicoes = {
            'e': 'enter',
            'i': 'imes',
            'a': 'ai',
            'o': 'ober',
            'u': 'ufat'
        };
        let encryptedText = text;
        for (const [original, substituto] of Object.entries(substituicoes)) {
            const regex = new RegExp(original, 'g');
            encryptedText = encryptedText.replace(regex, substituto);
        }
        return encryptedText;
    }

    // Função de descriptografar texto
    function decryptText(text) {
        const substituicoes = {
            'enter': 'e',
            'imes': 'i',
            'ai': 'a',
            'ober': 'o',
            'ufat': 'u'
        };
        let decryptedText = text;
        for (const [substituto, original] of Object.entries(substituicoes)) {
            const regex = new RegExp(substituto, 'g');
            decryptedText = decryptedText.replace(regex, original);
        }
        return decryptedText;
    }

    // Atualizar a saída de texto
    function updateOutputText(text) {
        outputText.textContent = text;
        outputMessage.style.display = text ? 'none' : 'block';
    }

    // Listener para criptografar
    cryptBtn.addEventListener('click', function() {
        const text = textarea.value;
        if (!validarTexto(text)) {
            alert('Por favor, digite apenas letras minúsculas e sem acento.');
            return;
        }
        const encryptedText = encryptText(text);
        updateOutputText(encryptedText);
    });

    // Listener para descriptografar
    decryptBtn.addEventListener('click', function() {
        const text = textarea.value;
        if (!validarTexto(text)) {
            alert('Por favor, digite apenas letras minúsculas e sem acento.');
            return;
        }
        const decryptedText = decryptText(text);
        updateOutputText(decryptedText);
    });

    // Listener para limpar
    clearBtn.addEventListener('click', function() {
        textarea.value = '';
        updateOutputText('');
    });

    // Listener para copiar
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(outputText.textContent).then(function() {
            alert('Texto copiado para a área de transferência!');
        }, function() {
            alert('Falha ao copiar o texto.');
        });
    });

    // Listener para upload de arquivo
    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const text = e.target.result;
            if (!validarTexto(text)) {
                alert('O arquivo contém caracteres inválidos. Por favor, carregue um arquivo com apenas letras minúsculas e sem acento.');
                return;
            }
            textarea.value = text;
        };

        reader.readAsText(file);
    });
});
