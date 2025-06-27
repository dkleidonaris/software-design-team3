import $ from 'jquery';
window.$ = $;
import 'bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';

import { loadTemplates } from './include.js';
import { checkAuthStatus, logout } from './auth.js';

window.logout = logout;

const API_URL = import.meta.env.VITE_API_URL;

async function init() {
    await loadTemplates();
    await checkAuthStatus();
}

$(document).ready(function () {
    init();
});