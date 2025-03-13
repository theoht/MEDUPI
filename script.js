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

  const mainFadeStart = -140;     // Main content starts fading here
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

const swiper = new Swiper('.swiper-container', {
  slidesPerView: 'auto',
  spaceBetween: 75,     
  loop: true,   
  centeredSlides: true,   
  centeredSlidesBounds: true,     
  navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
  },
});

const carouselItems = document.querySelectorAll('.carousel-item');
carouselItems.forEach(item => {
    item.addEventListener('click', function () {
        const publicationId = item.getAttribute('data-id');
        window.location.href = `/publications/${publicationId}`;
    });
});

document.addEventListener("DOMContentLoaded", function() {
  // Get the publication ID from the URL (e.g., /publications/1)
  const urlParams = new URLSearchParams(window.location.search);
  const publicationId = parseInt(urlParams.get('id'));

  // Fetch the publications JSON data (this can be a static file or from a server)
  fetch('publications.json')
      .then(response => response.json())
      .then(data => {
          // Find the publication by ID
          const publication = data.find(pub => pub.id === publicationId);

          // If the publication is found, populate the page
          if (publication) {
              document.getElementById('publication-title').textContent = publication.title;
              document.getElementById('publication-author').textContent = "By: " + publication.author;
              document.getElementById('publication-cover-photo').src = publication.cover_photo;
              document.getElementById('publication-content').textContent = publication.content;
          } else {
              document.getElementById('publication-container').innerHTML = "<p>Publication not found.</p>";
          }
      })
      .catch(error => {
          console.error('Error loading publications data:', error);
      });
});

