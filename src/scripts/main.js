import { stays } from "./stays.js";

// Variables globales para los filtros
let currentFilters = {
  location: "",
  adults: 0,
  children: 0,
};

// Función para mostrar sugerencias de ubicación
function showLocationSuggestions(inputElement) {
  const inputValue = inputElement.value.toLowerCase();
  const suggestionsContainer = document.getElementById(
    `${inputElement.id}Suggestions`
  );

  if (!inputValue) {
    suggestionsContainer.innerHTML = "";
    suggestionsContainer.classList.add("hidden");
    return;
  }

  const uniqueCities = [...new Set(stays.map((stay) => stay.city))];
  const matchedCities = uniqueCities.filter((city) =>
    city.toLowerCase().includes(inputValue)
  );

  suggestionsContainer.innerHTML = matchedCities
    .map(
      (city) => `
    <div class="p-2 hover:bg-gray-100 cursor-pointer">${city}</div>
  `
    )
    .join("");

  if (matchedCities.length > 0) {
    suggestionsContainer.classList.remove("hidden");

    // Agregar event listeners a las sugerencias
    suggestionsContainer.querySelectorAll("div").forEach((suggestion) => {
      suggestion.addEventListener("click", () => {
        inputElement.value = suggestion.textContent;
        currentFilters.location = suggestion.textContent;
        suggestionsContainer.classList.add("hidden");
      });
    });
  } else {
    suggestionsContainer.classList.add("hidden");
  }
}

// Función para crear las tarjetas con SuperHost
function createStayCards(filteredStays = stays) {
  const cardContainer = document.getElementById("card_container");
  const staysCounter = document.getElementById("stays-counter");
  cardContainer.innerHTML = "";

  if (filteredStays.length === 0) {
    cardContainer.innerHTML = `
      <div class="col-span-3 py-12 text-center">
        <p class="text-lg text-gray-500">No stays found matching your criteria</p>
        <button onclick="resetFilters()" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
          Reset filters
        </button>
      </div>
    `;
    staysCounter.textContent = "0 stays";
    return;
  }

  filteredStays.forEach((stay) => {
    const card = document.createElement("div");
    card.className =
      "w-full rounded-xl overflow-hidden transition-shadow duration-300";

    card.innerHTML = `
      <figure class="w-full h-60 overflow-hidden rounded-xl">
        <img src="${stay.photo}" 
             alt="${stay.title}" 
             class="w-full h-full object-cover hover:scale-105 transition duration-300">
      </figure>
      <div class="p-4 flex flex-col gap-2">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2 flex-wrap">
            ${
              stay.superHost
                ? `<span class="border border-gray-800 rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap">
                SUPERHOST
              </span>`
                : ""
            }
            <p class="text-gray-500 text-sm">
              ${stay.type}${
      stay.beds ? ` · ${stay.beds} ${stay.beds > 1 ? "beds" : "bed"}` : ""
    }
            </p>
          </div>
          <div class="flex items-center">
            <img src="./src/images/icons/star.svg" alt="rating" class="w-4 h-4">
            <span class="text-black ml-1 text-sm">${stay.rating}</span>
          </div>
        </div>
        <h2 class="text-lg font-semibold text-gray-800 mt-1">${stay.title}</h2>
      </div>
    `;

    cardContainer.appendChild(card);
  });

  // Contador con límite de 12+
  const totalStays = filteredStays.length;
  if (totalStays > 12) {
    staysCounter.textContent = "12+ stays";
  } else {
    staysCounter.textContent = `${totalStays} ${
      totalStays === 1 ? "stay" : "stays"
    }`;
  }
}

// Función para aplicar filtros
function applyFilters() {
  const filtered = stays.filter((stay) => {
    // Filtrar por ubicación (ciudad o título)
    const locationMatch =
      currentFilters.location === "" ||
      stay.city.toLowerCase().includes(currentFilters.location.toLowerCase()) ||
      stay.title.toLowerCase().includes(currentFilters.location.toLowerCase());

    // Filtrar por capacidad
    const totalGuests = currentFilters.adults + currentFilters.children;
    const capacityMatch = totalGuests === 0 || stay.maxGuests >= totalGuests;

    return locationMatch && capacityMatch;
  });

  // Actualizar el título con los resultados
  const titleElement = document.querySelector("h1");
  if (currentFilters.location) {
    const uniqueCities = [...new Set(filtered.map((stay) => stay.city))];
    titleElement.textContent =
      uniqueCities.length === 1
        ? `Stays in ${uniqueCities[0]}`
        : `Stays matching "${currentFilters.location}"`;
  } else {
    titleElement.textContent = "Stays in Finland";
  }

  createStayCards(filtered);
}

// Función para actualizar el input de huéspedes (desktop)
function updateGuestsInput() {
  const total = currentFilters.adults + currentFilters.children;
  const input = document.querySelector("#guestsInput");
  if (input) {
    input.value =
      total > 0
        ? `${currentFilters.adults} adult${
            currentFilters.adults !== 1 ? "s" : ""
          }` +
          `${
            currentFilters.children > 0
              ? `, ${currentFilters.children} child${
                  currentFilters.children !== 1 ? "ren" : ""
                }`
              : ""
          }`
        : "Add guests";
  }
}

// Función para actualizar el input de huéspedes (mobile)
function updateMobileGuestsInput() {
  const total = currentFilters.adults + currentFilters.children;
  const input = document.querySelector("#mobileGuestsInput");
  if (input) {
    input.value =
      total > 0
        ? `${currentFilters.adults} adult${
            currentFilters.adults !== 1 ? "s" : ""
          }` +
          `${
            currentFilters.children > 0
              ? `, ${currentFilters.children} child${
                  currentFilters.children !== 1 ? "ren" : ""
                }`
              : ""
          }`
        : "Add guests";
  }
}

