//content.js

// Function to apply highlighting
function applyHighlighting() {
    chrome.storage.sync.get(['roundedCorners', 'turnOffAll', 'turnOffWebsites', 'excludeLinks', 'transparency', 'randomColors'], (result) => {
        const { roundedCorners, turnOffAll, turnOffWebsites, excludeLinks, transparency, randomColors } = result;

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
            const adjustedTransparency = transparency / 100;

            // Apply highlighting and styles
            const textColor = getComputedStyle(document.body).color;
            const paragraphs = document.querySelectorAll('p');
            paragraphs.forEach((paragraph) => {
                const links = paragraph.querySelectorAll('a');
                const hasLinks = links.length > 0;
                const hasOnlyLinks = hasLinks && links.length === paragraph.childNodes.length;

                if (!hasOnlyLinks && paragraph.textContent.trim() !== '') {
                    // Change background color for non-link text
                    const color = getAdjustedBackgroundColor(textColor, adjustedTransparency, randomColors);
                    paragraph.style.backgroundColor = color;
                    if (roundedCorners) {
                        paragraph.style.borderRadius = '10px';
                    } else {
                        paragraph.style.borderRadius = '';
                    }
                    paragraph.style.padding = '4px';

                    if (hasLinks) {
                        // Apply the page background color to links
                        links.forEach((link) => {

                            if (!excludeLinks) {
                                link.style.borderRadius = '';
                                link.style.padding = '';
                                link.style.backgroundColor = '';
                            } else {
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
                            }
                        });
                    }
                }
            });
        }

    });
}

function getRandomColorWithTransparency(transparency) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, ${transparency})`;
}


function getAdjustedBackgroundColor(textColor, adjustedTransparency, randomColors) {
    const rgb = textColor.match(/\d+/g);
    if (rgb) {
        const sum = rgb.reduce((acc, val) => acc + parseInt(val), 0);
        const average = sum / 3;
        const medium = average >= 64 && average <= 192;

        const transparency = medium ? adjustedTransparency * 0.3 : adjustedTransparency;

        if (randomColors)
            return getRandomColorWithTransparency(transparency);
        else {
            const colors = [
                `rgba(255, 179, 25, ${transparency})`, // Saturated Orange with adjusted transparency
                `rgba(46, 171, 232, ${transparency})`, // Saturated Blue with adjusted transparency
                `rgba(173, 181, 181, ${transparency})`, // Saturated Gray with adjusted transparency
                `rgba(87, 219, 199, ${transparency})`, // Saturated Green with adjusted transparency
                `rgba(255, 112, 122, ${transparency})`, // Saturated Pink with adjusted transparency
                `rgba(255, 199, 89, ${transparency})`, // Saturated Yellow with adjusted transparency
                `rgba(0, 229, 220, ${transparency})`, // Saturated Turquoise with adjusted transparency
                `rgba(249, 196, 95, ${transparency})`, // Saturated Pastel Yellow with adjusted transparency
                `rgba(255, 143, 68, ${transparency})`, // Saturated Apricot with adjusted transparency
                `rgba(194, 72, 217, ${transparency})`  // Saturated Lavender with adjusted transparency
            ];

            const randomIndex = Math.floor(Math.random() * colors.length);
            return colors[randomIndex];
        }
    }
    if (randomColors)
        return getRandomColorWithTransparency(adjustedTransparency);
    else {
        const colors = [
            `rgba(255, 179, 25, ${adjustedTransparency})`, // Saturated Orange with adjusted transparency
            `rgba(46, 171, 232, ${adjustedTransparency})`, // Saturated Blue with adjusted transparency
            `rgba(173, 181, 181, ${adjustedTransparency})`, // Saturated Gray with adjusted transparency
            `rgba(87, 219, 199, ${adjustedTransparency})`, // Saturated Green with adjusted transparency
            `rgba(255, 112, 122, ${adjustedTransparency})`, // Saturated Pink with adjusted transparency
            `rgba(255, 199, 89, ${adjustedTransparency})`, // Saturated Yellow with adjusted transparency
            `rgba(0, 229, 220, ${adjustedTransparency})`, // Saturated Turquoise with adjusted transparency
            `rgba(249, 196, 95, ${adjustedTransparency})`, // Saturated Pastel Yellow with adjusted transparency
            `rgba(255, 143, 68, ${adjustedTransparency})`, // Saturated Apricot with adjusted transparency
            `rgba(194, 72, 217, ${adjustedTransparency})`  // Saturated Lavender with adjusted transparency
        ];

        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }
}

// Apply highlighting when the content script is executed
applyHighlighting();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateHighlighting') {
        applyHighlighting();
    }
});