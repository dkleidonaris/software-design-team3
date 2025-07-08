import $ from 'jquery';
import emailjs from '@emailjs/browser';

import './main.js';

import { setTitle } from './helpers.js';

setTitle('Contact');

$(document).ready(() => {
    $('#contact-form').on('submit', function (e) {
        e.preventDefault();

        const $form = $(this);
        const $button = $form.find('button[type="submit"]');
        const $originalText = $button.html();

        // Add spinner to button
        $button.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...');

        // Send email using form element
        emailjs.sendForm(
            'uth',                    // your service ID
            'template_3o8l0t4',       // your template ID
            this,                     // form element
            'c-8eWYX8LWku98iCu'       // your public key
        )
            .then((result) => {
                showAlert('Your message was sent successfully!', 'success');
                $form[0].reset(); // clear form
            })
            .catch((error) => {
                showAlert('There was an error sending your message. Please try again later.', 'danger');
                console.error('Email error:', error);
            })
            .finally(() => {
                $button.prop('disabled', false).html($originalText);
            });
    });

    function showAlert(message, type = 'success') {
        const alert = $(`
      <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `);
        $('#contact-form').after(alert);
    }
});
