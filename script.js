function addNewForm() {
    let formSection = document.getElementById('form-section');
    let newForm = document.createElement('div');
    newForm.classList.add('container', 'form-instance');
    newForm.innerHTML = `
        <h2>Nearshore Calculator</h2>
        <label for="role">Role:</label>
        <select class="role">
            <option value="500">Software Developer</option>
            <option value="600">IT Project Manager</option>
        </select>
        <label for="level">Level:</label>
        <select class="level">
            <option value="1">Junior</option>
            <option value="1.2">Midlevel</option>
            <option value="1.5">Senior</option>
        </select>
        <label for="region">Region:</label>
        <select class="region">
            <option value="18.5">Eastern Europe</option>
            <option value="17.5">Western Europe</option>
        </select>
        <label for="developers">Number of Developers:</label>
        <input type="number" class="developers" min="1" value="1">
        <label for="duration">Duration (months):</label>
        <input type="number" class="duration" min="1" value="1" oninput="updateSummary()">
        <button class="remove-btn" onclick="removeForm(this)">Remove</button>
    `;
    formSection.appendChild(newForm);
    updateSummary();
}

function removeForm(button) {
    let formSection = document.getElementById('form-section');
    button.parentElement.remove();
    if (formSection.children.length === 0) {
        document.getElementById('summary').style.display = 'none';
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
            <td>${region.options[region.selectedIndex].text}</td>
            <td>${developers}</td>
            <td>${duration}</td>
            <td>${cost.toFixed(2)} €</td>
        </tr>`;
        summaryBody.innerHTML += row;
    });
    
    let lowerBound = totalCost * 0.9;
    let upperBound = totalCost * 1.1;
    document.getElementById('price-indication').innerText = `${lowerBound.toFixed(2)} € - ${upperBound.toFixed(2)} €`;
    document.getElementById('summary').style.display = forms.length > 0 ? 'block' : 'none';
}