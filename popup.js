// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const roundedCornersCheckbox = document.getElementById('roundedCorners');
  const turnOffAllCheckbox = document.getElementById('turnOffAll');
  const turnOffThisCheckbox = document.getElementById('turnOffThis');
  const excludeLinksCheckbox = document.getElementById('excludeLinks');
  const transparencyRange = document.getElementById('transparencyRange');
  const reloadButton = document.getElementById('reloadButton');
  const randomColorsCheckbox = document.getElementById('randomColors');

  chrome.storage.sync.get(
    ['roundedCorners', 'turnOffAll', 'turnOffWebsites', 'excludeLinks', 'transparency', 'randomColors'],
    (result) => {
      if (Object.keys(result).length === 0) {
        // Set the default values
        const defaultSettings = {
          turnOffAll: false,
          turnOffWebsites: [],
          roundedCorners: true,
          excludeLinks: true,
          randomColors: false,
          transparency: 50
        };

        chrome.storage.sync.set(defaultSettings);
      }

      const {
        roundedCorners,
        turnOffAll,
        turnOffWebsites,
        excludeLinks,
        transparency,
        randomColors
      } = result;

      roundedCornersCheckbox.checked = roundedCorners || false;
      turnOffAllCheckbox.checked = turnOffAll || false;
      excludeLinksCheckbox.checked = excludeLinks || false;
      transparencyRange.value = transparency || 50; // Set slider to the current value
      randomColorsCheckbox.checked = randomColors || false;

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const currentHostname = new URL(currentTab.url).hostname;

        if (turnOffWebsites && turnOffWebsites.includes(currentHostname)) {
          turnOffThisCheckbox.checked = true;
        } else {
          turnOffThisCheckbox.checked = false;
        }
      });

      // updateHighlighting();

      // Checkbox event listeners
      roundedCornersCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ roundedCorners: roundedCornersCheckbox.checked });
        updateHighlighting();
      });

      turnOffAllCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ turnOffAll: turnOffAllCheckbox.checked });
        updateHighlighting();
      });

      excludeLinksCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ excludeLinks: excludeLinksCheckbox.checked });
        updateHighlighting();
      });

      transparencyRange.addEventListener('input', () => {
        const transparencyValue = transparencyRange.value;
        chrome.storage.sync.set({ transparency: transparencyValue });
        updateHighlighting();
      });

      reloadButton.addEventListener('click', () => {
        updateHighlighting();
      });

      randomColorsCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ randomColors: randomColorsCheckbox.checked });
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
