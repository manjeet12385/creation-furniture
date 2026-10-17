document.getElementById("year").textContent = new Date().getFullYear();

const furnitureCanvas = document.querySelector(".furniture-canvas");

const loadFurnitureScene = () => {
  import("./furniture-scene.js")
    .then(({ initFurnitureScene }) => initFurnitureScene())
    .catch((error) => {
      console.error("Unable to load the 3D furniture showcase.", error);
      if (!furnitureCanvas) return;

      furnitureCanvas.hidden = true;
      furnitureCanvas.parentElement.querySelector(".model-controls").hidden = true;
      const fallback = furnitureCanvas.parentElement.querySelector(".furniture-fallback");
      if (fallback) fallback.hidden = false;
    });
};

if (furnitureCanvas && "IntersectionObserver" in window) {
  const sceneObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      sceneObserver.disconnect();
      loadFurnitureScene();
    }
  }, { rootMargin: "200px" });
  sceneObserver.observe(furnitureCanvas);
} else {
  loadFurnitureScene();
}

const menuButton = document.querySelector(".menu-button");
const mainNavigation = document.querySelector("#main-navigation");
const searchDialog = document.querySelector("#search-dialog");
const searchButton = document.querySelector(".icon-button");
const searchInput = document.querySelector("#product-search");

if (searchButton && searchDialog instanceof HTMLDialogElement && searchInput instanceof HTMLInputElement) {
  const closeButton = searchDialog.querySelector(".search-close");

  searchButton.addEventListener("click", () => {
    searchDialog.showModal();
    searchInput.focus();
  });

  closeButton?.addEventListener("click", () => searchDialog.close());

  searchDialog.addEventListener("click", (event) => {
    if (event.target === searchDialog) searchDialog.close();
  });
}

if (menuButton && mainNavigation) {
  const setMenuOpen = (isOpen) => {
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuButton.textContent = isOpen ? "Close" : "Menu";
    mainNavigation.classList.toggle("is-open", isOpen);
  };

  menuButton.addEventListener("click", () => {
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
  });

  mainNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuButton.focus();
    }
  });
}

const collectionVideos = import.meta.glob("./WhatsApp Video*.mp4", {
  eager: true,
  query: "?url",
  import: "default",
});
const collectionVideoSources = Object.entries(collectionVideos)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([, source]) => source);
const galleryGrid = document.querySelector(".gallery-grid");

if (galleryGrid) {
  const galleryStatus = document.querySelector(".gallery-status");
  const photos = Object.entries(
    import.meta.glob("./image*.webp", {
      eager: true,
      query: "?url",
      import: "default",
    }),
  ).sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }));
  const bedPhotos = new Set([
    "image copy 20",
    "image copy 21",
    "image copy 23",
    "image copy 24",
    "image copy 26",
    "image copy 27",
  ]);
  const reclinerPhotos = new Set([
    "image copy 37",
    "image copy 45",
    "image copy 47",
    "image copy 48",
    "image copy 49",
    "image copy 50",
    "image copy 52",
    "image copy 53",
    "image copy 54",
    "image copy 55",
    "image copy 56",
  ]);
  const categoryLabels = { sofa: "Sofa", bed: "Bed", recliner: "Recliner" };
  const categoryNumbers = { sofa: 0, bed: 0, recliner: 0 };

  photos.forEach(([path, imageUrl]) => {
    const fileName = path.slice(2);
    const baseName = fileName.replace(/\.webp$/i, "");
    const category = bedPhotos.has(baseName)
      ? "bed"
      : reclinerPhotos.has(baseName)
        ? "recliner"
        : "sofa";
    categoryNumbers[category] += 1;

    const item = document.createElement("figure");
    item.className = "gallery-item";

    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = `${categoryLabels[category]} design ${String(categoryNumbers[category]).padStart(2, "0")}`;
    image.loading = "lazy";
    image.decoding = "async";

    const caption = document.createElement("figcaption");
    caption.textContent = `${categoryLabels[category]} Design ${String(categoryNumbers[category]).padStart(2, "0")}`;
    item.append(image, caption);
    galleryGrid.append(item);
  });

  collectionVideoSources.forEach((source, index) => {
    const item = document.createElement("figure");
    item.className = "gallery-item gallery-video-item";

    const video = document.createElement("video");
    video.src = source;
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.setAttribute("aria-label", `Creation Furniture workshop video ${index + 1}`);

    const caption = document.createElement("figcaption");
    caption.textContent = `Creation Furniture Workshop Video ${index + 1}`;
    item.append(video, caption);
    galleryGrid.append(item);
  });

  if (galleryStatus) {
    galleryStatus.textContent = `${photos.length} furniture photos and ${collectionVideoSources.length} videos.`;
  }
}

