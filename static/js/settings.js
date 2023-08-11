const settingForms = document.getElementsByName('setting-form');

settingForms.forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault();

        const formData = new FormData(form);

        let url;
        let messageEl;

        if (form.id === 'change-username-form') {
            url = '/change-username';
            messageEl = document.getElementById('message1');
        } else {
            url = '/change-password';
            messageEl = document.getElementById('message2');
        }

        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.response === 'success') {
                window.location.href = '/settings';
            } else {
                messageEl.innerText = `${data.message}`;
            }
        });
    });
});