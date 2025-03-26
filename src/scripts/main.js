/**
 * Aquí estará la lógica principal de la aplicación.
 * Este bloque de código contiene la funcionalidad principal
 * que define el comportamiento del programa.
 */
import { stays } from "./stays.js";

// Función para crear las tarjetas de alojamiento
function createStayCards() {
  const cardContainer = document.getElementById("card_container");
  cardContainer.innerHTML = ""; // Limpiar el contenedor

  stays.forEach((stays) => {
    // Crear elemento de tarjeta
    const card = document.createElement("div");
    card.className = "w-80 rounded-xl border-white cursor-pointer";

    // Contenido de la tarjeta
    card.innerHTML = `
            <figure class="w-full overflow-hidden rounded-xl">
                <img src="${stays.photo}" 
                     alt="${stays.title}" 
                     class="w-full h-60 object-cover">
            </figure>
            <div class="px-4 pt-4 flex flex-col gap-2">
                <div class="flex justify-between items-center">
                    <p class="text-gray-500">
                        ${stays.type}${
      stays.beds ? ` · ${stays.beds} ${stays.beds > 1 ? "beds" : "bed"}` : ""
    }
                    </p>
                    <div class="flex items-center">
                        <img src="./src/images/icons/star.svg" alt="rating" class="w-4 h-4 text-red-500">
                        <span class="text-black ml-1">${stays.rating}</span>
                    </div>
                </div>
                <h2 class="text-lg font-semibold text-gray-800">${
                  stays.title
                }</h2>
            </div>
        `;

    // Agregar tarjeta al contenedor
    cardContainer.appendChild(card);
  });
}

// Llamar a la función cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", createStayCards);

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const body = document.body;
  const navButtons = document.querySelectorAll(".mobile-nav-button");

  // Mostrar modal y bloquear scroll
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modal.classList.remove("hidden");
      body.classList.add("overflow-hidden");
    });
  });

  // Ocultar modal y restaurar scroll
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      body.classList.remove("overflow-hidden");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Elementos del modal desktop
  const desktopModal = document.getElementById("desktopModal");
  const desktopLocationBtn = document.getElementById("desktopLocationBtn");
  const desktopGuestsBtn = document.getElementById("desktopGuestsBtn");
  const desktopSearchBtn = document.getElementById("desktopSearchBtn");

  // Función para abrir el modal
  function openDesktopModal() {
    desktopModal.classList.remove("hidden", "opacity-0");
    desktopModal.classList.add("opacity-100");
    document.body.style.overflow = "hidden";
  }

  // Función para cerrar el modal
  function closeDesktopModal() {
    desktopModal.classList.add("opacity-0");
    desktopModal.querySelector("div").classList.add();

    setTimeout(() => {
      desktopModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }, 300);
  }

  // Event listeners para los botones
  if (desktopLocationBtn)
    desktopLocationBtn.addEventListener("click", openDesktopModal);
  if (desktopGuestsBtn)
    desktopGuestsBtn.addEventListener("click", openDesktopModal);
  if (desktopSearchBtn)
    desktopSearchBtn.addEventListener("click", openDesktopModal);

  // Cerrar al hacer clic fuera del modal
  desktopModal.addEventListener("click", function (e) {
    if (e.target === desktopModal) {
      closeDesktopModal();
    }
  });

  // Cerrar con la tecla ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !desktopModal.classList.contains("hidden")) {
      closeDesktopModal();
    }
  });
});
