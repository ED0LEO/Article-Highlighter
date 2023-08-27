// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const roundedCornersCheckbox = document.getElementById('roundedCorners');
  const turnOffAllCheckbox = document.getElementById('turnOffAll');
  const turnOffThisCheckbox = document.getElementById('turnOffThis');

  chrome.storage.sync.get(['roundedCorners', 'turnOffAll', 'turnOffWebsites'], (result) => {
    const { roundedCorners, turnOffAll, turnOffWebsites } = result;

    roundedCornersCheckbox.checked = roundedCorners || false;
    turnOffAllCheckbox.checked = turnOffAll || false;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const currentHostname = new URL(currentTab.url).hostname;

      if (turnOffWebsites && turnOffWebsites.includes(currentHostname)) {
        turnOffThisCheckbox.checked = true;
      } else {
        turnOffThisCheckbox.checked = false;
      }
    });

    // Checkbox event listeners
    roundedCornersCheckbox.addEventListener('change', () => {
      chrome.storage.sync.set({ roundedCorners: roundedCornersCheckbox.checked });
      updateHighlighting();
    });

    turnOffAllCheckbox.addEventListener('change', () => {
      chrome.storage.sync.set({ turnOffAll: turnOffAllCheckbox.checked });
      updateHighlighting();
    });

    turnOffThisCheckbox.addEventListener('change', () => {
      const enable = turnOffThisCheckbox.checked; // Checkbox state

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const hostname = new URL(currentTab.url).hostname;

        chrome.runtime.sendMessage(
          { action: 'updateTurnOffWebsites', hostname, enable },
          (response) => {
            if (response.success) {
              console.log('Checkbox state updated.');
              updateHighlighting();
            }
          }
        );
      });
    });
  });
});

// Function to send a message to the content script to update highlighting
function updateHighlighting() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'updateHighlighting' });
  });
}
