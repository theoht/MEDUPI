document.addEventListener("DOMContentLoaded", () => {


    //Load header already shrunk
    document.addEventListener("DOMContentLoaded", function () {
        const header = document.querySelector(".header");
        const headerContent = document.querySelector(".header-content");

        if (header) {
            header.style.height = "80px"; // Keep the header small
        }

        if (headerContent) {
            headerContent.style.transform = "translateX(calc(-50vw + 120px))"; // Maintain alignment
        }
    });

    
    // Function to extract query parameters from the URL
    function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }
  
    const publicationId = getQueryParam("id");
  
    if (!publicationId) {
      document.querySelector(".publication-container").textContent =
        "Publication ID is missing.";
      return;
    }
  
    fetch("publications.json")
      .then((response) => response.json())
      .then((publications) => {
        const publication = publications.find(
          (pub) => pub.id === parseInt(publicationId)
        );
  
        if (!publication) {
          document.querySelector(".publication-container").textContent =
            "Publication not found.";
          return;
        }
  
        // Populate the page with publication details
        document.getElementById("cover-image").src = publication.cover_photo;
        document.getElementById("cover-image").alt = publication.title; //Use alt text
        document.getElementById("publication-title").textContent =
          publication.title;
        document.getElementById("publication-author").textContent =
          "By " + publication.author;
        document.getElementById("publication-content").textContent =
          publication.content;
      })
      .catch((error) =>
        console.error("Error fetching publication details:", error)
      );
  });
  