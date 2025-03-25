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
    card.className = "shadow-xl w-80 rounded-xl border-white cursor-pointer";

    // Contenido de la tarjeta
    card.innerHTML = `
            <figure class="w-full overflow-hidden rounded-t-xl">
                <img src="${stays.photo}" 
                     alt="${stays.title}" 
                     class="w-full h-60 object-cover">
            </figure>
            <div class="px-4 pt-4 border-t-1 flex flex-col gap-2 border-gray-300">
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
