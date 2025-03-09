document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggle-btn");

    // Get current state
    chrome.storage.sync.get("enabled", (data) => {
        const isEnabled = data.enabled ?? true;
        toggleBtn.textContent = isEnabled ? "Disable" : "Enable";
    });

    // Handle button click
    toggleBtn.addEventListener("click", () => {
        chrome.storage.sync.get("enabled", (data) => {
            const newState = !data.enabled;
            chrome.storage.sync.set({enabled: newState}, () => {
                toggleBtn.textContent = newState ? "Disable" : "Enable";
            });
        });
    });
});