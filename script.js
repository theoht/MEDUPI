document.addEventListener("DOMContentLoaded", function () {
  // Make sure we start at the top
  window.scrollTo(0, 0);

  const header = document.querySelector(".header");
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

  // Shrink the header and re-enable scroll after the animation finishes
  function shrinkHeader() {
    if (!headerShrunk) {
      headerShrunk = true;

      header.style.height = minHeight + "px";
      content.style.marginTop = minHeight + "px";

      // Wait for transition to finish (matches CSS transition duration)
      setTimeout(() => {
        enableScroll(); // allow scrolling after animation
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
