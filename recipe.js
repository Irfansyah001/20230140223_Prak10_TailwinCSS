document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mealId = urlParams.get("id");

  if (!mealId) {
    document.getElementById("recipe-detail").innerHTML =
      "<p>Recipe not found.</p>";
    return;
  }

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      let ingredients = "";
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const meas = meal[`strMeasure${i}`];
        if (ing && ing.trim()) {
          ingredients += `<li>${meas} ${ing}</li>`;
        }
      }

      document.getElementById("recipe-detail").innerHTML = `
        <h1 class="text-4xl font-extrabold mb-4">${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${
        meal.strMeal
      }" class="rounded shadow mb-6 w-full max-h-[400px] object-cover" />
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">${
          meal.strArea
        } • ${meal.strCategory}</p>
        <h2 class="text-xl font-semibold mb-2">Instructions</h2>
        <p class="mb-4 whitespace-pre-line">${meal.strInstructions}</p>
        <h2 class="text-xl font-semibold mb-2">Ingredients</h2>
        <ul class="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">${ingredients}</ul>
        ${
          meal.strYoutube
            ? `<a href="${meal.strYoutube}" target="_blank" class="text-accent underline">Watch on YouTube</a>`
            : ""
        }
        <div class="mt-6">
          <a href="index.html" class="text-blue-600 hover:underline"><i class="fas fa-arrow-left"></i> Back to Home</a>
        </div>
      `;
    });
});
