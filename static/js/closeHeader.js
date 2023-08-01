var headerButton = document.getElementsByName('header-button')[0];
var header = document.querySelector('header');

headerButton.addEventListener('click', function() {
    header.style.display = 'none';
});