function addNewForm() {
    let formSection = document.getElementById('form-section');
    let newForm = document.querySelector('.form-instance').cloneNode(true);
    newForm.querySelectorAll('input, select').forEach(input => {
        input.value = input.defaultValue; // Reset input values
        if (input.tagName === 'SELECT') {
            input.selectedIndex = 0; // Set select options to default
        }
    });
    formSection.appendChild(newForm);
    
    // Add event listeners to update summary on input change for initial form
    document.querySelectorAll('.form-instance input, .form-instance select').forEach(input => {
        input.addEventListener('input', updateSummary);
        input.addEventListener('change', updateSummary);
    });
    newForm.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', updateSummary);
        input.addEventListener('change', updateSummary);
    });

    updateSummary();
}

function removeForm(button) {
    let forms = document.querySelectorAll('.form-instance');

    // Ensure at least one form remains
    if (forms.length > 1) {
        button.parentElement.remove();
    } else if (forms.length === 1) {
        let summaryBody = document.getElementById('summary-body');
        let summarySection = document.getElementById('summary');
        summaryBody.innerHTML = '';
        summarySection.style.display = 'none';
    }
    updateSummary();
}

function updateSummary() {
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
        "Offshore": 19.5
    };

    // Daily rates mapping
    const dailyRates = {
        "IT Project Manager": { "Midlevel": 400, "Senior": 500 },
        "Software Developer": { "Midlevel": 500, "Senior": 600 }
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
            durationInput.value = ''; // Clear duration field
            return;
        }

        // Validate "Duration"
        if (duration < 1) {
            let errorMessage = document.createElement('p');
            errorMessage.textContent = 'At least 1 month required';
            errorMessage.classList.add('error-message');
            durationInput.parentNode.insertBefore(errorMessage, durationInput.nextSibling);
            return;
        }

        if (workDays === 0) {
            return;
        }

        // Get selected text values from dropdowns
        let roleName = role.options[role.selectedIndex].text;
        let levelName = level.options[level.selectedIndex].text;

        // Get the correct daily rate from the mapping
        let dailyRate = dailyRates[roleName]?.[levelName] || 0;

        // **Calculate cost** (Total cost based on duration, specialists, and workdays)
        let cost = developers * dailyRate * duration * workDays;
        totalCost += cost;
        hasValidData = true;

        // **Add row to summary table**
        let row = `<tr>
            <td>${roleName}</td>
            <td>${levelName}</td>
            <td>${dailyRate} €</td> <!-- Daily rate column -->
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

