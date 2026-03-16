// QuickWord – Background Service Worker
// Minimal worker: handles install event and badge setup.

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[QuickWord] Extension installed successfully.');
    // Set badge to indicate zero words saved
    chrome.action.setBadgeBackgroundColor({ color: '#4F46E5' });
    chrome.action.setBadgeText({ text: '' });
  }
});

// Listen for messages from content scripts to update badge count
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'UPDATE_BADGE') {
    const count = message.count;
    chrome.action.setBadgeText({ text: count > 0 ? String(count) : '' });
    chrome.action.setBadgeBackgroundColor({ color: '#4F46E5' });
    sendResponse({ ok: true });
  }
  return true; // keep message channel open for async responses
});
