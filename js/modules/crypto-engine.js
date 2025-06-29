export class CryptoEngine {
    constructor() {
        this.encryptionRules = {
            'e': 'enter',
            'i': 'imes',
            'a': 'ai',
            'o': 'ober',
            'u': 'ufat'
        };
        
        this.decryptionRules = {
            'enter': 'e',
            'imes': 'i',
            'ai': 'a',
            'ober': 'o',
            'ufat': 'u'
        };
    }

    encrypt(text) {
        if (!text) return '';
        
        let result = text;
        
        // Apply encryption rules in order
        for (const [original, replacement] of Object.entries(this.encryptionRules)) {
            const regex = new RegExp(original, 'g');
            result = result.replace(regex, replacement);
        }
        
        return result;
    }

    decrypt(text) {
        if (!text) return '';
        
        let result = text;
        
        // Apply decryption rules in reverse order for better accuracy
        // Sort by length (longest first) to avoid partial replacements
        const sortedRules = Object.entries(this.decryptionRules)
            .sort(([a], [b]) => b.length - a.length);
        
        for (const [encrypted, original] of sortedRules) {
            const regex = new RegExp(encrypted, 'g');
            result = result.replace(regex, original);
        }
        
        return result;
    }

    // Get encryption statistics
    getEncryptionStats(originalText, encryptedText) {
        return {
            originalLength: originalText.length,
            encryptedLength: encryptedText.length,
            compressionRatio: encryptedText.length / originalText.length,
            substitutions: this.countSubstitutions(originalText)
        };
    }

    countSubstitutions(text) {
        const counts = {};
        
        for (const [char, replacement] of Object.entries(this.encryptionRules)) {
            const matches = text.match(new RegExp(char, 'g'));
            counts[char] = matches ? matches.length : 0;
        }
        
        return counts;
    }

    // Validate if text can be decrypted (contains encrypted patterns)
    canDecrypt(text) {
        return Object.keys(this.decryptionRules).some(pattern => 
            text.includes(pattern)
        );
    }

    // Get suggested operation based on text content
    getSuggestedOperation(text) {
        const hasEncryptedPatterns = this.canDecrypt(text);
        const hasOriginalVowels = /[aeiou]/.test(text);
        
        if (hasEncryptedPatterns && !hasOriginalVowels) {
            return 'decrypt';
        } else if (!hasEncryptedPatterns && hasOriginalVowels) {
            return 'encrypt';
        }
        
        return 'both'; // Could be either
    }
}