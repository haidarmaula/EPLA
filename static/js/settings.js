const settingForms = document.getElementsByName('setting-form');

function createHeader(message) {
    let body = document.querySelector('body');
    let header = document.createElement('div');
    header.classList.add('absolute', 'top-20', 'w-full', 'p-5', 'flex', 'justify-end', 'items-center', 'bg-yellow-2', 'font-semibold', 'z-20');

    header.innerHTML = `
        <p class="absolute w-full left-0 text-center px-10">${message}</p>
        <button name="header-button" type="button" class="p-1 rounded-md bg-black hover:bg-default-1 hover:scale-105 duration-300 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>                      
        </button>
    `;

    body.insertBefore(header, body.firstChild);

    let headerButton = document.querySelector('[name="header-button"]');

    headerButton.addEventListener('click', function() {
        header.style.display = 'none';
    });
}

settingForms.forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault();

        const formData = new FormData(form);

        let url;
        let messageEl;
        let headerMessage;

        if (form.id === 'change-username-form') {
            url = '/change-username';
            messageEl = document.getElementById('message1');
            headerMessage = 'You have successfully changed your username!';
        } else {
            url = '/change-password';
            messageEl = document.getElementById('message2');
            headerMessage = 'You have successfully changed your password!';
        }

        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.response === 'success') {
                createHeader(headerMessage);
            } else {
                messageEl.innerText = `${data.message}`;
            }
        });
    });
});