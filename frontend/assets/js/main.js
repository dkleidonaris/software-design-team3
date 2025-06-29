import 'bootstrap';
import $ from 'jquery';
window.$ = $;

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/main.css';

import { loadTemplates } from './include.js';
import { checkAuthStatus, bindLogoutHandler } from './auth.js';
import { setFavicon } from './helpers.js';

// Auto send Auth Header with ajax requests
$.ajaxSetup({
    beforeSend: function (xhr) {
        const token = localStorage.getItem('token');
        if (token) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
    }
});

async function init() {
    setFavicon('/assets/img/favicon.ico');
    await loadTemplates();
    bindLogoutHandler();
    await checkAuthStatus();
}

$(document).ready(function () {
    init();
});