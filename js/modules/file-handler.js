export class FileHandler {
    constructor() {
        this.maxFileSize = 1024 * 1024; // 1MB
        this.allowedTypes = ['text/plain'];
        this.onFileLoad = null;
    }

    init(onFileLoadCallback) {
        this.onFileLoad = onFileLoadCallback;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const fileInput = document.getElementById('fileInput');
        const dropZone = document.getElementById('file-drop-zone');
        const removeBtn = document.getElementById('remove-file');

        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        // Drag and drop
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });

        // Remove file
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearFile();
        });
    }

    handleFileSelect(file) {
        if (!file) return;

        // Validate file
        const validation = this.validateFile(file);
        if (!validation.valid) {
            this.showError(validation.error);
            return;
        }

        // Show file info
        this.showFileInfo(file);

        // Read file content
        this.readFile(file);
    }

    validateFile(file) {
        // Check file type
        if (!this.allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: 'Apenas arquivos de texto (.txt) são permitidos.'
            };
        }

        // Check file size
        if (file.size > this.maxFileSize) {
            return {
                valid: false,
                error: `O arquivo é muito grande. Tamanho máximo: ${this.formatFileSize(this.maxFileSize)}.`
            };
        }

        return { valid: true };
    }

    readFile(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target.result;
            
            // Validate content
            if (!this.validateContent(content)) {
                this.showError('O arquivo contém caracteres inválidos. Apenas letras minúsculas sem acentos são permitidas.');
                return;
            }

            // Call the callback with the content
            if (this.onFileLoad) {
                this.onFileLoad(content);
            }
        };

        reader.onerror = () => {
            this.showError('Erro ao ler o arquivo. Tente novamente.');
        };

        reader.readAsText(file, 'UTF-8');
    }

    validateContent(content) {
        // Check if content contains only allowed characters
        const regex = /^[a-z\s\n\r]*$/;
        return regex.test(content);
    }

    showFileInfo(file) {
        const dropZone = document.getElementById('file-drop-zone');
        const fileInfo = document.getElementById('file-info');
        const fileName = fileInfo.querySelector('.file-name');

        dropZone.classList.add('hidden');
        fileInfo.classList.remove('hidden');

        fileName.textContent = `${file.name} (${this.formatFileSize(file.size)})`;
    }

    clearFile() {
        const fileInput = document.getElementById('fileInput');
        const dropZone = document.getElementById('file-drop-zone');
        const fileInfo = document.getElementById('file-info');

        // Clear input
        fileInput.value = '';

        // Show drop zone, hide file info
        dropZone.classList.remove('hidden');
        fileInfo.classList.add('hidden');

        // Clear textarea
        document.getElementById('texto').value = '';
        
        // Update UI
        const uiManager = window.uiManager;
        if (uiManager) {
            uiManager.updateCharCounter(0);
            uiManager.clearOutput();
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showError(message) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'toast error';
        notification.innerHTML = `
            <span class="toast-icon">⚠️</span>
            <div class="toast-content">
                <p class="toast-title">Erro no arquivo</p>
                <p class="toast-message">${message}</p>
            </div>
            <button class="toast-close">✕</button>
        `;

        const container = document.getElementById('toast-container');
        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);

        // Manual close
        notification.querySelector('.toast-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    // Export current content as file
    exportContent(content, filename = 'cryptotext-export.txt') {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
}