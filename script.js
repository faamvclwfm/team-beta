
function addNewForm() {
    let formSection = document.getElementById('form-section');
    let newForm = document.querySelector('.form-instance').cloneNode(true);
    
    
    newForm.querySelectorAll('input, select').forEach(input => {
        input.value = input.defaultValue;
        if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        }

        
        input.addEventListener('input', updateSummary);
        input.addEventListener('change', updateSummary);
    });

    formSection.appendChild(newForm);
    updateSummary(); 
}

function removeForm(button) {
    let forms = document.querySelectorAll('.form-instance');

    if (forms.length > 1) {
        button.parentElement.remove();
    } else {
        // Reset inputs and selects when only one form is left
        let inputs = document.querySelectorAll('.form-instance input, .form-instance select');
        inputs.forEach(input => {
            if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            } else {
                input.value = input.defaultValue;
            }
        });

        // Clear summary table data but keep summary section visible
        document.getElementById('summary-body').innerHTML = '';
        document.getElementById('price-indication').innerText = "—";
        document.getElementById('additional-options').style.display = "none";
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
    let priceIndication = document.getElementById('price-indication');
    let additionalOptions = document.getElementById('additional-options');

    summaryBody.innerHTML = ''; 
    let totalCost = 0;
    let hasValidData = false;

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

        if (!role.value || !level.value || !region.value) return;

        let developers = parseInt(developersInput.value) || 0;
        let duration = parseInt(durationInput.value) || 0;
        let workDays = workDaysPerMonth[region.options[region.selectedIndex].text] || 0;

        // Remove previous error messages
        developersInput.parentNode.querySelectorAll('.error-message').forEach(msg => msg.remove());
        durationInput.parentNode.querySelectorAll('.error-message').forEach(msg => msg.remove());

        // Validation messages
        if (developers < 1) {
            let errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = 'At least 1 specialist required';
            developersInput.parentNode.insertBefore(errorMessage, developersInput.nextSibling);
        }

        if (duration < 1) {
            let errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = 'At least 1 month required';
            durationInput.parentNode.insertBefore(errorMessage, durationInput.nextSibling);
        }

        // If any validation fails, stop processing this row
        if (developers < 1 || duration < 1 || workDays === 0) return;

        hasValidData = true;
        let cost = developers * dailyRates[level.options[level.selectedIndex].text] * duration * workDays;
        totalCost += cost;

        let row = `<tr>
            <td>${role.options[role.selectedIndex].text}</td>
            <td>${level.options[level.selectedIndex].text}</td>
            <td>${dailyRates[level.options[level.selectedIndex].text]} €</td>
        </tr>`;
        
        summaryBody.innerHTML += row;
    });

    document.getElementById('summary').style.display = 'block'; // Always visible

    if (hasValidData) {
        let lowerBound = totalCost * 0.9;
        let upperBound = totalCost * 1.1;
        priceIndication.innerText = `${lowerBound.toFixed(2)} € - ${upperBound.toFixed(2)} €`;
        additionalOptions.style.display = "block"; // Show additional options
    } else {
        priceIndication.innerText = "—"; // Show dash if no valid data
        additionalOptions.style.display = "none"; // Hide additional options
    }
}

