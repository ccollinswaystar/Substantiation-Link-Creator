# Substantiation Link Creator

A simple web tool that extracts image file paths from RPA run logs and converts them into clickable URLs for easy access to substantiation images.

## What it does

- Paste your RPA run log text into the input area
- Automatically finds image file patterns (format: `YYYY_*image*.png`)
- Converts file paths to clickable URLs using your selected server
- Groups results by timestamp for easy organization
- Copy individual links or entire groups to clipboard
- Export all results to a text file

## How to use

1. Select your server from the dropdown (papasubstr001 or papasubstr003)
2. Paste your run log text into the input area
3. Click Submit or press Enter
4. Click any link to open the image in a new tab
5. Use copy icons to copy links to clipboard
6. Use "Clear Results" to start over or "Export" to download all links

## Features

- **Dark/Light theme** - Toggle with the theme button in the header
- **Persistent storage** - Your results are saved and restored between sessions
- **Keyboard shortcuts** - Enter to submit, Shift+Enter for new line
- **Duplicate removal** - Automatically removes duplicate image paths
- **Mobile friendly** - Responsive design works on all devices

## File structure

- `index.html` - Main page
- `index.js` - Application initialization and main logic
- `ui.js` - User interface components
- `patterns.js` - Pattern matching and URL generation
- `storage.js` - Data persistence and export
- `utils.js` - Common helper functions
- `styles.css` - Styling
- `assets/icons/` - UI icons

## Deployment

This is a static web application. Simply upload all files to any web server or static hosting service (like Netlify, GitHub Pages, etc.). No build process required.