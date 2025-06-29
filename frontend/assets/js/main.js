import $ from 'jquery';
window.$ = $;
import 'bootstrap';

$.ajaxSetup({
    beforeSend: function (xhr) {
        const token = localStorage.getItem('token');
        if (token) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
    }
});

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/main.css';

import { loadTemplates } from './include.js';

const API_URL = import.meta.env.VITE_API_URL;
import { checkAuthStatus, bindLogoutHandler } from './auth.js';

async function init() {
    setFavicon('/assets/img/favicon.ico');
    await loadTemplates();
    bindLogoutHandler();
    await checkAuthStatus();
}

function setFavicon(url) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = url;
}

$(document).ready(function () {
    init();
});