/**
 * Pattern Matching and URL Generation
 * 
 * Handles the core business logic for extracting image file patterns
 * from user input and converting them to valid URLs.
 */

// Regex pattern to match image file paths in format: YYYY_*image*.png
const IMAGE_REGEX = /\b\d{4}_.*?image.*?\.png\b/g;

// Available server environments with user-friendly labels
const URL_PREFIXES = [
    { value: "http://papasubstr003.recondo.vci/", label: "papasubstr003" },
    { value: "http://papasubstr001.recondo.vci/", label: "papasubstr001" }
    
];

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - Raw user input
 * @returns {string} Sanitized input safe for processing
 */
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Validates user input against expected image file pattern
 * @param {string} userInput - Input text to validate
 * @returns {boolean} True if input contains valid image file patterns
 */
function validateUserInput(userInput) {
    if (!userInput || typeof userInput !== 'string') return false;
    const sanitized = sanitizeInput(userInput);
    return !!sanitized.match(IMAGE_REGEX);
}

/**
 * Generates complete URLs from image file patterns found in user input
 * Extracts image file names, converts underscores to forward slashes for URLs,
 * removes duplicates, and validates resulting URLs
 * @param {string} userInput - Text containing image file patterns
 * @returns {string[]} Array of valid, complete URLs
 */
function generateURL(userInput) {
    const selectedPrefix = document.getElementById('serverSelect').value;
    
    // Extract all image file names, convert underscores to URL path separators
    const imageNames = Array.from(new Set(
        Array.from(userInput.matchAll(IMAGE_REGEX), match => match[0].replace(/_/g, '/'))
    ));
    
    // Generate URLs and filter out any invalid ones
    return imageNames
        .map(imageName => `${selectedPrefix}${imageName}`)
        .filter(url => {
            try {
                new URL(url);  // Validate URL format
                return true;
            } catch {
                console.warn('Invalid URL generated:', url);
                return false;
            }
        });
}
