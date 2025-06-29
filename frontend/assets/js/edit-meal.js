import $ from 'jquery';

import './main.js';

import { API_URL } from './config.js';
import { ensureLoggedIn } from './auth.js';
import { getQueryParam, setTitle } from './helpers.js'; // You should have a helper to get query params

ensureLoggedIn();
setTitle('Edit meal');

const mealId = getQueryParam("id");

if (!mealId) {
    alert("Meal ID missing from URL");
    window.location.href = "meals.html";
}

$(document).ready(() => {
    fetchMeal();

    $('#edit-meal-form').on('submit', function (e) {
        e.preventDefault();
        updateMeal();
    });
});

function fetchMeal() {
    ensureLoggedIn();

    $('#meal-spinner').show();
    $('#edit-meal-form').hide();

    $.get(`${API_URL}/meals/${mealId}`, function (meal) {
        $('#meal-name').val(meal.name);
        $('#meal-calories').val(meal.calories);
        $('#meal-fat').val(meal.fat);
        $('#meal-sugar').val(meal.sugar);
        $('#meal-protein').val(meal.protein);
        $('#meal-weight').val(meal.weight);
        $('#meal-category').val(meal.category);
        $('#meal-img').val(meal.img);
        $('#meal-items').val(meal.items.join(", "));

        // Hide spinner, show form
        $('#meal-spinner').remove();
        $('#edit-meal-form').show();
    }).fail(() => {
        alert("Could not load meal.");
        window.location.href = "meals.html";
    });
}


function updateMeal() {
    ensureLoggedIn();

    const $btn = $('#save-btn');

    // Show spinner and disable
    $btn.prop('disabled', true).html(`
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...
  `);

    const updatedMeal = {
        name: $('#meal-name').val(),
        calories: Number($('#meal-calories').val()),
        fat: Number($('#meal-fat').val()),
        sugar: Number($('#meal-sugar').val()),
        protein: Number($('#meal-protein').val()),
        weight: Number($('#meal-weight').val()),
        category: $('#meal-category').val(),
        img: $('#meal-img').val(),
        items: $('#meal-items').val().split(',').map(item => item.trim())
    };

    $.ajax({
        url: `${API_URL}/meals/${mealId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedMeal),
        success: () => {
            // Show "Saved ✅"
            $btn.html(`Saved ✅`);

            // Wait 1 second then reset button
            setTimeout(() => {
                $btn.prop('disabled', false).text("Save Changes");
            }, 1000);
        },
        error: () => {
            alert("Failed to update meal.");
            $btn.prop('disabled', false).text("Save Changes");
        }
    });
}

