import $ from 'jquery';

import './main.js';

import { setTitle } from './helpers';
import { API_URL } from './config.js';

setTitle();

$('form').on('submit', function (event) {
    event.preventDefault();

    const data = {
        firstName: $(this).find('#firstName').val(),
        lastName: $(this).find('#lastName').val(),
        email: $(this).find('#email').val(),
        hashedPassword: $(this).find('#password').val(),
        age: $(this).find('#age').eq(0).val(),
        gender: $(this).find('#gender').val(),
        weight: $(this).find('#weight').val(),
        height: $(this).find('#height').val(),
    };

    $.ajax({
        url: API_URL + '/users',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            alert('Account created successfully!');
            window.location.href = '/login.html';
        },
        error: function (xhr, status, error) {
            const parsed = JSON.parse(xhr.responseText);
            alert(parsed.error);
        }
    });
});