document.addEventListener('DOMContentLoaded', () => {
    const keyElement = document.getElementById('key');
    const changeButton = document.querySelector('button');
    
    // Load current key
    chrome.storage.local.get(['stopKey'], function(result) {
        if (result.stopKey) {
            keyElement.textContent = result.stopKey;
        }
    });

    let listening = false;
    
    changeButton.addEventListener('click', () => {
        if (!listening) {
            changeButton.textContent = 'Press any key...';
            keyElement.textContent = '...';
            listening = true;
            
            document.addEventListener('keydown', function keyListener(e) {
                e.preventDefault();
                
                // Save the new key
                chrome.storage.local.set({ stopKey: e.key }, () => {
                    keyElement.textContent = e.key;
                    changeButton.textContent = 'Press to change the button';
                    listening = false;

                    // Send message to content script about the key change
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: "keyChanged",
                            newKey: e.key
                        });
                    });
                });
                
                document.removeEventListener('keydown', keyListener);
            }, { once: true });
        }
    });
}); 

