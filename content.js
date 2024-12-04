// Default key is Enter
let stopKey = 'Enter';

// Get the saved key if it exists
chrome.storage.local.get(['stopKey'], function(result) {
    if (result.stopKey) {
        stopKey = result.stopKey;
    }
});

// Listen for key change messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "keyChanged") {
        stopKey = message.newKey;
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === stopKey) {
        try {
            const stopButton = document.querySelector('[data-testid="stop-button"]');
            if (stopButton && stopButton.offsetParent !== null) {
                console.log('Stop button found and clicked');   
                stopButton.click();
            }
        } catch (error) {
            console.error('Error:', error);
            chrome.runtime.sendMessage({ 
                action: "stopButton", 
                error: error.message 
            });
        }
    }
}); 
