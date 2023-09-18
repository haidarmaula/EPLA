const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(loginForm);

    fetch('/login-auth', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.response === 'success') {
            window.location.href = '/';
        } else {
            const message = document.getElementById('message');

            message.innerText = `${data.message}`;
        }
    });
});