import $ from 'jquery';
window.$ = $;
import 'bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/main.css';

import { loadTemplates } from './include.js';

const API_URL = import.meta.env.VITE_API_URL;
import { checkAuthStatus, bindLoginHandler, bindLogoutHandler } from './auth.js';

async function init() {
    await loadTemplates();
    bindLogoutHandler();
    await checkAuthStatus();
}

$(document).ready(function () {
    init();
});