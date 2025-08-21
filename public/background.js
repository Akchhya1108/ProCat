// Background service worker for Productivity Cat

chrome.runtime.onInstalled.addListener(() => {
  console.log('Productivity Cat extension installed!');
});

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  // Open the extension popup when notification is clicked
  chrome.action.openPopup();
  chrome.notifications.clear(notificationId);
});

// Listen for alarms (alternative to notifications)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pomodoroTimer') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'cat.png',
      title: 'Productivity Cat',
      message: '🐱 Timer finished! Check your cat!'
    });
  }
});

// Keep service worker alive
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'keepAlive') {
    sendResponse({ status: 'alive' });
  }
});