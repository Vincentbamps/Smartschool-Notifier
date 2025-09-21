// Keywords that indicate tests/quizzes (Dutch terms)
const testKeywords = [
  'overhoring',
  'toets',
  'test',
  'examen',
  'proefwerk',
  'repetitie',
  'evaluatie',
  'quiz',
  'exam',
  'assessment'
];

// Store found tests to avoid duplicate notifications
let foundTests = new Set();

function checkForTests() {
  console.log('Checking for tests...');
  
  // Find all schedule items
  const scheduleItems = document.querySelectorAll('.brief-ple-content');
  
  scheduleItems.forEach(item => {
    const nameElement = item.querySelector('.brief-ple-content__name');
    const infoElement = item.querySelector('.brief-ple-content__info');
    
    if (!nameElement) return;
    
    const nameText = nameElement.textContent.toLowerCase();
    const infoText = infoElement ? infoElement.textContent.toLowerCase() : '';
    const fullText = nameText + ' ' + infoText;
    
    // Check if any test keyword is found
    const foundKeyword = testKeywords.find(keyword => 
      fullText.includes(keyword.toLowerCase())
    );
    
    if (foundKeyword) {
      const testId = nameText + infoText; // Simple ID based on content
      
      // Only notify if we haven't seen this test before
      if (!foundTests.has(testId)) {
        foundTests.add(testId);
        
        // Extract time and subject info
        const timeMatch = nameText.match(/(\d{2}:\d{2}-\d{2}:\d{2})/);
        const time = timeMatch ? timeMatch[1] : '';
        
        showNotification({
          title: `Test found: ${foundKeyword}`,
          message: `${nameText}\n${infoText}`,
          time: time,
          keyword: foundKeyword
        });
      }
    }
  });
}

function showNotification(testInfo) {
  // Send message to background script to show notification
  chrome.runtime.sendMessage({
    action: 'showNotification',
    data: testInfo
  });
  
  // Also create a visual indicator on the page
  createVisualIndicator(testInfo);
}

function createVisualIndicator(testInfo) {
  // Remove existing indicator
  const existingIndicator = document.getElementById('test-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  // Create new indicator
  const indicator = document.createElement('div');
  indicator.id = 'test-indicator';
  indicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff6b6b;
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    max-width: 300px;
    border-left: 4px solid #ff4757;
  `;
  
  indicator.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 5px;">🚨 Test/Quiz found!</div>
    <div style="font-size: 12px; opacity: 0.9;">${testInfo.title}</div>
    <div style="font-size: 11px; opacity: 0.8; margin-top: 3px;">${testInfo.time}</div>
  `;
  
  // Add click to dismiss
  indicator.addEventListener('click', () => {
    indicator.remove();
  });
  
  document.body.appendChild(indicator);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (indicator.parentNode) {
      indicator.remove();
    }
  }, 10000);
}

// Observer to watch for changes in the planner
function setupObserver() {
  const targetNode = document.querySelector('.timegrid__content-container');
  
  if (targetNode) {
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldCheck = true;
        }
      });
      
      if (shouldCheck) {
        // Delay check to allow content to fully load
        setTimeout(checkForTests, 1000);
      }
    });
    
    observer.observe(targetNode, {
      childList: true,
      subtree: true
    });
    
    console.log('Observer set up successfully');
  }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'checkNow') {
    checkForTests();
  }
});

// Initialize the extension
function init() {
  console.log('Smartschool Test Notifier initialized');
  
  // Check immediately
  setTimeout(checkForTests, 2000);
  
  // Set up observer for dynamic content
  setupObserver();
  
  // Periodic check every 5 minutes
  setInterval(checkForTests, 5 * 60 * 1000);
}

// Start when page is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}