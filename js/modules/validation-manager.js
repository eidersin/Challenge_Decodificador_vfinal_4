export class ValidationManager {
    constructor() {
        this.rules = {
            allowedChars: /^[a-z\s]*$/,
            minLength: 1,
            maxLength: 5000
        };
        
        this.errorMessages = {
            empty: 'O texto não pode estar vazio.',
            invalidChars: 'Apenas letras minúsculas (a-z) e espaços são permitidos.',
            tooShort: `O texto deve ter pelo menos ${this.rules.minLength} caractere.`,
            tooLong: `O texto deve ter no máximo ${this.rules.maxLength} caracteres.`,
            onlySpaces: 'O texto não pode conter apenas espaços.'
        };
    }

    validateText(text) {
        const validation = this.getValidationResult(text);
        return validation.isValid;
    }

    getValidationResult(text) {
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };

        // Check if empty
        if (!text || text.length === 0) {
            result.isValid = false;
            result.errors.push(this.errorMessages.empty);
            return result;
        }

        // Check if only spaces
        if (text.trim().length === 0) {
            result.isValid = false;
            result.errors.push(this.errorMessages.onlySpaces);
            return result;
        }

        // Check length
        if (text.length < this.rules.minLength) {
            result.isValid = false;
            result.errors.push(this.errorMessages.tooShort);
        }

        if (text.length > this.rules.maxLength) {
            result.isValid = false;
            result.errors.push(this.errorMessages.tooLong);
        }

        // Check allowed characters
        if (!this.rules.allowedChars.test(text)) {
            result.isValid = false;
            result.errors.push(this.errorMessages.invalidChars);
            
            // Provide specific feedback about invalid characters
            const invalidChars = this.findInvalidCharacters(text);
            if (invalidChars.length > 0) {
                result.errors.push(`Caracteres inválidos encontrados: ${invalidChars.join(', ')}`);
            }
        }

        // Add warnings for potential issues
        if (text.length > this.rules.maxLength * 0.8) {
            result.warnings.push('Você está próximo do limite de caracteres.');
        }

        return result;
    }

    findInvalidCharacters(text) {
        const invalidChars = new Set();
        
        for (const char of text) {
            if (!this.rules.allowedChars.test(char)) {
                invalidChars.add(char === ' ' ? '[espaço]' : char);
            }
        }
        
        return Array.from(invalidChars);
    }

    // Real-time validation with suggestions
    validateWithSuggestions(text) {
        const result = this.getValidationResult(text);
        
        if (!result.isValid) {
            result.suggestions = this.generateSuggestions(text);
        }
        
        return result;
    }

    generateSuggestions(text) {
        const suggestions = [];
        
        // Suggest removing invalid characters
        const cleanText = text.replace(/[^a-z\s]/g, '');
        if (cleanText !== text) {
            suggestions.push({
                type: 'fix',
                description: 'Remover caracteres inválidos',
                action: () => cleanText
            });
        }
        
        // Suggest converting to lowercase
        const lowerText = text.toLowerCase();
        if (lowerText !== text && /^[a-zA-Z\s]*$/.test(text)) {
            suggestions.push({
                type: 'fix',
                description: 'Converter para minúsculas',
                action: () => lowerText
            });
        }
        
        // Suggest removing accents
        const noAccentText = this.removeAccents(text);
        if (noAccentText !== text) {
            suggestions.push({
                type: 'fix',
                description: 'Remover acentos',
                action: () => noAccentText
            });
        }
        
        return suggestions;
    }

    removeAccents(text) {
        const accentMap = {
            'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'ä': 'a',
            'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
            'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
            'ó': 'o', 'ò': 'o', 'õ': 'o', 'ô': 'o', 'ö': 'o',
            'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
            'ç': 'c', 'ñ': 'n'
        };
        
        return text.replace(/[áàãâäéèêëíìîïóòõôöúùûüçñ]/g, char => accentMap[char] || char);
    }

    // Validate file content
    validateFileContent(content) {
        // More lenient validation for files (allow line breaks)
        const fileRules = {
            allowedChars: /^[a-z\s\n\r]*$/,
            maxLength: 50000 // Larger limit for files
        };
        
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };
        
        if (!content || content.trim().length === 0) {
            result.isValid = false;
            result.errors.push('O arquivo está vazio.');
            return result;
        }
        
        if (content.length > fileRules.maxLength) {
            result.isValid = false;
            result.errors.push(`O arquivo é muito grande. Máximo: ${fileRules.maxLength} caracteres.`);
        }
        
        if (!fileRules.allowedChars.test(content)) {
            result.isValid = false;
            result.errors.push('O arquivo contém caracteres inválidos.');
        }
        
        return result;
    }

    // Get character statistics
    getTextStatistics(text) {
        const stats = {
            totalChars: text.length,
            totalWords: text.trim().split(/\s+/).filter(word => word.length > 0).length,
            totalLines: text.split('\n').length,
            vowels: (text.match(/[aeiou]/g) || []).length,
            consonants: (text.match(/[bcdfghjklmnpqrstvwxyz]/g) || []).length,
            spaces: (text.match(/\s/g) || []).length
        };
        
        // Calculate encryption potential
        stats.encryptionPotential = stats.vowels; // Number of characters that will be encrypted
        
        return stats;
    }

    // Validate encryption readiness
    isReadyForEncryption(text) {
        const validation = this.getValidationResult(text);
        const stats = this.getTextStatistics(text);
        
        return {
            ready: validation.isValid && stats.vowels > 0,
            reason: validation.isValid 
                ? (stats.vowels === 0 ? 'O texto não contém vogais para criptografar.' : 'Pronto para criptografia.')
                : validation.errors[0]
        };
    }

    // Validate decryption readiness
    isReadyForDecryption(text) {
        const validation = this.getValidationResult(text);
        const hasEncryptedPatterns = /enter|imes|ai|ober|ufat/.test(text);
        
        return {
            ready: validation.isValid && hasEncryptedPatterns,
            reason: validation.isValid 
                ? (hasEncryptedPatterns ? 'Pronto para descriptografia.' : 'O texto não parece estar criptografado.')
                : validation.errors[0]
        };
    }
}