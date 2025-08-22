/**
 * User Interface Components
 * 
 * Functions responsible for creating and managing the visual interface.
 * Includes layout construction, theme management, and user feedback.
 */

// Icon asset paths for UI elements
const ICONS = {
    copy: './assets/icons/layers.png',
    daylight: './assets/icons/badge.png',
    nightMode: './assets/icons/moon.png',
    download: './assets/icons/download.png'
};

/**
 * Builds the complete application layout and appends it to the document body
 * Creates the main container with header, main content, and footer sections
 */
function buildAppLayout() {
    const appContainer = createElement('div', 'app-container');

    const header = createHeader();
    const main = createMain();
    const footer = createElement('footer', 'app-footer');

    appContainer.append(header, main, footer);
    document.body.appendChild(appContainer);
}

/**
 * Creates the application header with title and theme toggle button
 * @returns {HTMLElement} The complete header element
 */
function createHeader() {
    const header = createElement('header', 'app-header');

    // Main application title
    const title = createElement('h1');
    title.textContent = 'Substantiation Link Generator';

    // Theme toggle button with accessibility attributes
    const themeToggle = createElement('button', 'theme-toggle', { 
        id: 'themeToggle', 
        title: 'Toggle Light/Dark Mode',
        'aria-label': 'Toggle between light and dark theme'
    });
    
    // Theme icon (changes based on current theme)
    const themeIcon = createIcon(ICONS.nightMode, 'Toggle Theme', 24);
    themeToggle.appendChild(themeIcon);
    themeToggle.addEventListener('click', toggleTheme);

    header.append(title, themeToggle);
    return header;
}

/**
 * Creates the main content area with form inputs, controls, and results section
 * @returns {HTMLElement} The complete main content element
 */
function createMain() {
    const main = createElement('main', 'app-main');
    const form = createElement('form', 'input-form', { id: 'myForm' });

    // Server Selection Dropdown
    const serverContainer = createElement('div', 'server-container');
    const serverLabel = createElement('label', 'server-label', { for: 'serverSelect' });
    serverLabel.textContent = 'Server:';
    
    // Populate dropdown with available server options
    const serverSelect = createElement('select', 'server-select', { id: 'serverSelect' });
    URL_PREFIXES.forEach(prefix => {
        const option = createElement('option', '', { value: prefix.value });
        option.textContent = prefix.label;
        serverSelect.appendChild(option);
    });
    
    serverContainer.append(serverLabel, serverSelect);

    // Text Input Area
    const textarea = createElement('textarea', 'text-input', { 
        id: 'textInput', 
        rows: 10, 
        placeholder: 'Paste your run log here, or just the snippet with the image path. This will extract as many as it finds without duplicating', 
        required: true 
    });
    
    // Enable Enter key submission (Shift+Enter for new line)
    textarea.addEventListener('keydown', function (event) {
        if ((event.key === 'Enter' || event.key === 'Return') && !event.shiftKey) {
            event.preventDefault();
            submitForm();
        }
    });

    // Action Buttons
    const buttonsContainer = createElement('div', 'buttons-container');
    
    // Primary submit button
    const submitBtn = createElement('input', 'btn submit-btn', { type: 'button', value: 'Submit' });
    submitBtn.addEventListener('click', submitForm);

    // Secondary action buttons (clear and export)
    const secondaryButtons = createElement('div', 'secondary-buttons');
    
    const clearBtn = createElement('input', 'btn secondary-btn', { type: 'button', value: 'Clear Results' });
    clearBtn.addEventListener('click', resetList);

    const exportBtn = createElement('button', 'btn secondary-btn', { title: 'Export List', type: 'button' });
    exportBtn.addEventListener('click', exportList);
    exportBtn.appendChild(createIcon(ICONS.download, 'Download', 20));

    secondaryButtons.append(clearBtn, exportBtn);
    buttonsContainer.append(submitBtn, secondaryButtons);
    form.append(serverContainer, textarea, buttonsContainer);

    // Results Display Section
    const resultSection = createElement('section', 'results-section', { id: 'resultDiv' });
    const resultHeader = createElement('h2');
    resultHeader.textContent = 'Results';

    const resultList = createElement('div', 'result-list', { id: 'resultList' });
    resultSection.append(resultHeader, resultList);

    main.append(form, resultSection);
    return main;
}

