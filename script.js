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

  // Define fade zones (viewport positions)
  const fadeStart = 80; // Start fading out here (px from top of viewport)
  const fadeEnd = 60;   // Fully faded out here

  function handleScroll() {
    sections.forEach(section => {
      const sidebar = section.querySelector('.section-sidebar');
      const main = section.querySelector('.section-main');

      // Get the top position of each element relative to the viewport
      const sidebarDistance = sidebar.getBoundingClientRect().top;
      const mainDistance = main.getBoundingClientRect().top;

      // --- SIDEBAR FADE ---
      let sidebarOpacity;
      if (sidebarDistance >= fadeStart) {
        sidebarOpacity = 1;
      } else if (sidebarDistance <= fadeEnd) {
        sidebarOpacity = 0;
      } else {
        sidebarOpacity = (sidebarDistance - fadeEnd) / (fadeStart - fadeEnd);
      }

      sidebar.style.opacity = sidebarOpacity;


      // --- MAIN FADE ---
      let mainOpacity;
      if (mainDistance >= fadeStart) {
        mainOpacity = 1;
      } else if (mainDistance <= fadeEnd) {
        mainOpacity = 0;
      } else {
        mainOpacity = (mainDistance - fadeEnd) / (fadeStart - fadeEnd);
      }

      main.style.opacity = mainOpacity;

    });
  }

  // Attach scroll event
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run on load too
});

// GLIDEJS
document.addEventListener('DOMContentLoaded', function () {
  const glide = new Glide('.glide', {
    type: 'carousel', // Carousel type, use 'slider' if you want it to behave differently
    perView: 3, // Show 3 items at a time (you can adjust this based on the size of your container)
    gap: 20, // Space between items
    focusAt: 'center', // Focus the center of the carousel
    autoplay: 3000, // Automatically advance every 3 seconds (optional)
    keyboard: true, // Enable keyboard navigation
    breakpoints: {
      1200: {
        perView: 2, // Show 2 items on smaller screens
      },
      768: {
        perView: 1, // Show 1 item on small screens
      }
    }
  });

  glide.mount(); // Mount the carousel
});

