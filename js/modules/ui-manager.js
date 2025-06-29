export class UIManager {
    constructor() {
        this.currentInputMethod = 'text';
        this.outputVisible = false;
    }

    init() {
        this.updateCharCounter(0);
        this.setupInputMethodToggle();
    }

    setupInputMethodToggle() {
        const textInput = document.getElementById('text-input');
        const fileInput = document.getElementById('file-input');
        
        // Initially show text input
        textInput.classList.remove('hidden');
        fileInput.classList.add('hidden');
    }

    switchInputMethod(method) {
        const textInput = document.getElementById('text-input');
        const fileInput = document.getElementById('file-input');
        const optionBtns = document.querySelectorAll('.option-btn');
        
        // Update active button
        optionBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.input === method);
        });
        
        // Switch input containers
        if (method === 'text') {
            textInput.classList.remove('hidden');
            fileInput.classList.add('hidden');
            this.currentInputMethod = 'text';
            
            // Focus on textarea
            setTimeout(() => {
                document.getElementById('texto').focus();
            }, 100);
        } else {
            textInput.classList.add('hidden');
            fileInput.classList.remove('hidden');
            this.currentInputMethod = 'file';
        }
    }

    updateCharCounter(count) {
        const counter = document.getElementById('char-count');
        if (counter) {
            counter.textContent = count;
            
            // Add warning color if approaching limit
            const maxLength = 5000;
            const percentage = count / maxLength;
            
            if (percentage > 0.9) {
                counter.style.color = 'var(--error-color)';
            } else if (percentage > 0.8) {
                counter.style.color = 'var(--warning-color)';
            } else {
                counter.style.color = 'var(--text-muted)';
            }
        }
    }

    updateValidationState(isValid, text) {
        const textarea = document.getElementById('texto');
        const encryptBtn = document.getElementById('encrypt-btn');
        const decryptBtn = document.getElementById('decrypt-btn');
        
        if (text.trim() === '') {
            // Empty text - neutral state
            textarea.style.borderColor = 'var(--border-color)';
            encryptBtn.disabled = true;
            decryptBtn.disabled = true;
        } else if (isValid) {
            // Valid text - success state
            textarea.style.borderColor = 'var(--success-color)';
            encryptBtn.disabled = false;
            decryptBtn.disabled = false;
        } else {
            // Invalid text - error state
            textarea.style.borderColor = 'var(--error-color)';
            encryptBtn.disabled = true;
            decryptBtn.disabled = true;
        }
    }

    showOutput(text, title = 'Resultado') {
        const placeholder = document.getElementById('output-placeholder');
        const content = document.getElementById('output-content');
        const outputText = document.getElementById('output-text');
        const copyBtn = document.getElementById('copy-btn');
        const downloadBtn = document.getElementById('download-btn');
        
        // Hide placeholder and show content
        placeholder.classList.add('hidden');
        content.classList.remove('hidden');
        
        // Set the output text
        outputText.textContent = text;
        
        // Update statistics
        this.updateOutputStats(text);
        
        // Enable action buttons
        copyBtn.disabled = false;
        downloadBtn.disabled = false;
        
        this.outputVisible = true;
        
        // Smooth scroll to output
        content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    clearOutput() {
        const placeholder = document.getElementById('output-placeholder');
        const content = document.getElementById('output-content');
        const outputText = document.getElementById('output-text');
        const copyBtn = document.getElementById('copy-btn');
        const downloadBtn = document.getElementById('download-btn');
        
        // Show placeholder and hide content
        placeholder.classList.remove('hidden');
        content.classList.add('hidden');
        
        // Clear text
        outputText.textContent = '';
        
        // Disable action buttons
        copyBtn.disabled = true;
        downloadBtn.disabled = true;
        
        this.outputVisible = false;
    }

    updateOutputStats(text) {
        const charCount = document.getElementById('output-char-count');
        const wordCount = document.getElementById('output-word-count');
        
        if (charCount) {
            charCount.textContent = text.length;
        }
        
        if (wordCount) {
            const words = text.trim().split(/\s+/).filter(word => word.length > 0);
            wordCount.textContent = words.length;
        }
    }

    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.remove('hidden');
        
        // Disable all action buttons
        const buttons = document.querySelectorAll('.action-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
        });
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.add('hidden');
        
        // Re-enable buttons based on current state
        const text = document.getElementById('texto').value;
        const isValid = text.trim() && /^[a-z\s]*$/.test(text);
        
        document.getElementById('encrypt-btn').disabled = !isValid;
        document.getElementById('decrypt-btn').disabled = !isValid;
        document.getElementById('clear-btn').disabled = false;
        document.getElementById('paste-btn').disabled = false;
        
        if (this.outputVisible) {
            document.getElementById('copy-btn').disabled = false;
            document.getElementById('download-btn').disabled = false;
        }
    }

    // Add visual feedback for button interactions
    addButtonFeedback(button, type = 'success') {
        const originalText = button.innerHTML;
        
        if (type === 'success') {
            button.innerHTML = '<span class="icon">✓</span>Sucesso!';
            button.style.background = 'var(--success-color)';
        } else if (type === 'error') {
            button.innerHTML = '<span class="icon">✗</span>Erro!';
            button.style.background = 'var(--error-color)';
        }
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 1500);
    }

    // Animate elements
    animateElement(element, animation = 'pulse') {
        element.style.animation = `${animation} 0.3s ease-in-out`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, 300);
    }
}