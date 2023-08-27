// popup.js
console.log("Popup script loaded");

document.getElementById('toggleButton').addEventListener('click', () => {
    // Find the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
  
        // Send a message to the content script
        chrome.tabs.sendMessage(tabId, { action: 'toggleHighlight' });
      }
    });
  });
  