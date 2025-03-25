document.addEventListener("DOMContentLoaded", () => {
    // Function to format text (converts \n to <br> and *italic* to <i>italic</i>)
    function formatText(text) {
        return text
            .replace(/\n/g, "<br>") // Convert newlines to <br>
            .replace(/\*([^*]+)\*/g, "<i>$1</i>") // Convert *italic* to <i>italic</i>
            .replace(/([\w.-]+@[\w.-]+\.\w+)/g, '<a href="mailto:$1">$1</a>'); // Convert emails to mailto links
    }

    const fadeImage = document.getElementById("fadeImage");
    const imageCaption = document.getElementById("imageCaption");
    let currentIndex = 0;
    let images = [];
    let captions = [];
    let interval;

    fetch("updates.json")
        .then(response => response.json())
        .then(data => {
            const today = new Date();
            const updatesContainer = document.getElementById("Dates");
            const eventCopy = document.getElementById("eventCopy");
            const contentColumn = document.querySelector(".column2");

            data.updates.forEach(update => {
                if (update.valid && new Date(update.valid) < today) return;

                let titleHTML = `<h2>${update.title}</h2>`;
                let copyHTML = `<p>${formatText(update.copy)}</p>`;

                let eventHTML = update.dates.map(event => `
                    <div class="event-block">
                        <div class="event-header">
                            <div class="dropdown-icon-container">
                                <img class="dropdown-icon" src="${getRandomArrow()}" alt="Dropdown">
                            </div>
                            <div class="event-data">
                                <h3>${event.date}</h3>
                                <h3>${event.venue}</h3>
                                <h3>${event.address || "TBA"}</h3>
                                <div class="schedule hidden">
                                    ${event.schedule.map(slot => `
                                        <p><strong>${slot.time || ""}</strong><br> ${formatText(slot.events.join(", "))}</p>
                                    `).join("")}
                                </div>
                            </div>
                        </div>
                    </div>
                `).join("");

                updatesContainer.insertAdjacentHTML("beforeend", eventHTML);
                contentColumn.insertAdjacentHTML("afterbegin", titleHTML);
                eventCopy.innerHTML = copyHTML;

                // Collect images and captions for the fading image functionality
                images.push(...update.images);
                captions.push(...update.captions);
            });

            // Start the image rotation
            startImageRotation();

            // Set up click event to change image immediately and reset timer
            fadeImage.addEventListener("click", () => {
                changeImage();
                resetImageRotation(); // Reset the timer on click
            });
        })
        .catch(error => console.error("Error loading updates:", error));

      

    document.getElementById("Dates").addEventListener("click", (event) => {
        let header = event.target.closest(".event-header");
        if (!header) return;

        // Find the closest `.event-data` parent and then locate `.schedule`
        const eventData = header.closest(".event-block").querySelector(".event-data");
        const schedule = eventData.querySelector(".schedule");
        const icon = header.querySelector(".dropdown-icon");

        if (!schedule) {
            console.error("⚠ Schedule section not found inside event-data.");
            return;
        }

        schedule.classList.toggle("hidden");
        icon.style.transform = schedule.classList.contains("hidden") ? "rotate(0deg)" : "rotate(180deg)";
    });

    function startImageRotation() {
        interval = setInterval(changeImage, 6000); // Change image every 5 seconds
        changeImage(); // Show the first image immediately
    }

    function resetImageRotation() {
        clearInterval(interval); // Clear the existing interval
        startImageRotation(); // Restart the image rotation
    }

    function changeImage() {
        if (images.length === 0) return; // No images to show

        // Fade out the current image
        fadeImage.style.opacity = 0;

        // Wait for the fade-out transition to complete
        setTimeout(() => {
            // Update the image and caption
            fadeImage.src = images[currentIndex];
            imageCaption.innerHTML = captions[currentIndex];

            // Fade in the new image
            fadeImage.style.opacity = 1;

            // Update the index for the next image
            currentIndex = (currentIndex + 1) % images.length; // Loop back to the start
        }, 300); // Match this with the transition duration
    }
});

function getRandomArrow() {
    const variations = ["D01", "D02", "D03"]; // Add more if needed
    const randomVariant = variations[Math.floor(Math.random() * variations.length)];
    return `../assets/SVG/droparrow_${randomVariant}.svg`;
}

let images = [];
let currentIndex = 0;
const imageElement = document.getElementById("clickableImage");

// Fetch JSON data and extract images
fetch('images.json')
    .then(response => response.json())
    .then(data => {
        if (data.updates && data.updates.length > 0 && data.updates[0].images) {
            images = data.updates[0].images; // Extract images from first update
            if (images.length > 0) {
                imageElement.src = images[0]; // Set first image
            }
        }
    })
    .catch(error => console.error('Error loading images:', error));

// Change image on click
imageElement.addEventListener("click", function () {
    if (images.length === 0) return; // Ensure images are loaded

    currentIndex = (currentIndex + 1) % images.length; // Cycle through images
    this.src = images[currentIndex];

    
});