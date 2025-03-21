
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
    let summaryBody = document.getElementById('summary-body');
    let summarySection = document.getElementById('summary');

    
    if (forms.length > 1) {
        button.parentElement.remove();
    } else if (forms.length === 1) { 
        summaryBody.innerHTML = ''; 
        summarySection.style.display = 'none'; 

        
        let inputs = document.querySelectorAll('.form-instance input, .form-instance select');
        inputs.forEach(input => {
            if (input.tagName === 'SELECT') {
                input.selectedIndex = 0; 
            } else {
                input.value = input.defaultValue; 
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

        
        let errorMessages = developersInput.parentNode.querySelectorAll('p');
        errorMessages.forEach(msg => msg.remove());
        errorMessages = durationInput.parentNode.querySelectorAll('p');
        errorMessages.forEach(msg => msg.remove());

        
        if (developers < 1) { 
            let errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message')
            errorMessage.textContent = 'At least 1 specialist required';
            developersInput.parentNode.insertBefore(errorMessage, developersInput.nextSibling);
        }

        if (duration < 1) { 
            let errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message')
            errorMessage.textContent = 'At least 1 month required';
            durationInput.parentNode.insertBefore(errorMessage, durationInput.nextSibling);
        }
        
        let workDays = workDaysPerMonth[region.options[region.selectedIndex].text] || 0;
        
        developersInput.nextElementSibling?.classList.contains('error-message') && developersInput.nextElementSibling.remove();
        durationInput.nextElementSibling?.classList.contains('error-message') && durationInput.nextElementSibling.remove();

       
        if (developers < 1) {
            let errorMessage = document.createElement('p');
            errorMessage.textContent = 'At least 1 specialist required';
            errorMessage.classList.add('error-message');
            developersInput.parentNode.insertBefore(errorMessage, developersInput.nextSibling);

            
            durationInput.value = ''; 
            return; 
        }

        
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
        // Show additional options when the total cost is valid
        document.getElementById('additional-options').style.display = 'block';
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

    updateSummary(); 
});
