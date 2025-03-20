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

    // Workdays per month per region (as per the document)
    const workDaysPerMonth = {
        "Eastern Europe": 18.5,
        "Western Europe": 17.5,
        "North Africa": 17.5,
        "Offshore": 19.5
    };

    forms.forEach(form => {
        let role = form.querySelector('.role');
        let level = form.querySelector('.level');
        let region = form.querySelector('.region');

        if (!role.value || !level.value || !region.value) {
            return;
        }

        let developers = parseInt(form.querySelector('.developers').value) || 0;
        let duration = parseInt(form.querySelector('.duration').value) || 0;
        
        let workDays = workDaysPerMonth[region.options[region.selectedIndex].text] || 0;

        if (developers <= 0 || duration <= 0 || workDays === 0) {
            return;
        }

        hasValidData = true;

        let cost = developers * parseFloat(role.value) * parseFloat(level.value) * duration * workDays;
        totalCost += cost;

        let row = `<tr>
            <td>${role.options[role.selectedIndex].text}</td>
            <td>${level.options[level.selectedIndex].text}</td>
            <td>${cost.toFixed(2)} €</td>
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
