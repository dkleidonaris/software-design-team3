import $ from 'jquery';

import './main.js';

import { API_URL } from './config.js';
import { ensureLoggedIn } from './auth.js';

ensureLoggedIn();

$(document).ready(() => {
    $('#add-meal-form').on('submit', function (e) {
        e.preventDefault();
        createMeal();
    });
});

function createMeal() {
    const $btn = $('#save-btn');

    // Disable and show spinner
    $btn.prop('disabled', true).html(`
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...
  `);

    const newMeal = {
        name: $('#meal-name').val(),
        calories: Number($('#meal-calories').val()),
        fat: Number($('#meal-fat').val()),
        sugar: Number($('#meal-sugar').val()),
        protein: Number($('#meal-protein').val()),
        weight: Number($('#meal-weight').val()),
        category: $('#meal-category').val(),
        img: $('#meal-img').val(),
        items: $('#meal-items').val().split(',').map(i => i.trim())
    };

    $.ajax({
        url: `${API_URL}/meals`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newMeal),
        success: (createdMeal) => {  
            window.location.href = `edit-meal?mealId=${createdMeal._id}`;
        },
        error: () => {
            alert("Failed to create meal.");
            $btn.prop('disabled', false).text("Create Meal");
        }
    });
}