const collectionVideoElements = [...document.querySelectorAll(".collection-video")];
const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

const updateVideoPlayback = (video, isVisible) => {
  if (reducedMotionPreference.matches || document.hidden || !isVisible) {
    video.pause();
    return;
  }

  video.play().catch((error) => {
    if (error.name !== "AbortError") {
      console.error("Unable to play a furniture collection video.", error);
    }
  });
};

const videoObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => updateVideoPlayback(entry.target, entry.isIntersecting));
    }, { threshold: 0.15 })
  : null;

collectionVideoElements.forEach((video) => {
  const videoIndex = video.dataset.video === "secondary" ? 1 : 0;
  const videoSource = collectionVideoSources[videoIndex];
  video.autoplay = false;

  if (videoSource) {
    video.src = videoSource;
    if (videoObserver) {
      videoObserver.observe(video);
    } else {
      updateVideoPlayback(video, true);
    }
  }
});

reducedMotionPreference.addEventListener("change", () => {
  collectionVideoElements.forEach((video) => {
    const bounds = video.getBoundingClientRect();
    const isVisible = bounds.bottom > 0 && bounds.top < window.innerHeight;
    updateVideoPlayback(video, isVisible);
  });
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    collectionVideoElements.forEach((video) => video.pause());
    return;
  }

  collectionVideoElements.forEach((video) => {
    const bounds = video.getBoundingClientRect();
    const isVisible = bounds.bottom > 0 && bounds.top < window.innerHeight;
    updateVideoPlayback(video, isVisible);
  });
});

const productGrid = document.querySelector(".service-grid");

