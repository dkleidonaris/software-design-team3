import 'bootstrap';
import $ from 'jquery';
window.$ = $;

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/main.css';

import { loadTemplates } from './include.js';
import { checkAuthStatus, bindLogoutHandler } from './auth.js';
import { setFavicon, setTitle} from './helpers.js';

setTitle();
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

$(document).ready(function () {
    const swiper = new Swiper('.swiper', {
      slidesPerView: 3,
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        576: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
      },
    });
});

// Auto send Auth Header with ajax requests
$.ajaxSetup({
    beforeSend: function (xhr) {
        const token = localStorage.getItem('token');
        if (token) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
    }
});


// index background img animation trigger
document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.fade-slide-up');
  if (el) {
    setTimeout(() => {
      el.classList.add('visible');
    }, 300); // μικρή καθυστέρηση για smooth feel
  }
});


//welcome image and text
document.addEventListener('DOMContentLoaded', () => {
  const fadeElements = document.querySelectorAll('.fade-slide-up');
  fadeElements.forEach(el => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 300);
  });
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