document.addEventListener("DOMContentLoaded", function () {
  const glideWrapper = document.getElementById("glide-wrapper");

  fetch("publications.json")
    .then((response) => response.json())
    .then((publications) => {
      publications.forEach((publication) => {
        const glideSlide = document.createElement("li");
        glideSlide.classList.add("glide__slide");

        const link = document.createElement("a");
        link.href = `/publications.html?id=${publication.id}`;
        link.classList.add("carousel-item");

        // Image container
        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("carousel-img-wrapper");

        const img = document.createElement("img");
        img.src = publication.frontcover || "assets/default_cover.jpg";
        img.alt = publication.title;
        img.classList.add("carousel-img");

        imgWrapper.appendChild(img);

        // Caption
        const caption = document.createElement("div");
        caption.classList.add("carousel-caption");
        caption.textContent = publication.title;

        // Structure
        link.appendChild(imgWrapper);
        link.appendChild(caption);
        glideSlide.appendChild(link);
        glideWrapper.appendChild(glideSlide);
      });

      // Initialize Glide.js
      new Glide(".glide", {
        type: "carousel",
        perView: window.innerWidth < 768 ? 1 : 3,
        focusAt: "center",
        gap: 20,
        breakpoints: {
          768: {
            perView: 1,
            focusAt: "center",
            gap: 10,
          },
        },
      }).mount();
    })
    .catch((error) => console.error("Error fetching publications:", error));
});

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

          latestPostContainer.innerHTML = html;
      } else {
          document.getElementById("latest-post").innerHTML = "<p>No updates found.</p>";
      }
  } catch (error) {
      console.error("Error loading latest update:", error);
      document.getElementById("latest-post").innerHTML = "<p>Failed to load update.</p>";
  }
}

async function fetchFooter(){
  fetch("footer.html")
      .then(response => response.text())
      .then(data => document.getElementById("footer-container").innerHTML = data)
      .catch(error => console.error("Error loading footer:", error));
}

document.addEventListener("DOMContentLoaded", loadLatestPost);
document.addEventListener("DOMContentLoaded", fetchFooter);
