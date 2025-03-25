document.addEventListener("DOMContentLoaded", function () {
  const swiperWrapper = document.getElementById("swiper-wrapper");

  fetch("publications.json")
    .then((response) => response.json())
    .then((publications) => {
      publications.forEach((publication) => {
        // Create the swiper-slide div
        const swiperSlide = document.createElement("div");
        swiperSlide.classList.add("swiper-slide");

        // Create the link (<a>) element
        const link = document.createElement("a");
        link.href = `/publications/${publication.id}`; // Using dynamic ID
        link.classList.add("carousel-item");
        link.setAttribute("data-id", publication.id);

        // Create the image (<img>) element
        const img = document.createElement("img");
        img.src = publication.frontcover || "assets/default_cover.jpg"; // Use a default image if cover_photo is missing
        img.alt = "Book Cover";

        // Create the caption (<div>) element
        const caption = document.createElement("div");
        caption.classList.add("carousel-caption");
        caption.textContent = publication.title;

        // Assemble the elements
        link.appendChild(img);
        link.appendChild(caption);
        swiperSlide.appendChild(link);
        swiperWrapper.appendChild(swiperSlide);
      });

      // **Check if Swiper is available before initializing**
      if (typeof Swiper !== "undefined") {
        const swiper = new Swiper(".swiper-container", {
          slidesPerView: "auto",
          spaceBetween: 75,
          loop: true,
          centeredSlides: false,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
        });
      } else {
        console.error("Swiper failed to load.");
      }

      // Event listener for carousel items
      const carouselItems = document.querySelectorAll(".carousel-item");
      carouselItems.forEach((item) => {
        item.addEventListener("click", function (event) {
          event.preventDefault(); // Prevent the default link behavior
          const publicationId = item.getAttribute("data-id");
          window.location.href = `publications.html?id=${publicationId}`; // Pass ID in URL
        });
      });
    })
    .catch((error) => console.error("Error fetching publications:", error));



  fetch("footer.html")
      .then(response => response.text())
      .then(data => document.getElementById("footer-container").innerHTML = data)
      .catch(error => console.error("Error loading footer:", error));


 // Fetch and display latest post
 async function loadLatestPost() {
  try {
      const response = await fetch("updates.json"); // Fetch the JSON file
      const data = await response.json();

      // Ensure there are updates available
      if (data.updates && data.updates.length > 0) {
          const latestUpdate = data.updates[0]; // Get the first update

          const latestPostContainer = document.getElementById("latest-post");
          if (!latestUpdate.title) {
              latestPostContainer.innerHTML = "<p>Latest update has no title.</p>";
              return;
          }

          // Build the HTML structure dynamically
          let html = `
              <h2>${latestUpdate.title}</h2>
              <p>${latestUpdate.copy || "No description available."}</p>
          `;

          if (latestUpdate.images.length > 0) {
              html += `<img src="${latestUpdate.images[0]}" alt="Latest update image" style="max-width:100%;">`;
          }

          html += `<a href="updates.html">Read more</a>`;

          latestPostContainer.innerHTML = html;
      } else {
          document.getElementById("latest-post").innerHTML = "<p>No updates found.</p>";
      }
  } catch (error) {
      console.error("Error loading latest update:", error);
      document.getElementById("latest-post").innerHTML = "<p>Failed to load update.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadLatestPost);

});