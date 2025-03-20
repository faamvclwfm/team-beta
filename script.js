function addNewForm() {
    let formSection = document.getElementById('form-section');
    let newForm = document.querySelector('.form-instance').cloneNode(true);
    newForm.querySelectorAll('input, select').forEach(input => input.value = input.defaultValue);
    formSection.appendChild(newForm);
    
    // Add event listeners to update summary on input change
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
    summarySection.style.display = 'none';

    summaryBody.innerHTML = '';
    let totalCost = 0;

    forms.forEach(form => {
        let role = form.querySelector('.role');
        let level = form.querySelector('.level');
        let region = form.querySelector('.region');

        if (!role || !level || !region || 
            role.selectedIndex < 0 || level.selectedIndex < 0 || region.selectedIndex < 0) {
            return; // Skip this iteration if any of the elements are not valid
        }

        let developers = parseInt(form.querySelector('.developers').value) || 0;
        let duration = parseInt(form.querySelector('.duration').value) || 0;
        let cost = developers * parseFloat(role.value) * parseFloat(level.value) * duration * parseFloat(region.value);
        totalCost += cost;
        let row = `<tr>
            <td>${role.options[role.selectedIndex].text}</td>
            <td>${level.options[level.selectedIndex].text}</td>
            <td>${cost.toFixed(2)} €</td>
        </tr>`;
        
        summaryBody.innerHTML += row;
    });
    
    let lowerBound = totalCost * 0.9;
    let upperBound = totalCost * 1.1;
    document.getElementById('price-indication').innerText = `${lowerBound.toFixed(2)} € - ${upperBound.toFixed(2)} €`;
    document.getElementById('summary').style.display = forms.length > 0 ? 'block' : 'none';
}
