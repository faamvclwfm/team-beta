
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
        let inputs = document.querySelectorAll('.form-instance input, .form-instance select');
        inputs.forEach(input => {
            if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            } else {
                input.value = input.defaultValue;
            }
        });
        document.getElementById('summary-body').innerHTML = '';
        document.getElementById('price-indication').innerText = "—";
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

        let developers = parseInt(developersInput.value) || 0;
        let duration = parseInt(durationInput.value) || 0;
        let workDays = workDaysPerMonth[region.options[region.selectedIndex].text] || 0;

        // Role and Level Handling
        let selectedRole = role.value ? role.options[role.selectedIndex].text : "—";
        let selectedLevel = level.value ? level.options[level.selectedIndex].text : "—";
        let dailyRate = level.value ? dailyRates[selectedLevel] + " €" : "—";

        // Remove previous error messages
        developersInput.parentNode.querySelectorAll('.error-message').forEach(msg => msg.remove());
        durationInput.parentNode.querySelectorAll('.error-message').forEach(msg => msg.remove());

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

        // If all required values are selected, calculate cost
        if (role.value && level.value && region.value && developers >= 1 && duration >= 1 && workDays > 0) {
            hasValidData = true;
            let cost = developers * dailyRates[selectedLevel] * duration * workDays;
            totalCost += cost;
        }

        let row = `<tr>
            <td>${selectedRole}</td>
            <td>${selectedLevel}</td>
            <td>${dailyRate}</td>
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
    }
}
document.getElementById('submitButton').addEventListener('click',()=>{
    let errorMessageInput = document.getElementById('mandatoryEmailParagraph')
    let errorMessageCheckBox = document.getElementById('mandatoryCheckBoxParagraph')
    let additionalOptions = document.getElementById('additional-options');
    let succesfulSent=additionalOptions.querySelector('h3')
    errorMessageInput.style.display='none'
    errorMessageCheckBox.style.display='none'
    succesfulSent.style.display='none'
    let mandatoryInput = document.getElementById('mandatoryInput').value;
    let mandatoryCheckBox=document.getElementById('mandatoryCheckBox');
    if(mandatoryCheckBox.checked && mandatoryInput){
        succesfulSent.style.display='block'
    }else{
       if(mandatoryInput){
            console.log('')
       } else{
            errorMessageInput.style.display='block'
            return

       }
       if(mandatoryCheckBox.checked){
            console.log('')
       }else{
            errorMessageCheckBox.style.display='block'
            return
       }
    }
})
