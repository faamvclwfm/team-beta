
function addNewForm() {
    let formSection = document.getElementById('form-section');
    let newForm = document.querySelector('.form-instance').cloneNode(true);
    
    // Reset input values
    newForm.querySelectorAll('input, select').forEach(input => {
        input.value = input.defaultValue;
        if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        }

        // Ensure event listeners are added only once
        input.addEventListener('input', updateSummary);
        input.addEventListener('change', updateSummary);
    });

    formSection.appendChild(newForm);
    updateSummary(); // Update summary immediately
}

function removeForm(button) {
    let forms = document.querySelectorAll('.form-instance');
    let summaryBody = document.getElementById('summary-body');
    let summarySection = document.getElementById('summary');

    // Ensure at least one form remains
    if (forms.length > 1) {
        button.parentElement.remove();
    } else if (forms.length === 1) { // When only one form is left
        summaryBody.innerHTML = ''; // Clear summary table
        summarySection.style.display = 'none'; // Hide summary section

        // Reset all inputs and selects to default values
        let inputs = document.querySelectorAll('.form-instance input, .form-instance select');
        inputs.forEach(input => {
            if (input.tagName === 'SELECT') {
                input.selectedIndex = 0; // Reset select options to default
            } else {
                input.value = input.defaultValue; // Reset input values
            }
        });
    }
    updateSummary();
}

function updateSummary() {
    const dailyRates = {
        "Junior": 400,
        "Midlevel": 500,
        "Senior": 600
    };
    let forms = document.querySelectorAll('.form-instance');
    let summaryBody = document.getElementById('summary-body');
    let summarySection = document.getElementById('summary');
    let priceIndication = document.getElementById('price-indication');
    
    summaryBody.innerHTML = '';
    let totalCost = 0;
    let hasValidData = false;

    // Workdays per month per region
    const workDaysPerMonth = {
        "Eastern Europe": 18.5,
        "Western Europe": 17.5,
        "North Africa": 17.5,
        "Southeast Asia": 19.5
    };

    forms.forEach(form => {
        let role = form.querySelector('.role');
        let level = form.querySelector('.level');
        let region = form.querySelector('.region');
        let developersInput = form.querySelector('.developers');
        let durationInput = form.querySelector('.duration');
        if (!role.value || !level.value || !region.value) {
            return;
        }

        let developers = parseInt(developersInput.value) || 0;
        let duration = parseInt(durationInput.value) || 0;

        // Clear previous error messages
        let errorMessages = developersInput.parentNode.querySelectorAll('p');
        errorMessages.forEach(msg => msg.remove());
        errorMessages = durationInput.parentNode.querySelectorAll('p');
        errorMessages.forEach(msg => msg.remove());

        // Validate inputs
        if (developers < 1) { // Allow 1 as a valid input
            let errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message')
            errorMessage.textContent = 'At least 1 specialist required';
            developersInput.parentNode.insertBefore(errorMessage, developersInput.nextSibling);
        }

        if (duration < 1) { // Allow 1 as a valid input
            let errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message')
            errorMessage.textContent = 'At least 1 month required';
            durationInput.parentNode.insertBefore(errorMessage, durationInput.nextSibling);
        }
        
        let workDays = workDaysPerMonth[region.options[region.selectedIndex].text] || 0;
        // Remove existing error messages
        developersInput.nextElementSibling?.classList.contains('error-message') && developersInput.nextElementSibling.remove();
        durationInput.nextElementSibling?.classList.contains('error-message') && durationInput.nextElementSibling.remove();

        // Validate "Number of IT Specialists"
        if (developers < 1) {
            let errorMessage = document.createElement('p');
            errorMessage.textContent = 'At least 1 specialist required';
            errorMessage.classList.add('error-message');
            developersInput.parentNode.insertBefore(errorMessage, developersInput.nextSibling);

            // **Clear the duration field if IT specialists input is invalid**
            durationInput.value = ''; 
            return; // Stop processing this form
        }

        // Validate "Duration"
        if (duration < 1) {
            let errorMessage = document.createElement('p');
            errorMessage.textContent = 'At least 1 month required';
            errorMessage.classList.add('error-message');
            durationInput.parentNode.insertBefore(errorMessage, durationInput.nextSibling);
            return; // Stop processing this form
        }

        if (workDays === 0) {
            return;
        }
        hasValidData = true;

        let cost = developers  * dailyRates[level.options[level.selectedIndex].text] * duration * workDays;
        totalCost += cost;

        let row = `<tr>
        <td>${role.options[role.selectedIndex].text}</td>
        <td>${level.options[level.selectedIndex].text}</td>
        <td>${dailyRates[level.options[level.selectedIndex].text]} €</td>
        </tr>`;
        
        summaryBody.innerHTML += row;
    });

    if (hasValidData) {
        let lowerBound = totalCost * 0.9;
        let upperBound = totalCost * 1.1;
        priceIndication.innerText = `${lowerBound.toFixed(2)} € - ${upperBound.toFixed(2)} €`;
        summarySection.style.display = 'block';
    } else {
        summarySection.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.form-instance input, .form-instance select').forEach(input => {
        input.addEventListener('input', updateSummary);
        input.addEventListener('change', updateSummary);
    });

    updateSummary(); // Ensure summary updates on initial load
});
