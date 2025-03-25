document.addEventListener("DOMContentLoaded", () => {
      // Function to format text (converts \n to <br> and *italic* to <i>italic</i>)
      function formatText(text) {
        return text
            .replace(/\n/g, "<br>") // Convert newlines to <br>
            .replace(/\*([^*]+)\*/g, "<i>$1</i>") // Convert *italic* to <i>italic</i>
            .replace(/([\w.-]+@[\w.-]+\.\w+)/g, '<a href="mailto:$1">$1</a>'); // Convert emails to mailto links
    }
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
                loadCarousel(update.images, update.captions);
            });
        })
        .catch(error => console.error("Error loading updates:", error));
});

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

function loadCarousel(images = [], captions = [], eventCopyText = "") {
    console.log("📸 Loading images into carousel:", images);
    console.log("📝 Captions:", captions);

    // Get elements
    const carouselWrapper = document.getElementById("carouselWrapper");
    const carouselCaption = document.getElementById("carouselCaption");

    // Ensure the required elements exist
    if (!carouselWrapper || !carouselCaption) {
        console.error("❌ Missing required DOM elements for carousel!");
        return;
    }

    // Clear previous images to avoid duplication
    carouselWrapper.innerHTML = "";
    carouselCaption.innerHTML = "";

    // Ensure images is an array before using .forEach()
    if (!Array.isArray(images) || images.length === 0) {
        console.warn("⚠ No images found. Skipping carousel.");
        return;
    }

    // Populate the carousel
    images.forEach((src, index) => {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.innerHTML = `<img src="${src}" alt="Slide ${index + 1}" style="width:100%; max-width:1080px; max-height:1920px; object-fit:contain;">`;
        carouselWrapper.appendChild(slide);
    });

    // Initialize Swiper (Ensuring elements exist before initialization)
    const swiperUpdates = new Swiper(".swiper-container", {
        loop: true,
        slidesPerView: 1,  // Show only one slide at a time
        centeredSlides: true,
        spaceBetween: 0,   // No gaps between slides
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
                on: {
            slideChange: function (swiper) {
                const activeIndex = swiper.realIndex;
                carouselCaption.innerText = captions[activeIndex] || "No caption available";
            }
        }
    });

    // Set initial caption
    carouselCaption.innerText = captions[0] || "No caption available";
}

function getRandomArrow() {
    const variations = ["D01", "D02", "D03"]; // Add more if needed
    const randomVariant = variations[Math.floor(Math.random() * variations.length)];
    return `../assets/SVG/droparrow_${randomVariant}.svg`;
}