if (productGrid) {
  const bedPhotos = new Set([
    "image copy 20.png",
    "image copy 21.png",
    "image copy 23.png",
    "image copy 24.png",
    "image copy 26.png",
    "image copy 27.png",
  ]);
  const reclinerPhotos = new Set([
    "image copy 37.png",
    "image copy 45.png",
    "image copy 47.png",
    "image copy 48.png",
    "image copy 49.png",
    "image copy 50.png",
    "image copy 52.png",
    "image copy 53.png",
    "image copy 54.png",
    "image copy 55.png",
    "image copy 56.png",
  ]);
  const photos = Object.entries(
    import.meta.glob("./image*.webp", {
      eager: true,
      query: "?url",
      import: "default",
    }),
  ).sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }));
  const categoryLabels = {
    sofa: "Sofa",
    bed: "Bed",
    recliner: "Recliner",
  };
  const categoryNumbers = { sofa: 0, bed: 0, recliner: 0 };

  photos.forEach(([path, imageUrl]) => {
    const fileName = path.slice(2).replace(/\.webp$/i, ".png");
    const category = bedPhotos.has(fileName)
      ? "bed"
      : reclinerPhotos.has(fileName)
        ? "recliner"
        : "sofa";
    categoryNumbers[category] += 1;

    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.category = category;

    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = `${categoryLabels[category]} design ${categoryNumbers[category]}`;
    image.loading = "lazy";

    const copy = document.createElement("div");
    copy.className = "product-copy";

    const tag = document.createElement("span");
    tag.className = "product-tag";
    tag.textContent = categoryLabels[category];

    const title = document.createElement("h3");
    title.textContent = `${categoryLabels[category]} Design ${String(categoryNumbers[category]).padStart(2, "0")}`;

    const meta = document.createElement("div");
    meta.className = "meta-row";

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = "Price on enquiry";

    const details = document.createElement("p");
    details.className = "product-details";
    details.textContent = "Ask about available sizes, upholstery, colours and price.";

    const enquiry = document.createElement("a");
    enquiry.className = "mini-btn";
    enquiry.href = `contact.html?product=${encodeURIComponent(title.textContent)}`;
    enquiry.textContent = "Enquire";

    meta.append(price, enquiry);
    copy.append(tag, title, details, meta);
    card.append(image, copy);
    productGrid.append(card);
  });

  const filterButtons = [...document.querySelectorAll(".tab-btn[data-category]")];
  const productStatus = document.querySelector(".product-status");
  const searchResultsStatus = document.querySelector(".search-results-status");
  let activeCategory = "all";
  let searchTerm = "";
  const hashCategories = {
    sofas: "sofa",
    beds: "bed",
    recliners: "recliner",
  };

  const applyFilter = (category, query = searchTerm) => {
    activeCategory = category;
    searchTerm = query.trim().toLocaleLowerCase();
    let visibleCount = 0;

    productGrid.querySelectorAll(".product-card").forEach((card) => {
      const matchesCategory = category === "all" || card.dataset.category === category;
      const matchesQuery = !searchTerm || card.textContent.toLocaleLowerCase().includes(searchTerm);
      card.hidden = !matchesCategory || !matchesQuery;
      if (!card.hidden) visibleCount += 1;
    });

    if (productStatus) {
      productStatus.textContent = visibleCount
        ? `${visibleCount} ${visibleCount === 1 ? "product" : "products"} found.`
        : "No matching furniture found. Try a different search.";
    }

    if (searchResultsStatus) {
      searchResultsStatus.textContent = visibleCount
        ? `${visibleCount} ${visibleCount === 1 ? "match" : "matches"} found.`
        : "No matching furniture found.";
    }

    filterButtons.forEach((button) => {
      const isActive = button.dataset.category === category;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.category));
  });

  searchInput?.addEventListener("input", () => applyFilter(activeCategory, searchInput.value));

  searchDialog?.querySelector(".search-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    searchDialog.close();
    productGrid.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  searchDialog?.addEventListener("close", () => {
    if (searchButton instanceof HTMLElement) searchButton.focus();
  });

  Object.entries(hashCategories).forEach(([hash, category]) => {
    document.querySelectorAll(`a[href="#${hash}"]`).forEach((link) => {
      link.addEventListener("click", () => applyFilter(category));
    });
  });

  window.addEventListener("hashchange", () => {
    const category = hashCategories[window.location.hash.slice(1)];
    if (category) applyFilter(category);
  });

  const initialCategory = hashCategories[window.location.hash.slice(1)] || "all";
  applyFilter(initialCategory);
}

const form = document.querySelector(".contact-form");

if (form) {
  const product = new URLSearchParams(window.location.search).get("product");
  const requirement = form.querySelector('textarea[name="requirement"]');
  if (product && requirement instanceof HTMLTextAreaElement) {
    requirement.value = `I am interested in ${product}. Please share the available dimensions, upholstery or colour options, price, and delivery details.`;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!(form instanceof HTMLFormElement) || !form.reportValidity()) return;

    const formData = new FormData(form);
    const subject = `Furniture enquiry from ${formData.get("name")}`;
    const body = [
      `Name: ${formData.get("name")}`,
      `Phone: ${formData.get("phone")}`,
      "",
      "Furniture requirement:",
      formData.get("requirement"),
    ].join("\n");
    const emailLink = `mailto:syedtaher007@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const status = form.querySelector(".form-status");

    window.location.assign(emailLink);
    if (status) {
      status.textContent = "Your email app should open with this enquiry ready to send.";
    }
  });
}
