document.addEventListener("DOMContentLoaded", function () {
  // Make sure we start at the top
  window.scrollTo(0, 0);

  const header = document.querySelector(".header");
  const headerContent = document.querySelector(".header-content");  // The container
  const content = document.querySelector(".content");
  const minHeight = 80; // Final header height
  const transitionDuration = 1500; // Match your CSS transition (1.5s)
  let headerShrunk = false;

  // Scroll Lock Flag
  let isScrollDisabled = true;

  // Disable scrolling by locking scroll position + overflow hidden
  function disableScroll() {
    document.body.style.overflow = "hidden";

    // Keep resetting scroll position
    window.addEventListener("scroll", lockScroll);
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("wheel", preventDefault, { passive: false });
  }

  // Re-enable scrolling by removing the locks
  function enableScroll() {
    document.body.style.overflow = "";

    window.removeEventListener("scroll", lockScroll);
    window.removeEventListener("touchmove", preventDefault);
    window.removeEventListener("wheel", preventDefault);

    isScrollDisabled = false;
  }

  // Keep scroll locked at the top
  function lockScroll() {
    if (isScrollDisabled) {
      window.scrollTo(0, 0);
    }
  }

  // Prevent default scroll behavior (for wheel & touchmove)
  function preventDefault(e) {
    if (isScrollDisabled) {
      e.preventDefault();
    }
  }

  function shrinkHeader() {
    if (!headerShrunk) {
      headerShrunk = true;
  
      header.style.height = minHeight + "px";
      content.style.marginTop = minHeight + "px";
  
      // Apply transition for smooth movement
      headerContent.style.transition = `transform ${transitionDuration}ms ease`;
  
      // Calculate the transform value to move from the center to 20px from the leftmost side
      // We start with translateX(0) for the center, and translate it to 20px from the left edge
      const parentWidth = header.offsetWidth;  // The width of the header's parent container
      const moveToLeftOffset = 20;  // Fixed 20px from the left edge
      const offset = moveToLeftOffset / parentWidth * 100;  // Calculate the percentage of the parent's width
  
      // Set the transform to start from the center and move the content to the right by 20px
      headerContent.style.transform = `translateX(calc(-50vw + 120px))`;
  
      // Wait for transition to finish and then re-enable scroll
      setTimeout(() => {
        enableScroll();
      }, transitionDuration);
  
      // Once shrunk, prevent further triggering
      window.removeEventListener("wheel", handleUserScroll);
      window.removeEventListener("touchstart", handleUserScroll);
      window.removeEventListener("keydown", handleKeyScroll);
    }
  }

  function handleUserScroll() {
    shrinkHeader();
  }

  function handleKeyScroll(event) {
    const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space"];
    if (keys.includes(event.code)) {
      shrinkHeader();
    }
  }

  // Init scroll lock
  disableScroll();

  // Only trigger shrink on deliberate user action
  window.addEventListener("wheel", handleUserScroll, { once: true });
  window.addEventListener("touchstart", handleUserScroll, { once: true });
  window.addEventListener("keydown", handleKeyScroll, { once: true });

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