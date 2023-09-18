const detailsElements = document.querySelectorAll('details');

// Prevents the event from propagating to other elements that may have event listeners for the 'click' event.
detailsElements.forEach((details) => {
    details.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});

// Closes the details element when the body element is clicked
document.body.addEventListener('click', () => {
    detailsElements.forEach((details) => {
        details.removeAttribute('open');
    });
});

// Change the text in the summary according to the options or labels the user selects
function setupOptions(summary, options) {
    options.forEach((label) => {
        label.addEventListener('click', () => {
            summary.textContent = label.textContent;

            const parentDetails = label.closest('details');
            if (parentDetails) {
                parentDetails.removeAttribute('open');
            }
        });
    });
}

const typeSummary = document.querySelector('summary[name="type-summary"] p');
const typeOptions = document.querySelectorAll('#type-options li label');
setupOptions(typeSummary, typeOptions);

const muscleSummary = document.querySelector('summary[name="muscle-summary"] p');
const muscleOptions = document.querySelectorAll('#muscle-options li label');
setupOptions(muscleSummary, muscleOptions);

const difficultySummary = document.querySelector('summary[name="difficulty-summary"] p');
const difficultyOptions = document.querySelectorAll('#difficulty-options li label');
setupOptions(difficultySummary, difficultyOptions);