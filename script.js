document.getElementById("search-btn").addEventListener("click", searchMeal);

document
  .getElementById("search-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      searchMeal();
    }
  });

function searchMeal() {
  const query = document.getElementById("search-input").value.trim();
  if (!query) return;

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then((res) => res.json())
    .then((data) => {
      const mealList = document.getElementById("meal-list");
      mealList.innerHTML = "";

      if (data.meals) {
        data.meals.forEach((meal) => {
          const mealCard = `
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="cursor-pointer ..." onclick="location.href='recipe.html?id=${meal.idMeal}'">
              <h3 class="..." onclick="location.href='recipe.html?id=${meal.idMeal}'">${meal.strMeal}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">${meal.strArea} • ${meal.strCategory}</p>
              <button onclick="saveToFavorites('${meal.idMeal}')" 
                class="text-sm bg-accent text-white px-3 py-1 rounded hover:bg-red-600 transition">
                Save to Favorites
              </button>
            </div>
          `;
          mealList.innerHTML += mealCard;
        });
      } else {
        mealList.innerHTML =
          "<p class='text-gray-500 dark:text-gray-400'>No results found.</p>";
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function saveToFavorites(idMeal) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(idMeal)) {
    favorites.push(idMeal);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("✅ Recipe saved to favorites!");
  } else {
    alert("❤️ Already in favorites!");
  }
}

function showMealDetails(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      let ingredients = "";
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          ingredients += `<li>${measure} ${ingredient}</li>`;
        }
      }

      const overlay = document.createElement("div");
      overlay.className =
        "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4";
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.remove();
        }
      });

      overlay.innerHTML = `
        <div class="bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-xl shadow-2xl max-w-3xl w-full p-8 relative overflow-y-auto max-h-[90vh] border border-gray-200 dark:border-gray-700 transform transition-all duration-500 opacity-0 translate-y-10" onclick="event.stopPropagation()" id="modal-box">
          <button onclick="this.parentElement.parentElement.remove()" 
            class="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>

          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" 
            class="rounded-lg w-full h-auto object-cover shadow mb-6 border border-gray-200 dark:border-gray-700">

          <h2 class="text-3xl font-extrabold mb-2 tracking-tight">${
            meal.strMeal
          }</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium uppercase">
            ${meal.strArea} • ${meal.strCategory}
          </p>

          <h3 class="text-lg font-bold mb-2">Instructions</h3>
          <p class="text-base leading-relaxed whitespace-pre-line mb-6">${
            meal.strInstructions
          }</p>

          <h3 class="text-lg font-bold mb-2">Ingredients</h3>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mb-6">
            ${ingredients}
          </ul>

          ${
            meal.strYoutube
              ? `
            <div class="text-right">
              <a href="${meal.strYoutube}" target="_blank" 
                 class="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition">
                ▶ Watch on YouTube
              </a>
            </div>`
              : ""
          }
        </div>
      `;

      document.body.appendChild(overlay);
      setTimeout(() => {
        const box = document.getElementById("modal-box");
        if (box) {
          box.classList.remove("opacity-0", "translate-y-10");
          box.classList.add("opacity-100", "translate-y-0");
        }
      }, 10);
    });
}