// Función para resetear filtros
function resetFilters() {
  currentFilters = {
    location: "",
    adults: 0,
    children: 0,
  };

  // Resetear inputs
  document
    .querySelectorAll("#desktopLocationInput, #mobileLocationInput")
    .forEach((input) => {
      input.value = "";
      document.getElementById(`${input.id}Suggestions`).classList.add("hidden");
    });
  document
    .querySelectorAll(".count, .mobile-count")
    .forEach((el) => (el.textContent = "0"));
  document
    .querySelectorAll("#guestsInput, #mobileGuestsInput")
    .forEach((input) => (input.value = "Add guests"));

  applyFilters();
}

// Función para inicializar los event listeners
function initEventListeners() {
  // Event listeners para abrir modales
  document
    .getElementById("mobileGuestsTrigger")
    ?.addEventListener("click", () => {
      document.getElementById("modal").classList.remove("hidden");
    });

  document
    .getElementById("desktopLocationBtn")
    ?.addEventListener("click", () => {
      document.getElementById("desktopModal").classList.remove("hidden");
    });

  document.getElementById("desktopGuestsBtn")?.addEventListener("click", () => {
    document.getElementById("desktopModal").classList.remove("hidden");
    document.getElementById("guestsFilter").classList.remove("hidden");
  });

  // Event listeners para búsqueda
  document
    .getElementById("desktopSearchBtn")
    ?.addEventListener("click", applyFilters);
  document.getElementById("mobileSearchBtn")?.addEventListener("click", () => {
    applyFilters();
    document.getElementById("modal").classList.add("hidden");
  });

  // Mostrar filtro de huéspedes en desktop (corregido para persistencia)
  document.getElementById("guestsTrigger")?.addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("guestsFilter").classList.remove("hidden");
  });

  // Evitar que se cierre el filtro al interactuar con él
  document.getElementById("guestsFilter")?.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Actualizar filtros de ubicación con autocompletado
  document
    .getElementById("desktopLocationInput")
    ?.addEventListener("input", (e) => {
      currentFilters.location = e.target.value;
      showLocationSuggestions(e.target);
    });

  document
    .getElementById("mobileLocationInput")
    ?.addEventListener("input", (e) => {
      currentFilters.location = e.target.value;
      showLocationSuggestions(e.target);
    });

  // Permitir escribir en el input de huéspedes (solo lectura visual)
  document.getElementById("guestsInput")?.addEventListener("focus", () => {
    document.getElementById("guestsFilter").classList.remove("hidden");
  });

  // Contadores de huéspedes desktop
  document.querySelectorAll(".plus-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const container = e.target.closest(".flex.items-center.space-x-4");
      const isAdult = container.previousElementSibling
        .querySelector("p")
        .textContent.includes("Adults");
      const countElement = container.querySelector(".count");

      if (isAdult) currentFilters.adults++;
      else currentFilters.children++;

      countElement.textContent = isAdult
        ? currentFilters.adults
        : currentFilters.children;
      updateGuestsInput();
    });
  });

  document.querySelectorAll(".minus-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const container = e.target.closest(".flex.items-center.space-x-4");
      const isAdult = container.previousElementSibling
        .querySelector("p")
        .textContent.includes("Adults");
      const countElement = container.querySelector(".count");

      if (isAdult && currentFilters.adults > 0) currentFilters.adults--;
      else if (!isAdult && currentFilters.children > 0)
        currentFilters.children--;

      countElement.textContent = isAdult
        ? currentFilters.adults
        : currentFilters.children;
      updateGuestsInput();
    });
  });

  // Contadores de huéspedes mobile
  document.querySelectorAll(".mobile-plus-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const type = e.target.closest("button").getAttribute("data-type");
      const countElement = document.querySelector(
        `.mobile-count[data-type="${type}"]`
      );

      currentFilters[type]++;
      countElement.textContent = currentFilters[type];
      updateMobileGuestsInput();
    });
  });

  document.querySelectorAll(".mobile-minus-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const type = e.target.closest("button").getAttribute("data-type");
      const countElement = document.querySelector(
        `.mobile-count[data-type="${type}"]`
      );

      if (currentFilters[type] > 0) {
        currentFilters[type]--;
        countElement.textContent = currentFilters[type];
        updateMobileGuestsInput();
      }
    });
  });

  // Cerrar modales y sugerencias al hacer clic fuera
  document.addEventListener("click", (e) => {
    // Solo ocultar si se hace clic fuera del filtro y del trigger
    if (
      !e.target.closest("#guestsFilter") &&
      !e.target.closest("#guestsTrigger")
    ) {
      document.getElementById("guestsFilter")?.classList.add("hidden");
    }

    document.querySelectorAll(".suggestions-container").forEach((container) => {
      if (!e.target.closest(`#${container.id.replace("Suggestions", "")}`)) {
        container.classList.add("hidden");
      }
    });
  });

  // Cerrar modales con botones
  document.getElementById("closeModal")?.addEventListener("click", () => {
    document.getElementById("modal").classList.add("hidden");
  });

  document.getElementById("desktopModal")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("desktopModal")) {
      document.getElementById("desktopModal").classList.add("hidden");
    }
  });
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  createStayCards();
  initEventListeners();
  window.resetFilters = resetFilters;
});
