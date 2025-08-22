/**
 * Data Storage and Persistence
 * 
 * Handles localStorage operations for saving and loading result groups.
 * Also manages data export functionality.
 */

// Storage configuration
const STORAGE_KEY = 'savedGroups';
const MAX_SAVED_GROUPS = 50;

/**
 * Saves current result groups to localStorage for persistence across sessions
 * Extracts timestamp and links from each group in the DOM
 */
function saveGroupToStorage() {
    const groups = Array.from(document.querySelectorAll('.result-group')).map(group => ({
        timestamp: group.querySelector('.group-timestamp').textContent,
        links: Array.from(group.querySelectorAll('a')).map(link => link.href)
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
}

/**
 * Loads and recreates previously saved result groups from localStorage
 * Limits to recent groups for performance and handles corrupted data gracefully
 */
function loadSavedGroups() {
    try {
        const savedGroups = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        
        // Limit to recent groups to prevent performance issues with large datasets
        const recentGroups = savedGroups.slice(-MAX_SAVED_GROUPS);
        
        // Recreate groups in reverse order (newest first)
        recentGroups.reverse().forEach(group => {
            if (group.links && Array.isArray(group.links)) {
                createGroupedUrlListItems(group.links);
            }
        });
    } catch (error) {
        console.error('Error loading saved groups:', error);
        localStorage.removeItem(STORAGE_KEY); // Clear corrupted data
    }
}

/**
 * Exports all saved link groups to a downloadable text file
 * Creates a formatted text file with timestamps and grouped links
 */
function exportList() {
    const savedGroups = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let exportText = 'Exported Image Links\n\n';

    // Format each group with timestamp and links
    savedGroups.forEach((group, index) => {
        exportText += `Group ${index + 1}: ${group.timestamp}\n`;
        group.links.forEach(link => exportText += `${link}\n`);
        exportText += '\n';
    });

    // Create and trigger download
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported_links.txt';
    a.click();
    URL.revokeObjectURL(url);

    triggerSubmitSuccess('Exported!', DEFAULT_MESSAGE_DURATION);
}
