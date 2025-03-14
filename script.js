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
});

document.addEventListener("DOMContentLoaded", () => {

  const sections = document.querySelectorAll('.section');

  // Define separate fade zones for sidebar and main
  const sidebarFadeStart = 80; // Sidebar starts fading here (px from top)
  const sidebarFadeEnd = 60;    // Sidebar fully faded here

  const mainFadeStart = -180;     // Main content starts fading here
  const mainFadeEnd = -280;       // Main fully faded here

  function handleScroll() {
    sections.forEach(section => {
      const sidebar = section.querySelector('.section-sidebar');
      const main = section.querySelector('.section-main');

      // Get the top position of each element relative to the viewport
      const sidebarDistance = sidebar.getBoundingClientRect().top;
      const mainDistance = main.getBoundingClientRect().top;

      // --- SIDEBAR FADE ---
      let sidebarOpacity;
      if (sidebarDistance >= sidebarFadeStart) {
        sidebarOpacity = 1;
      } else if (sidebarDistance <= sidebarFadeEnd) {
        sidebarOpacity = 0;
      } else {
        sidebarOpacity = (sidebarDistance - sidebarFadeEnd) / (sidebarFadeStart - sidebarFadeEnd);
      }

      sidebar.style.opacity = sidebarOpacity;


      // --- MAIN FADE ---
      let mainOpacity;
      if (mainDistance >= mainFadeStart) {
        mainOpacity = 1;
      } else if (mainDistance <= mainFadeEnd) {
        mainOpacity = 0;
      } else {
        mainOpacity = (mainDistance - mainFadeEnd) / (mainFadeStart - mainFadeEnd);
      }

      main.style.opacity = mainOpacity;

    });
  }

  // Attach scroll event
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run on load too
});

document.addEventListener("DOMContentLoaded", () => {
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
        link.href = `/publications/${publication.id}`;
        link.classList.add("carousel-item");
        link.setAttribute("data-id", publication.id);

        // Create the image (<img>) element
        const img = document.createElement("img");
        img.src = publication.cover_photo || "assets/default_cover.jpg"; // Use a default image if cover_photo is missing
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

      // Initialize Swiper after the slides are added
      const swiper = new Swiper(".swiper-container", {
        slidesPerView: 'auto',
        spaceBetween: 75,
        loop: true,
        centeredSlides: false,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }
      });

      // Event listener for carousel items (moved here to ensure it's attached after dynamic creation)
      const carouselItems = document.querySelectorAll(".carousel-item");
      carouselItems.forEach((item) => {
        item.addEventListener("click", function (event) {
          event.preventDefault(); // Prevent the default link behavior
          const publicationId = item.getAttribute("data-id");
          window.location.href = `publications.html?id=${publicationId}`;
        });
      });
    })
    .catch((error) => console.error("Error fetching publications:", error));
});


const carouselItems = document.querySelectorAll('.carousel-item');
carouselItems.forEach(item => {
    item.addEventListener('click', function () {
        const publicationId = item.getAttribute('data-id');
        window.location.href = `/publications/${publicationId}`;
    });
});

