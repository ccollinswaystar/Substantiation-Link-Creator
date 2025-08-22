/**
 * Utility Functions
 * 
 * Common helper functions used throughout the application.
 * Includes DOM creation helpers and clipboard operations.
 */

/**
 * Creates a new DOM element with optional class and attributes
 * @param {string} tag - HTML tag name
 * @param {string} className - CSS class name(s) to apply
 * @param {Object} attributes - Key-value pairs of attributes to set
 * @returns {HTMLElement} The created element
 */
function createElement(tag, className = '', attributes = {}) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
}

/**
 * Creates an image element with consistent sizing and attributes
 * @param {string} src - Image source path
 * @param {string} alt - Alt text for accessibility
 * @param {number} size - Width and height in pixels
 * @returns {HTMLImageElement} The created image element
 */
function createIcon(src, alt, size) {
    return createElement('img', '', { src, alt, width: size, height: size });
}

/**
 * Copies text to clipboard with fallback for older browsers
 * @param {string} text - Text to copy to clipboard
 */
function copyToClipboard(text) {
    // Modern clipboard API with fallback for older browsers
    if (!navigator.clipboard) {
        // Fallback method using deprecated document.execCommand
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        triggerSubmitSuccess('Copied!', CONFIG.DEFAULT_MESSAGE_DURATION);
        return;
    }
    
    // Modern async clipboard API
    navigator.clipboard.writeText(text)
        .then(() => triggerSubmitSuccess('Copied!', CONFIG.DEFAULT_MESSAGE_DURATION))
        .catch(() => triggerSubmitError('Copy failed', CONFIG.DEFAULT_MESSAGE_DURATION));
}

/**
 * Copies all links from a result group to clipboard (newline separated)
 * @param {HTMLElement} groupContainer - The group container element
 */
function copyGroupLinks(groupContainer) {
    const links = Array.from(groupContainer.querySelectorAll('a')).map(link => link.href);
    copyToClipboard(links.join('\n'));
}
