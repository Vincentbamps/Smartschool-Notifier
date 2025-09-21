// Background service worker for handling notifications

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showNotification') {
    createNotification(message.data);
  }
});

function createNotification(testInfo) {
  const notificationId = `test_${Date.now()}`;
  
  chrome.notifications.create(notificationId, {
    type: 'basic',
    iconUrl: 'icon48.png',
    title: 'Smartschool - Test found!',
    message: `${testInfo.keyword.toUpperCase()}: ${testInfo.time}\n${testInfo.message}`,
    priority: 2,
    requireInteraction: true
  });
  
  // Auto-clear notification after 30 seconds
  setTimeout(() => {
    chrome.notifications.clear(notificationId);
  }, 30000);
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  // Focus the Smartschool tab
  chrome.tabs.query({url: "https://psdiepenbeek.smartschool.be/*"}, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.update(tabs[0].id, {active: true});
      chrome.windows.update(tabs[0].windowId, {focused: true});
    }
  });
  
  // Clear the notification
  chrome.notifications.clear(notificationId);
});

// Install event
chrome.runtime.onInstalled.addListener(() => {
  console.log('Smartschool Test Notifier installed');
});