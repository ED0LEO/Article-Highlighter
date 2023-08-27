// content.js
chrome.storage.sync.get(['roundedCorners', 'globalEnable'], (result) => {
    const { roundedCorners, globalEnable } = result;

    if (roundedCorners) {
        // Apply rounded corners to highlighted paragraphs
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach((paragraph) => {
            paragraph.style.borderRadius = '10px'; // Example value, adjust as needed
        });
    }

    if (globalEnable) {
        let highlightEnabled = false;

        // Define an array of lighter color variations
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

        // Function to toggle highlighting
        function toggleHighlight() {
            highlightEnabled = !highlightEnabled;
            highlightParagraphs();
        }

        // Function to apply highlighting
        function highlightParagraphs() {
            const paragraphs = document.querySelectorAll('p');
            paragraphs.forEach((paragraph) => {
                // Check if the paragraph has content before applying highlighting
                if (paragraph.textContent.trim() !== '') {
                    const color = highlightEnabled ? getRandomColor() : '';
                    paragraph.style.backgroundColor = color;

                    // Adjust padding to make the highlighted background bigger
                    paragraph.style.padding = highlightEnabled ? '4px' : '';
                }
            });
        }

        // Function to get a random color from the array
        function getRandomColor() {
            return colors[Math.floor(Math.random() * colors.length)];
        }

        // Always enable highlighting for all websites if globalEnable is set
        toggleHighlight();

        // Listen for messages from the popup
        chrome.runtime.onMessage.addListener((message) => {
            if (message.action === 'toggleHighlight') {
                toggleHighlight();
            }
        });

        console.log("Content script loaded");
    }
});
