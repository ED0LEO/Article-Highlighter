// background.js

chrome.runtime.onInstalled.addListener(() => {
  const defaultSettings = {
    turnOffAll: false,
    turnOffWebsites: [],
    roundedCorners: true,
    excludeLinks: true,
    randomColors: false,
    transparency: 50
  };

  chrome.storage.sync.set(defaultSettings);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateTurnOffWebsites') {
    console.log("if (message.action === 'updateTurnOffWebsites') ");

    const { hostname, enable } = message;

    chrome.storage.sync.get(['turnOffWebsites'], (result) => {
      const { turnOffWebsites } = result;
      const updatedWebsites = turnOffWebsites || [];

      if (enable) {
        if (!updatedWebsites.includes(hostname)) {
          updatedWebsites.push(hostname);
        }
      } else {
        const index = updatedWebsites.indexOf(hostname);
        if (index !== -1) {
          updatedWebsites.splice(index, 1);
        }
      }

      chrome.storage.sync.set({ turnOffWebsites: updatedWebsites }, () => {
        sendResponse({ success: true });
      });
    });

    return true; // Needed to indicate that the response will be sent asynchronously
  }
});
