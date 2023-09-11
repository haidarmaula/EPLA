const schedulesNav = document.querySelector('[name="schedules"]');

schedulesNav.addEventListener('click', (event) => {
    event.stopPropagation();
});

document.body.addEventListener('click', () => {
    schedulesNav.removeAttribute('open');
});