import { CryptoEngine } from './modules/crypto-engine.js';
import { UIManager } from './modules/ui-manager.js';
import { FileHandler } from './modules/file-handler.js';
import { ThemeManager } from './modules/theme-manager.js';
import { NotificationManager } from './modules/notification-manager.js';
import { ValidationManager } from './modules/validation-manager.js';

class CryptoTextApp {
    constructor() {
        this.cryptoEngine = new CryptoEngine();
        this.uiManager = new UIManager();
        this.fileHandler = new FileHandler();
        this.themeManager = new ThemeManager();
        this.notificationManager = new NotificationManager();
        this.validationManager = new ValidationManager();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.themeManager.init();
        this.uiManager.init();
        
        // Show welcome message
        setTimeout(() => {
            this.notificationManager.show(
                'Bem-vindo!',
                'Digite seu texto e use os botões para criptografar ou descriptografar.',
                'success'
            );
        }, 1000);
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle-checkbox').addEventListener('change', (e) => {
            this.themeManager.toggle();
        });

        // Input method toggle
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.uiManager.switchInputMethod(e.target.dataset.input);
            });
        });

        // Text input events
        const textArea = document.getElementById('texto');
        textArea.addEventListener('input', (e) => {
            this.handleTextInput(e.target.value);
        });

        textArea.addEventListener('paste', (e) => {
            setTimeout(() => {
                this.handleTextInput(e.target.value);
            }, 10);
        });

        // File handling
        this.fileHandler.init((content) => {
            this.handleFileContent(content);
        });

        // Action buttons
        document.getElementById('encrypt-btn').addEventListener('click', () => {
            this.handleEncryption();
        });

        document.getElementById('decrypt-btn').addEventListener('click', () => {
            this.handleDecryption();
        });

        document.getElementById('clear-btn').addEventListener('click', () => {
            this.handleClear();
        });

        document.getElementById('paste-btn').addEventListener('click', () => {
            this.handlePaste();
        });

        document.getElementById('copy-btn').addEventListener('click', () => {
            this.handleCopy();
        });

        document.getElementById('download-btn').addEventListener('click', () => {
            this.handleDownload();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    handleTextInput(text) {
        this.uiManager.updateCharCounter(text.length);
        
        // Real-time validation feedback
        const isValid = this.validationManager.validateText(text);
        this.uiManager.updateValidationState(isValid, text);
        
        // Clear output if input is empty
        if (!text.trim()) {
            this.uiManager.clearOutput();
        }
    }

    handleFileContent(content) {
        const textArea = document.getElementById('texto');
        textArea.value = content;
        this.handleTextInput(content);
        
        this.notificationManager.show(
            'Arquivo carregado!',
            'O conteúdo do arquivo foi carregado com sucesso.',
            'success'
        );
    }

    async handleEncryption() {
        const text = this.getCurrentText();
        
        if (!this.validateInput(text)) return;

        this.uiManager.showLoading();
        
        try {
            // Simulate processing time for better UX
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const encrypted = this.cryptoEngine.encrypt(text);
            this.uiManager.showOutput(encrypted, 'Texto Criptografado');
            
            this.notificationManager.show(
                'Criptografia concluída!',
                'Seu texto foi criptografado com sucesso.',
                'success'
            );
        } catch (error) {
            this.notificationManager.show(
                'Erro na criptografia',
                'Ocorreu um erro ao criptografar o texto.',
                'error'
            );
        } finally {
            this.uiManager.hideLoading();
        }
    }

    async handleDecryption() {
        const text = this.getCurrentText();
        
        if (!this.validateInput(text)) return;

        this.uiManager.showLoading();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const decrypted = this.cryptoEngine.decrypt(text);
            this.uiManager.showOutput(decrypted, 'Texto Descriptografado');
            
            this.notificationManager.show(
                'Descriptografia concluída!',
                'Seu texto foi descriptografado com sucesso.',
                'success'
            );
        } catch (error) {
            this.notificationManager.show(
                'Erro na descriptografia',
                'Ocorreu um erro ao descriptografar o texto.',
                'error'
            );
        } finally {
            this.uiManager.hideLoading();
        }
    }

    handleClear() {
        document.getElementById('texto').value = '';
        this.uiManager.clearOutput();
        this.uiManager.updateCharCounter(0);
        this.fileHandler.clearFile();
        
        this.notificationManager.show(
            'Conteúdo limpo',
            'Todo o conteúdo foi removido.',
            'success'
        );
    }

    async handlePaste() {
        try {
            const text = await navigator.clipboard.readText();
            const textArea = document.getElementById('texto');
            textArea.value = text;
            this.handleTextInput(text);
            
            this.notificationManager.show(
                'Texto colado!',
                'O texto foi colado da área de transferência.',
                'success'
            );
        } catch (error) {
            this.notificationManager.show(
                'Erro ao colar',
                'Não foi possível acessar a área de transferência.',
                'error'
            );
        }
    }

    async handleCopy() {
        const outputText = document.getElementById('output-text').textContent;
        
        if (!outputText) {
            this.notificationManager.show(
                'Nada para copiar',
                'Não há texto no resultado para copiar.',
                'warning'
            );
            return;
        }

        try {
            await navigator.clipboard.writeText(outputText);
            this.notificationManager.show(
                'Texto copiado!',
                'O resultado foi copiado para a área de transferência.',
                'success'
            );
        } catch (error) {
            this.notificationManager.show(
                'Erro ao copiar',
                'Não foi possível copiar o texto.',
                'error'
            );
        }
    }

    handleDownload() {
        const outputText = document.getElementById('output-text').textContent;
        
        if (!outputText) {
            this.notificationManager.show(
                'Nada para baixar',
                'Não há texto no resultado para baixar.',
                'warning'
            );
            return;
        }

        try {
            const blob = new Blob([outputText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cryptotext-result-${new Date().toISOString().slice(0, 10)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.notificationManager.show(
                'Download iniciado!',
                'O arquivo está sendo baixado.',
                'success'
            );
        } catch (error) {
            this.notificationManager.show(
                'Erro no download',
                'Não foi possível baixar o arquivo.',
                'error'
            );
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter: Encrypt
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.handleEncryption();
        }
        
        // Ctrl/Cmd + Shift + Enter: Decrypt
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            this.handleDecryption();
        }
        
        // Ctrl/Cmd + K: Clear
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.handleClear();
        }
        
        // Ctrl/Cmd + D: Download
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            this.handleDownload();
        }
    }

    getCurrentText() {
        return document.getElementById('texto').value;
    }

    validateInput(text) {
        if (!text.trim()) {
            this.notificationManager.show(
                'Texto vazio',
                'Por favor, digite algum texto antes de continuar.',
                'warning'
            );
            return false;
        }

        if (!this.validationManager.validateText(text)) {
            this.notificationManager.show(
                'Texto inválido',
                'O texto deve conter apenas letras minúsculas sem acentos e espaços.',
                'error'
            );
            return false;
        }

        return true;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CryptoTextApp();
});