# Smartschool Test Notifier

A simple browser extension that provides notifications when tests, quizzes, or exams are found on the Smartschool planner of PS Diepenbeek.

## Features

- **Automatic detection**: Searches for keywords like "overhoring", "toets", "test", "examen", etc.
- **Browser notifications**: Shows system notifications when tests are found
- **Visual indicators**: Displays a red banner at the top-right of the page
- **Real-time monitoring**: Automatically checks when the planner is updated
- **Periodic checks**: Automatically checks every 5 minutes

## Installation

### Step 1: Download the files
Create a new folder for the extension and download these files:
- `manifest.json`
- `content.js`
- `background.js`
- `popup.html`

### Step 2: Add icons (optional)
Add icon files (16x16, 48x48, 128x128 pixels):
- `icon16.png`
- `icon48.png`
- `icon128.png`

### Step 3: Install in Chrome/Edge

1. Open Chrome/Edge and go to `chrome://extensions/` (or `edge://extensions/`)
2. Turn on "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the folder containing the extension files
5. The extension will now appear in your extension list

### Step 4: Grant permissions
The extension requests:
- **Notifications**: To show alerts
- **Active Tab**: To access the current Smartschool tab

## Usage

1. Go to https://psdiepenbeek.smartschool.be/planner/
2. The extension automatically starts monitoring
3. When a test is found, you'll get:
   - A browser notification
   - A red banner at the top-right of the page
4. Click the extension icon for status information

## Search Terms

The extension searches for these keywords (case insensitive):
- overhoring (Dutch: quiz)
- toets (Dutch: test)
- test
- examen (Dutch: exam)
- proefwerk (Dutch: test paper)
- repetitie (Dutch: review)
- evaluatie (Dutch: evaluation)
- quiz
- exam
- assessment

## Troubleshooting

**Extension not working:**
- Make sure you're on the correct Smartschool URL
- Reload the page
- Check if notifications are enabled in your browser

**No notifications:**
- Go to browser settings → Privacy and security → Site settings → Notifications
- Make sure Smartschool has permission for notifications

**Tests not being detected:**
- Check if the test keywords are in the description
- The extension looks at both the title and description of calendar items

## Customization

You can customize the extension by:
- Adding extra keywords in `content.js` (lines 2-11)
- Changing the check interval (line 130, default 5 minutes)
- Modifying the visual indicator styling (lines 60-79)

## Privacy

This extension:
- Only works on Smartschool pages
- Does not store personal data
- Does not send data to external servers
- Runs entirely locally in your browser

## Language Support

The extension primarily searches for Dutch educational terms but also includes common English terms like "test", "quiz", and "exam" for broader compatibility.