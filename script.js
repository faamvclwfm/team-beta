function addNewForm() {
    let formSection = document.getElementById('form-section');
    let newForm = document.querySelector('.form-instance').cloneNode(true);
    newForm.querySelectorAll('input, select').forEach(input => input.value = input.defaultValue);
    formSection.appendChild(newForm);
    updateSummary();
}

function removeForm(button) {
    let formSection = document.getElementById('form-section');
    if (formSection.children.length =1) {
        button.parentElement.remove();
        
    }
    updateSummary();
}

function updateSummary() {
    let forms = document.querySelectorAll('.form-instance');
    let summaryBody = document.getElementById('summary-body');
    summaryBody.innerHTML = '';
    let totalCost = 0;

    forms.forEach(form => {
        let role = form.querySelector('.role');
        let level = form.querySelector('.level');
        let region = form.querySelector('.region');
        let developers = parseInt(form.querySelector('.developers').value);
        let duration = parseInt(form.querySelector('.duration').value);
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