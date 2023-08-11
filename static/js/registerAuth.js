const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(registerForm);

    fetch('/register-auth', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.response === 'success') {
            window.location.href = '/';
        } else {
            const messageEl = document.getElementById('message');

            messageEl.innerText = `${data.message}`;
        }
    });
});