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
  const hamburgerSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
  const closeSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

  const setMenuOpen = (isOpen) => {
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuButton.innerHTML = isOpen ? `${closeSvg}<span>Close</span>` : `${hamburgerSvg}<span>Menu</span>`;
    mainNavigation.classList.toggle("is-open", isOpen);
  };

  // Set initial icon
  setMenuOpen(false);

  menuButton.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
  });

  mainNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header") && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
    }
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
  const chairPhotos = new Set([
    "image copy 68",
    "image copy 69",
  ]);
  const categoryLabels = { sofa: "Sofa", bed: "Bed", recliner: "Recliner", chair: "Chair" };
  const categoryNumbers = { sofa: 0, bed: 0, recliner: 0, chair: 0 };

  photos.forEach(([path, imageUrl]) => {
    const fileName = path.slice(2);
    const baseName = fileName.replace(/\.webp$/i, "");
    const category = bedPhotos.has(baseName)
      ? "bed"
      : reclinerPhotos.has(baseName)
        ? "recliner"
        : chairPhotos.has(baseName)
          ? "chair"
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

  const videoTitles = [
    "Workshop Story: Living Room Sofa Upholstery",
    "Workshop Story: Custom Bed & Recliner Crafting",
    "Workshop Story: Handcrafted Dining Chairs & Table Setup",
  ];

  collectionVideoSources.forEach((source, index) => {
    const item = document.createElement("figure");
    item.className = "gallery-item gallery-video-item";

    const video = document.createElement("video");
    video.src = source;
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.setAttribute("aria-label", videoTitles[index] || `Creation Furniture workshop video ${index + 1}`);

    const caption = document.createElement("figcaption");
    caption.textContent = videoTitles[index] || `Creation Furniture Workshop Video ${index + 1}`;
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
  let videoIndex = 0;
  if (video.dataset.video === "secondary" || video.dataset.video === "1") {
    videoIndex = 1;
  } else if (video.dataset.video === "dining" || video.dataset.video === "2" || video.dataset.video === "tertiary") {
    videoIndex = 2;
  }
  const videoSource = collectionVideoSources[videoIndex] || collectionVideoSources[0];
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
  const chairPhotos = new Set([
    "image copy 68.png",
    "image copy 69.png",
  ]);
  const categoryLabels = {
    sofa: "Sofa",
    bed: "Bed",
    recliner: "Recliner",
    chair: "Chair",
  };
  const categoryNumbers = { sofa: 0, bed: 0, recliner: 0, chair: 0 };

  photos.forEach(([path, imageUrl]) => {
    const fileName = path.slice(2).replace(/\.webp$/i, ".png");
    const category = bedPhotos.has(fileName)
      ? "bed"
      : reclinerPhotos.has(fileName)
        ? "recliner"
        : chairPhotos.has(fileName)
          ? "chair"
          : "sofa";
    categoryNumbers[category] += 1;

    const titleText = `${categoryLabels[category]} Design ${String(categoryNumbers[category]).padStart(2, "0")}`;

    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.category = category;

    // Image Wrap with Hover Overlay (Point 6)
    const imageWrap = document.createElement("div");
    imageWrap.className = "image-wrap";
    imageWrap.setAttribute("role", "button");
    imageWrap.setAttribute("tabindex", "0");
    imageWrap.setAttribute("aria-label", `Quick view ${titleText}`);

    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = `${categoryLabels[category]} design ${categoryNumbers[category]}`;
    image.loading = "lazy";

    const hoverOverlay = document.createElement("div");
    hoverOverlay.className = "card-hover-overlay";
    hoverOverlay.innerHTML = `
      <span class="quick-view-trigger">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        Quick View
      </span>
    `;
    imageWrap.append(image, hoverOverlay);

    const copy = document.createElement("div");
    copy.className = "product-copy";

    const tag = document.createElement("span");
    tag.className = "product-tag";
    tag.textContent = categoryLabels[category];

    const title = document.createElement("h3");
    title.textContent = titleText;

    const details = document.createElement("p");
    details.className = "product-details";
    details.textContent = "Custom dimensions, fabric choices, high-density foam & solid wood frame.";

    const meta = document.createElement("div");
    meta.className = "meta-row";

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = "Workshop Direct";

    const metaButtons = document.createElement("div");
    metaButtons.className = "meta-buttons";

    const waMsg = encodeURIComponent(`Hi Creation Furniture, I am interested in ${titleText}. Please share the price, dimensions, and fabric options.`);
    const waBtn = document.createElement("a");
    waBtn.className = "btn-card-wa";
    waBtn.href = `https://wa.me/919959518962?text=${waMsg}`;
    waBtn.target = "_blank";
    waBtn.rel = "noopener noreferrer";
    waBtn.setAttribute("aria-label", `Ask price for ${titleText} on WhatsApp`);
    waBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.1 3.9A11.8 11.8 0 0 0 1.5 18.1L0 24l6.1-1.5A11.8 11.8 0 0 0 24 12a11.7 11.7 0 0 0-3.9-8.1ZM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.6.9 1-3.5-.3-.4A9.8 9.8 0 1 1 12 21.8Zm5.4-7.3c-.3-.2-1.7-.9-2-.9s-.5-.2-.7.2-.8.9-1 1.1-.3.2-.7.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.4 0-.5.1-.7l.5-.6.2-.5c.1-.2 0-.4 0-.6l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.2 1.4 3.4a11 11 0 0 0 4.3 4c.6.2 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.7-.7 1.9-1.3s.3-1.2.2-1.3-.2-.2-.5-.4Z"/></svg>`;

    const enquiry = document.createElement("a");
    enquiry.className = "mini-btn";
    enquiry.href = `contact.html?product=${encodeURIComponent(titleText)}`;
    enquiry.textContent = "Enquire";

    metaButtons.append(waBtn, enquiry);
    meta.append(price, metaButtons);
    copy.append(tag, title, details, meta);
    card.append(imageWrap, copy);
    productGrid.append(card);

    // Quick View handler (Point 6)
    const openQuickView = () => {
      openProductQuickView({
        title: titleText,
        category: categoryLabels[category],
        image: imageUrl,
        waLink: `https://wa.me/919959518962?text=${waMsg}`,
        enquiryLink: `contact.html?product=${encodeURIComponent(titleText)}`,
      });
    };

    imageWrap.addEventListener("click", openQuickView);
    imageWrap.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openQuickView();
      }
    });
    title.addEventListener("click", openQuickView);
  });

  // Quick View Modal Elements (Point 6)
  const quickViewDialog = document.getElementById("quick-view-dialog");
  const quickViewClose = document.getElementById("quick-view-close");
  const quickViewImg = document.getElementById("quick-view-img");
  const quickViewBadge = document.getElementById("quick-view-badge");
  const quickViewTag = document.getElementById("quick-view-tag");
  const quickViewTitle = document.getElementById("quick-view-title");
  const quickViewWaBtn = document.getElementById("quick-view-wa-btn");
  const quickViewEnquireBtn = document.getElementById("quick-view-enquire-btn");

  const openProductQuickView = (data) => {
    if (!quickViewDialog) return;
    quickViewImg.src = data.image;
    quickViewImg.alt = data.title;
    quickViewBadge.textContent = data.category;
    quickViewTag.textContent = data.category;
    quickViewTitle.textContent = data.title;
    quickViewWaBtn.href = data.waLink;
    quickViewEnquireBtn.href = data.enquiryLink;
    quickViewDialog.showModal();
  };

  quickViewClose?.addEventListener("click", () => quickViewDialog?.close());
  quickViewDialog?.addEventListener("click", (e) => {
    if (e.target === quickViewDialog) quickViewDialog.close();
  });

  // Pagination & Load More Controls (Point 3)
  const PAGE_SIZE = 12;
  let visibleLimit = PAGE_SIZE;

  const loadMoreWrap = document.getElementById("load-more-wrap");
  const loadMoreText = document.getElementById("load-more-text");
  const loadMoreProgress = document.getElementById("load-more-progress");
  const btnLoadMore = document.getElementById("btn-load-more");
  const allLoadedMessage = document.getElementById("all-loaded-message");

  const allProductCards = [...productGrid.querySelectorAll(".product-card")];

  const updatePagination = (matchingCards) => {
    const total = matchingCards.length;
    const shown = Math.min(visibleLimit, total);

    matchingCards.forEach((card, index) => {
      card.hidden = index >= shown;
    });

    if (loadMoreText) {
      loadMoreText.textContent = `Showing ${shown} of ${total} designs`;
    }
    if (loadMoreProgress) {
      const pct = total > 0 ? Math.round((shown / total) * 100) : 0;
      loadMoreProgress.style.width = `${pct}%`;
    }

    if (!loadMoreWrap) return;
    if (total <= PAGE_SIZE || shown >= total) {
      if (btnLoadMore) btnLoadMore.hidden = true;
      if (allLoadedMessage) allLoadedMessage.hidden = total === 0;
    } else {
      if (btnLoadMore) btnLoadMore.hidden = false;
      if (allLoadedMessage) allLoadedMessage.hidden = true;
    }
  };

  btnLoadMore?.addEventListener("click", () => {
    visibleLimit += PAGE_SIZE;
    applyFilter(activeCategory, searchTerm, false);
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
    chairs: "chair",
  };

  const applyFilter = (category, query = searchTerm, resetLimit = true) => {
    activeCategory = category;
    searchTerm = query.trim().toLocaleLowerCase();

    if (resetLimit) {
      visibleLimit = PAGE_SIZE;
    }

    const matchingCards = allProductCards.filter((card) => {
      const matchesCategory = category === "all" || card.dataset.category === category;
      const matchesQuery = !searchTerm || card.textContent.toLocaleLowerCase().includes(searchTerm);
      if (!matchesCategory || !matchesQuery) {
        card.hidden = true;
        return false;
      }
      return true;
    });

    updatePagination(matchingCards);

    const visibleCount = matchingCards.length;

    if (productStatus) {
      productStatus.textContent = visibleCount
        ? `${visibleCount} ${visibleCount === 1 ? "design" : "designs"} available.`
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