/**
 * Creates a new group of URL list items and adds them to the results display
 * Each group includes a timestamp, copy-all button, and individual link items
 * @param {string[]} urls - Array of generated URLs to display
 */
function createGroupedUrlListItems(urls) {
    const resultList = document.getElementById('resultList');
    const groupContainer = createElement('div', 'result-group');

    // Group Header with Timestamp and Actions
    const headerContainer = createElement('div', 'group-header');
    
    // Timestamp for when this group was created
    const timestamp = new Date().toLocaleString();
    const timestampElement = createElement('small', 'group-timestamp');
    timestampElement.textContent = timestamp;

    // Button to copy all links in this group (formatted for Jira)
    const groupCopyBtn = createElement('button', 'btn secondary-btn', { title: 'Copy all links, formatted for jira!' });
    groupCopyBtn.appendChild(createIcon(ICONS.copy, 'Copy Group', 20));
    groupCopyBtn.addEventListener('click', () => copyGroupLinks(groupContainer));

    headerContainer.append(timestampElement, groupCopyBtn);
    groupContainer.appendChild(headerContainer);

    // Individual Link Items
    urls.forEach(url => {
        const listItem = createElement('div', 'result-item');

        // Clickable link that opens in new tab
        const link = createElement('a', null, { href: url, target: '_blank' });
        link.textContent = url;

        // Individual copy icon for single link copying
        const copyIcon = createIcon(ICONS.copy, 'Copy Link', 16);
        copyIcon.className = 'copy-icon';
        copyIcon.addEventListener('click', () => copyToClipboard(url));

        listItem.append(copyIcon, link);
        groupContainer.appendChild(listItem);
    });

    // Add new group to top of results and persist to storage
    resultList.prepend(groupContainer);
    saveGroupToStorage();
    toggleResultsVisibility();
}

/**
 * Controls visibility of results section and secondary buttons
 * Shows these elements only when there are result groups to display
 */
function toggleResultsVisibility() {
    const resultSection = document.querySelector('.results-section');
    const secondaryButtons = document.querySelector('.secondary-buttons');
    const hasResults = document.querySelectorAll('.result-group').length > 0;

    resultSection.classList.toggle('visible', hasResults);
    secondaryButtons.classList.toggle('visible', hasResults);
}

/**
 * Initializes the theme system based on stored preference
 * Sets up the theme toggle button with appropriate icon
 */
function setupThemeToggle() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.className = currentTheme;
    const themeIcon = document.querySelector('#themeToggle img');
    themeIcon.src = currentTheme === 'dark' ? ICONS.daylight : ICONS.nightMode;
}

/**
 * Toggles between light and dark themes
 * Updates the UI immediately and persists preference to localStorage
 */
function toggleTheme() {
    const currentTheme = document.body.className === 'dark' ? 'light' : 'dark';
    document.body.className = currentTheme;
    localStorage.setItem('theme', currentTheme);
    const themeIcon = document.querySelector('#themeToggle img');
    themeIcon.src = currentTheme === 'dark' ? ICONS.daylight : ICONS.nightMode;
}

/**
 * Displays error feedback on the submit button
 * @param {string} message - Error message to display
 * @param {number} duration - How long to show the message (ms)
 */
function triggerSubmitError(message = "Error", duration = DEFAULT_MESSAGE_DURATION) {
    const submitBtn = document.querySelector('.submit-btn');
    clearTimeout(submitBtnTimeout);
    const originalText = 'Submit';

    // Apply error styling and disable button
    submitBtn.classList.add('error');
    submitBtn.disabled = true;
    submitBtn.value = message;

    // Reset to normal state after duration
    submitBtnTimeout = setTimeout(() => {
        submitBtn.classList.remove('error');
        submitBtn.disabled = false;
        submitBtn.value = originalText;
    }, duration);
}

/**
 * Displays success feedback on the submit button
 * @param {string} message - Success message to display
 * @param {number} duration - How long to show the message (ms)
 */
function triggerSubmitSuccess(message, duration = DEFAULT_MESSAGE_DURATION) {
    const submitBtn = document.querySelector('.submit-btn');
    clearTimeout(submitBtnTimeout);
    const originalText = 'Submit';

    // Apply success styling
    submitBtn.classList.add('success');
    submitBtn.value = message;

    // Reset to normal state after duration
    submitBtnTimeout = setTimeout(() => {
        submitBtn.classList.remove('success');
        submitBtn.value = originalText;
    }, duration);
}
