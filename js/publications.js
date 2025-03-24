document.addEventListener("DOMContentLoaded", () => {
  // Function to extract query parameters from the URL (optional for later)
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Function to replace line breaks with <br> for any text field
  function formatText(text) {
    return text ? text.replace(/\n/g, "<br>") : "";
  }

  // Fetch the publications when the page loads
  fetch("publications.json")
    .then((response) => response.json())
    .then((publications) => {
      const publicationList = document.getElementById("publication-list");
      const publicationContent = document.getElementById("publication-content");

      publications.forEach((publication) => {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = publication.title;
        link.setAttribute("data-id", publication.id);

        const listItem = document.createElement("li");
        listItem.appendChild(link);
        publicationList.appendChild(listItem);

        link.addEventListener("click", (event) => {
          event.preventDefault();
          const publicationId = event.target.getAttribute("data-id");

          const publicationData = publications.find(
            (pub) => pub.id === parseInt(publicationId)
          );

          if (publicationData) {
            // Clear previous content
            publicationContent.innerHTML = "";

            // Create the main content container
            const mainContent = document.createElement("div");
            mainContent.classList.add("pub-main__content");

            // Cover image
            const coverImg = document.createElement("img");
            coverImg.src = publicationData.frontcover;
            coverImg.alt = `${publicationData.title} Front Cover`;
            coverImg.classList.add("pub-frontcover");

            // Title
            const titleElement = document.createElement("h2");
            titleElement.classList.add("pub-title");
            titleElement.innerHTML = formatText(publicationData.title);

            // Author
            const authorElement = document.createElement("h3");
            authorElement.classList.add("pub-author");
            authorElement.textContent = `by ${publicationData.author}`;

            // Description / Content
            const contentElement = document.createElement("div");
            contentElement.classList.add("pub-content");
            contentElement.innerHTML = formatText(publicationData.content);

            // Specs (optional, styled like additional info)
            const specsElement = document.createElement("div");
            specsElement.classList.add("pub-specs");
            specsElement.innerHTML = `
              <p><strong>Year:</strong> ${publicationData.specs.year}</p>
              <p><strong>Language:</strong> ${publicationData.specs.language}</p>
              <p><strong>Pages:</strong> ${publicationData.specs.pages}</p>
              <p><strong>Physical:</strong> ${publicationData.specs.physical}</p>
              <p><strong>ISBN:</strong> ${publicationData.specs.ISBN}</p>
            `;

            // Spread images container
            const spreadsContainer = document.createElement("div");
            spreadsContainer.classList.add("pub-spreads");

            // Loop through spreads dynamically
            Object.keys(publicationData).forEach((key) => {
              if (key.startsWith("spread") && publicationData[key]) {
                const spreadImg = document.createElement("img");
                spreadImg.src = publicationData[key];
                spreadImg.alt = `${publicationData.title} Spread`;
                spreadImg.classList.add("pub-spread");
                spreadsContainer.appendChild(spreadImg);
              }
            });

            // Append everything to the main content container
            mainContent.appendChild(coverImg);
            mainContent.appendChild(titleElement);
            mainContent.appendChild(authorElement);
            mainContent.appendChild(contentElement);
            mainContent.appendChild(specsElement);
            mainContent.appendChild(spreadsContainer);

            // Inject it into the page
            publicationContent.appendChild(mainContent);
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching publications:", error);
    });

  // ===== Menu Code =====
  const burgerIcon = document.getElementById("burger-icon");
  const menuIcon = document.getElementById("menu-icon");
  const headerMenu = document.getElementById("header-menu");

  let menuOpen = false;

  burgerIcon.addEventListener("click", function () {
    menuOpen = !menuOpen;
    headerMenu.classList.toggle("show");

    menuIcon.src = menuOpen
      ? "assets/SVG/droparrow_L.svg"
      : "assets/SVG/burger.svg";
  });
});
