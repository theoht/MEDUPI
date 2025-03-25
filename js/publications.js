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

  let selectedLink = null; // Track the currently selected publication
  const publicationList = document.getElementById("publication-list");
  const publicationContent = document.getElementById("publication-content");

  // Fetch the publications when the page loads
  fetch("publications.json")
    .then((response) => response.json())
    .then((publications) => {
      const publicationIdFromURL = getQueryParam("id"); // Get publication ID from URL query

      publications.forEach((publication) => {
        const link = document.createElement("a");
        link.href = `?id=${publication.id}`; // Ensure the publication ID is passed in the URL
        link.innerHTML = publication.title + "<br>" + publication.author;
        
        link.setAttribute("data-id", publication.id);

        const listItem = document.createElement("li");
        listItem.appendChild(link);
        publicationList.appendChild(listItem);

        // Highlight the publication if it matches the ID in the URL
        if (publicationIdFromURL && publicationIdFromURL == publication.id) {
          link.style.fontWeight = "bold";
          link.innerHTML = publication.title + "<br>" + publication.author + " ●"; // Add the circle to selected publication
          selectedLink = link; // Mark this link as selected

          // Populate content immediately when the page loads
          const publicationData = publication; // No need to find it again
          populatePublicationContent(publicationData);
        }

        // Add event listener for clicking a publication
        link.addEventListener("click", (event) => {
          event.preventDefault();

          // Remove bold and circle from previously selected link
          if (selectedLink) {
            selectedLink.style.fontWeight = "";
            selectedLink.style.backgroundColor = "";
            selectedLink.innerHTML = selectedLink.innerHTML.replace(" ●", "");
          }

          // Apply bold and append the circle to the clicked link
          link.style.fontWeight = "bold";
          link.style.backgroundColor = "orange"; // Or any color you prefer
          link.innerHTML= publication.title  + "<br>" + publication.author + " ●";
          selectedLink = link; // Update selected link

          const publicationId = event.target.getAttribute("data-id");
          const publicationData = publications.find(
            (pub) => pub.id === parseInt(publicationId)
          );

          if (publicationData) {
            // Populate the content
            populatePublicationContent(publicationData);
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching publications:", error);
    });

  // Function to populate publication content
  function populatePublicationContent(publicationData) {
    // Clear previous content
    publicationContent.innerHTML = "";

    // Create the main content container
    const mainContent = document.createElement("div");
    mainContent.classList.add("pub-main__content");

    // Title
    const titleElement = document.createElement("p");
    titleElement.classList.add("pub-title");
    titleElement.innerHTML = formatText(publicationData.title);

    // Author
    const authorElement = document.createElement("p");
    authorElement.classList.add("pub-author");
    authorElement.textContent = `by ${publicationData.author}`;

    // Cover image
    const coverImg = document.createElement("img");
    coverImg.src = publicationData.frontcover;
    coverImg.alt = `${publicationData.title} Front Cover`;
    coverImg.classList.add("pub-frontcover");

    // Description / Content
    const contentElement = document.createElement("div");
    contentElement.classList.add("pub-content");
    contentElement.innerHTML = formatText(publicationData.content);

    // Specs (optional, styled like additional info)
    const specsElement = document.createElement("div");
    specsElement.classList.add("pub-specs");
    specsElement.innerHTML = `
      <p>${publicationData.specs.year}</p>
      <p>${publicationData.specs.language}</p>
      <p>${publicationData.specs.pages}</p>
      <p>${publicationData.specs.physical}</p>
      <p>ISBN: ${publicationData.specs.ISBN}</p>
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
    mainContent.appendChild(spreadsContainer);
    mainContent.appendChild(specsElement);

    // Inject it into the page
    publicationContent.appendChild(mainContent);
  }

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
