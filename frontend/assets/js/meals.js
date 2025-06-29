import $ from 'jquery';

import './main.js';

import { API_URL } from './config.js';
import { setTitle } from './helpers.js';
import { ensureLoggedIn } from './auth.js';

ensureLoggedIn();
setTitle("Meals");

fetchAndRenderMeals();

let allMeals = [];
const itemsPerPage = 10;
let currentPage = 1;

function fetchAndRenderMeals() {
    ensureLoggedIn();

    $('#meal-spinner').show(); // show it just in case
    $.get(`${API_URL}/meals`, function (meals) {
        allMeals = meals;
        $('#meal-spinner').remove(); // hide once loaded
        renderPagination();
        renderMealsPage(currentPage);
    }).fail(function (err) {
        console.error("Failed to fetch meals", err);
        $('#meal-list').html('<p class="text-danger">Could not load meals.</p>');
        $('#meal-spinner').remove(); // hide on failure too
    });
}

function renderMealsPage(page) {
    const $container = $('#meal-list');
    $container.empty();

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const mealsToShow = allMeals.slice(start, end);

    if (!mealsToShow.length) {
        $container.append('<p>No meals available.</p>');
        return;
    }

    mealsToShow.forEach(meal => {
        const itemsList = meal.items.map(item => `<li>${item}</li>`).join('');
        const card = `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${meal.img}" class="card-img-top" alt="${meal.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${meal.name}</h5>
            <p class="card-text">
              <strong>Category:</strong> ${meal.category || '—'}<br>
              <strong>Calories:</strong> ${meal.calories} kcal<br>
              <strong>Fat:</strong> ${meal.fat}g &nbsp;
              <strong>Sugar:</strong> ${meal.sugar}g &nbsp;
              <strong>Protein:</strong> ${meal.protein}g<br>
              <strong>Weight:</strong> ${meal.weight}g
            </p>
            <h6>Ingredients:</h6>
            <ul>${itemsList}</ul>
            <a href="edit-meal?mealId=${meal._id}" class="btn btn-outline-primary mt-auto align-self-start">Edit</a>
          </div>
        </div>
      </div>`;
        $container.append(card);
    });
}

function renderPagination() {
    const $pagination = $('#pagination');
    $pagination.empty();

    const totalPages = Math.ceil(allMeals.length / itemsPerPage);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const active = i === currentPage ? 'active' : '';
        const pageItem = `
      <li class="page-item ${active}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>`;
        $pagination.append(pageItem);
    }

    $('.page-link').on('click', function (e) {
        e.preventDefault();
        currentPage = Number($(this).data('page'));
        renderMealsPage(currentPage);
        renderPagination();
    });
}

