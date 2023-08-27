//content.js

// Function to apply highlighting
function applyHighlighting() {
    chrome.storage.sync.get(['roundedCorners', 'turnOffAll', 'turnOffWebsites'], (result) => {
        const { roundedCorners, turnOffAll, turnOffWebsites } = result;

        const currentWebsiteTurnedOff = turnOffWebsites && turnOffWebsites.includes(window.location.hostname);

        if ((turnOffAll || currentWebsiteTurnedOff) && document.body) {
            // Remove highlighting and styles
            const paragraphs = document.querySelectorAll('p');
            paragraphs.forEach((paragraph) => {
                paragraph.style.backgroundColor = '';
                paragraph.style.borderRadius = '';
                paragraph.style.padding = '';
            });
        } else if (document.body) {
            // Apply highlighting and styles
            const colors = [
                '#FFD699', // Light Orange
                '#AED6F1', // Light Blue
                '#D5DBDB', // Light Gray
                '#D1F2EB', // Light Green
                '#F5B7B1', // Light Pink
                '#FAD7A0', // Light Yellow
                '#A3E4D7', // Light Turquoise
                '#F9E79F', // Light Pastel Yellow
                '#F0B27A', // Light Apricot
                '#BB8FCE'  // Light Lavender
            ];

            // Apply highlighting to paragraphs
            const paragraphs = document.querySelectorAll('p');
            paragraphs.forEach((paragraph) => {
                if (paragraph.textContent.trim() !== '') {
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    paragraph.style.backgroundColor = color;
                    if (roundedCorners) {
                        paragraph.style.borderRadius = '10px';
                    }
                    else {
                        paragraph.style.borderRadius = '';
                    }
                    paragraph.style.padding = '4px';
                }
            });
        }
    });
}

// Apply highlighting when the content script is executed
applyHighlighting();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateHighlighting') {
        applyHighlighting();
    }
});