document.addEventListener("DOMContentLoaded", function () {
    // Make sure we start at the top
    window.scrollTo(0, 0);
  
    const header = document.querySelector(".header");
    const content = document.querySelector(".content");
    const minHeight = 80; // Final header height
    let headerShrunk = false;
  
    function shrinkHeader() {
      if (!headerShrunk) {
        headerShrunk = true;
        header.style.height = minHeight + "px";
        content.style.marginTop = minHeight + "px";
  
        // Once shrunk, prevent further triggering
        window.removeEventListener("wheel", handleUserScroll);
        window.removeEventListener("touchstart", handleUserScroll);
        window.removeEventListener("keydown", handleKeyScroll);
      }
    }
  
    function handleUserScroll() {
      shrinkHeader();
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 300);
    }
  
    function handleKeyScroll(event) {
      const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space"];
      if (keys.includes(event.code)) {
        shrinkHeader();
      }
    }
  
    // Only trigger shrink on deliberate user action
    window.addEventListener("wheel", handleUserScroll, { once: true });
    window.addEventListener("touchstart", handleUserScroll, { once: true });
    window.addEventListener("keydown", handleKeyScroll, { once: true });
  });
  