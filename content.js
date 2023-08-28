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
            // Get the background color of the page
            const pageBackgroundColor = getComputedStyle(document.body).backgroundColor;

            // Apply highlighting and styles
            const textColor = getComputedStyle(document.body).color;
            const paragraphs = document.querySelectorAll('p');
            paragraphs.forEach((paragraph) => {
                if (paragraph.textContent.trim() !== '') {
                    // Change background color for non-link text
                    const color = getAdjustedBackgroundColor(textColor);
                    paragraph.style.backgroundColor = color;
                    if (roundedCorners) {
                        paragraph.style.borderRadius = '10px';
                    } else {
                        paragraph.style.borderRadius = '';
                    }
                    paragraph.style.padding = '4px';

                    const links = paragraph.querySelectorAll('a');
                    if (links.length > 0) {
                        // Apply the page background color to links
                        links.forEach((link) => {
                            //Apply only if detected backgound is not the same as link
                            const linkTextColor = getComputedStyle(link).color;
                            if (linkTextColor !== pageBackgroundColor) {
                                link.style.backgroundColor = pageBackgroundColor;
                                if (roundedCorners) {
                                    link.style.borderRadius = '10px';
                                } else {
                                    link.style.borderRadius = '';
                                }
                                link.style.padding = '4px';
                            }
                        });
                    }
                }
            });
        }

    });
}

function getAdjustedBackgroundColor(textColor) {
    const rgb = textColor.match(/\d+/g);
    if (rgb) {
        const sum = rgb.reduce((acc, val) => acc + parseInt(val), 0);
        const average = sum / 3;
        const medium = average >= 64 && average <= 192;

        const transparency = medium ? 0.3 : 0.5; // Adjust transparency based on text color darkness

        const colors = [
            'rgba(255, 214, 153, ' + transparency + ')', // Light Orange with adjusted transparency
            'rgba(174, 214, 241, ' + transparency + ')', // Light Blue with adjusted transparency
            'rgba(213, 219, 219, ' + transparency + ')', // Light Gray with adjusted transparency
            'rgba(209, 242, 235, ' + transparency + ')', // Light Green with adjusted transparency
            'rgba(245, 183, 177, ' + transparency + ')', // Light Pink with adjusted transparency
            'rgba(250, 215, 160, ' + transparency + ')', // Light Yellow with adjusted transparency
            'rgba(163, 228, 215, ' + transparency + ')', // Light Turquoise with adjusted transparency
            'rgba(249, 231, 159, ' + transparency + ')', // Light Pastel Yellow with adjusted transparency
            'rgba(240, 178, 122, ' + transparency + ')', // Light Apricot with adjusted transparency
            'rgba(187, 143, 206, ' + transparency + ')'  // Light Lavender with adjusted transparency
        ];

        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    const colors = [
        'rgba(255, 214, 153, 0.5)', // Light Orange with adjusted transparency
        'rgba(174, 214, 241, 0.5)', // Light Blue with adjusted transparency
        'rgba(213, 219, 219, 0.5)', // Light Gray with adjusted transparency
        'rgba(209, 242, 235, 0.5)', // Light Green with adjusted transparency
        'rgba(245, 183, 177, 0.5)', // Light Pink with adjusted transparency
        'rgba(250, 215, 160, 0.5)', // Light Yellow with adjusted transparency
        'rgba(163, 228, 215, 0.5)', // Light Turquoise with adjusted transparency
        'rgba(249, 231, 159, 0.5)', // Light Pastel Yellow with adjusted transparency
        'rgba(240, 178, 122, 0.5)', // Light Apricot with adjusted transparency
        'rgba(187, 143, 206, 0.5)',  // Light Lavender with adjusted transparency
    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

// Apply highlighting when the content script is executed
applyHighlighting();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateHighlighting') {
        applyHighlighting();
    }
});