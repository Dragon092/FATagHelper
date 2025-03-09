console.log("Content script loaded!");

let isEnabled = false; // Default state

// Store removed classes so they can be restored
const removedClasses = new WeakMap();

// Load state from storage
chrome.storage.sync.get("enabled", (data) => {
    isEnabled = data.enabled ?? true;
});

// Listen for storage changes (in case the user toggles the button)
chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) {
        isEnabled = changes.enabled.newValue;
    }
});

// Function to remove class on hover
function removeClass(event) {
    if (!isEnabled) return;

    const img = event.target;
    if (img.classList.contains("blocked-content")) {
        removedClasses.set(img, "blocked-content"); // Save the class
        img.classList.remove("blocked-content");
        console.log("Class removed from", img);
    }
}

function restoreClass(event) {
    if (!isEnabled) return;

    const img = event.target;
    if (removedClasses.has(img)) {
        img.classList.add(removedClasses.get(img)); // Restore the class
        removedClasses.delete(img); // Clean up
        console.log("Class restored to", img);
    }
}

// Attach event listeners to all images on the page
function attachListeners() {
    console.log("Attaching event listeners to images...");

    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("mouseenter", removeClass);
        img.addEventListener("mouseleave", restoreClass);
    });

    console.log("Attached listeners...")
}

// Run when the DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachListeners);
} else {
    attachListeners();
}
