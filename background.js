// background.js
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.onClicked.addListener((tab) => {
      console.log("Button clicked in background.js");
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleHighlight
      });
    });
  });
  