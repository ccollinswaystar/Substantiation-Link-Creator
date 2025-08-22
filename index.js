/**
 * RPA Test Image Link Generator - Main Application
 * 
 * This application extracts image file paths from RPA run logs and converts them
 * into clickable URLs for easy access to substantiation images. It supports
 * multiple server environments and provides features like grouping, copying,
 * and exporting generated links.
 * 
 * Author: Chad Collins
 * Purpose: Streamline access to RPA test image substantiation files
 */

// Application configuration
const DEFAULT_MESSAGE_DURATION = 1500;

// Global timeout reference for submit button state management
let submitBtnTimeout;

/**
 * Application initialization and main event handling
 */
document.addEventListener('DOMContentLoaded', () => {
    buildAppLayout();
    setupThemeToggle();
    loadSavedGroups();
    toggleResultsVisibility();
    setupEventDelegation();
});

/**
 * Event delegation setup for performance optimization
 * Uses a single event listener to handle clicks for dynamically created elements
 */
function setupEventDelegation() {
    document.addEventListener('click', (event) => {
        const target = event.target;
        
        // Handle individual link copy icon clicks
        if (target.classList.contains('copy-icon')) {
            const resultItem = target.closest('.result-item');
            if (resultItem) {
                const link = resultItem.querySelector('a');
                if (link) copyToClipboard(link.href);
            }
        }
        
        // Handle group copy button clicks (copy all links in a group)
        if (target.closest('.group-header button')) {
            const groupContainer = target.closest('.result-group');
            if (groupContainer) copyGroupLinks(groupContainer);
        }
    });
}

/**
 * Main form submission handler
 * Processes user input, validates it, generates URLs, and displays results
 */
function submitForm() {
    const inputElement = document.getElementById('textInput');
    const userInput = inputElement.value;

    if (validateUserInput(userInput)) {
        const generatedUrls = generateURL(userInput);
        
        if (generatedUrls.length > 0) {
            createGroupedUrlListItems(generatedUrls);
            inputElement.value = '';  // Clear input for next use
            inputElement.focus();     // Keep focus for workflow efficiency
            triggerSubmitSuccess('Success!', DEFAULT_MESSAGE_DURATION);
        } else {
            triggerSubmitError('No valid URLs generated', DEFAULT_MESSAGE_DURATION);
        }
    } else {
        triggerSubmitError('Invalid pattern', DEFAULT_MESSAGE_DURATION);
    }
}

/**
 * Clears all result groups from display and storage
 * Prompts user for confirmation before proceeding
 */
function resetList() {
    if (confirm('Clear the list?')) {
        const resultList = document.getElementById('resultList');
        resultList.innerHTML = '';
        localStorage.removeItem(STORAGE_KEY);
        toggleResultsVisibility();
        triggerSubmitSuccess('Cleared', DEFAULT_MESSAGE_DURATION);
    }
}


