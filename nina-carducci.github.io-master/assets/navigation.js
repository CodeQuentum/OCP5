window.addEventListener('load', function() {
    const next = document.getElementById('mg-next');
    const prev = document.getElementById('mg-prev');
    const items = document.querySelectorAll(".gallery-item");
    const lightboxImage = document.querySelector(".lightboxImage");
    let currentIndex = 0;
  
    next.addEventListener("click", event => {
      event.preventDefault();
      const filteredItems = getFilteredItems();
      currentIndex = (currentIndex + 1) % filteredItems.length;
      updateLightboxImage(filteredItems[currentIndex]);
    });
  
    prev.addEventListener("click", event => {
      event.preventDefault();
      const filteredItems = getFilteredItems();
      currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
      updateLightboxImage(filteredItems[currentIndex]);
    });
  
    window.addEventListener('keydown', function(event) {
      const filteredItems = getFilteredItems();
  
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        updateLightboxImage(filteredItems[currentIndex]);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        currentIndex = (currentIndex + 1) % filteredItems.length;
        updateLightboxImage(filteredItems[currentIndex]);
      }
    });
  
    // Ouvrir la modale à partir de l'image sélectionnée
    items.forEach(item => {
      item.addEventListener("click", event => {
        event.preventDefault();
        currentIndex = parseInt(item.getAttribute("data-index"));
        updateLightboxImage(item);
      });
    });
  
    function getFilteredItems() {
      const activeTag = document.querySelector(".tags-bar span.active-tag");
      const filterValue = activeTag ? activeTag.getAttribute("data-images-toggle") : "all";
  
      return Array.from(items).filter(item => filterValue === "all" || item.getAttribute("data-gallery-tag") === filterValue);
    }
  
    function updateLightboxImage(item) {
      const imageSrc = item.getAttribute("src");
      const imageIndex = item.getAttribute("data-index");
  
      lightboxImage.setAttribute("src", imageSrc);
      lightboxImage.setAttribute("data-index", imageIndex);
    }
  });
  