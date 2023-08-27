// options.js
document.addEventListener('DOMContentLoaded', () => {
    const roundedCornersCheckbox = document.getElementById('roundedCorners');
    const globalEnableCheckbox = document.getElementById('globalEnable');
    const saveButton = document.getElementById('saveButton');
  
    saveButton.addEventListener('click', () => {
      const roundedCorners = roundedCornersCheckbox.checked;
      const globalEnable = globalEnableCheckbox.checked;
  
      chrome.storage.sync.set({
        roundedCorners,
        globalEnable
      }, () => {
        console.log('Options saved.');
      });
    });
  });
  