// Select the HTML elements that JavaScript needs to control.
const countDisplay = document.getElementById("count");
const addBtn = document.getElementById("AddBtn");
const ConfirmBtn = document.getElementById("CfrmBtn");
const historyDisplay = document.getElementById("history");
const HistBtn = document.getElementById("HistBtn");


// Initialize the counter at zero and display it on the page.
let count = 0;
countDisplay.textContent = count;


// Rebuild the history display using the records saved in localStorage.
function renderHistory() {
    // Clear the current display to prevent duplicate entries.
    historyDisplay.innerHTML = "";

    // Load saved records and prepare an empty object for monthly groups.
    const savedHistory =
        JSON.parse(localStorage.getItem("batchHistory")) || [];
    const groupedHistory = {};

    // Sort each record into a group based on its month and year.
    savedHistory.forEach((record) => {
        // Use the timestamp, or the older readable time if no timestamp exists.
        const date = new Date(record.timestamp || record.time);

        // Convert the date into a readable label, such as "October 2026".
        const monthYear = date.toLocaleString("en-IN", {
            month: "long",
            year: "numeric"
        });

        // Create an empty array if this monthly group does not exist yet.
        if (!groupedHistory[monthYear]) {
            groupedHistory[monthYear] = [];
        }

        // Add the current record to its month's array.
        groupedHistory[monthYear].push(record);
    });

    // Loop through each month and its collection of records.
    Object.entries(groupedHistory).forEach(([monthYear, records]) => {
        // Create a list item to hold one month's heading and records.
        const monthItem = document.createElement("li");
        monthItem.classList.add("month-group");

        // Create and label the monthly heading.
        const heading = document.createElement("button");
        heading.type = "button";
        heading.textContent = monthYear;
        heading.classList.add("month-heading");

        // Create a nested list for this month's records and hide it initially.
        const recordsList = document.createElement("ul");
        recordsList.classList.add("records-list");
        recordsList.hidden = true;

        // Show or hide the monthly records whenever the heading is clicked.
        heading.addEventListener("click", function () {
            recordsList.hidden = !recordsList.hidden;
            heading.classList.toggle("expanded");
        });

        // Create a list item for each saved record in this month.
        records.forEach((record) => {
            const historyItem = document.createElement("li");
            historyItem.classList.add("history-record");
            historyItem.textContent = `${record.count} - ${record.time}`;

            // Add the record to this month's nested list.
            recordsList.appendChild(historyItem);
        });

        // Put the heading and its records inside the monthly list item.
        monthItem.appendChild(heading);
        monthItem.appendChild(recordsList);

        // Add the completed monthly group to the history section.
        historyDisplay.appendChild(monthItem);
    });
}


// Display the saved history when the page first loads.
renderHistory();


// Increase the counter by one whenever Add +1 is clicked.
addBtn.addEventListener("click", function () {
    count = count + 1;
    countDisplay.textContent = count;
});


// Save the current count when Confirm is clicked.
ConfirmBtn.addEventListener("click", function () {
    // Prevent saving a record when the counter is zero.
    if (count === 0) {
        return;
    }

    // Create a readable date and time for displaying in the history.
    const time = new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    // Create a record containing the count, readable time and ISO timestamp.
    const record = {
        count: count,
        time: time,
        timestamp: new Date().toISOString()
    };

    // Load the existing records and place the newest record at the beginning.
    const savedHistory =
        JSON.parse(localStorage.getItem("batchHistory")) || [];
    savedHistory.unshift(record);

    // Save the updated history back to localStorage as JSON.
    localStorage.setItem("batchHistory", JSON.stringify(savedHistory));

    // Rebuild the history so the new record appears under the correct month.
    renderHistory();

    // Reset the counter to zero after successfully saving the record.
    count = 0;
    countDisplay.textContent = count;
});


// Open or close the complete history section when History is clicked.
HistBtn.addEventListener("click", function () {
    historyDisplay.hidden = !historyDisplay.hidden;
});

// Register the service worker after the page loads.
window.addEventListener("load", async () => {
    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("./service-worker.js");
            console.log("Service worker registered successfully.");
        } catch (error) {
            console.error("Service worker registration failed:", error);
        }
    }
});