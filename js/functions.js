function loaded(callable){document.addEventListener("DOMContentLoaded", callable);}
function $(selector){return document.querySelector(selector);}
function $$(selector){return document.querySelectorAll(selector);}

var eventClickMouse = new MouseEvent('click', {
    'view': window,
    'bubbles': true,
    'cancelable': true
});
