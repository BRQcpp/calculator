let keys = document.querySelectorAll('.keyboard-button');
let output = document.querySelector('.ui-output');
let numberOutput = document.querySelector('.number-Output');
let operationOutput = document.querySelector('.operation-Output')
let resultOutput = document.querySelector('.result');
let resultContent = document.querySelector('.result-Content');


keys.forEach( key =>
{
    key.addEventListener('click', () => 
    {
        key.classList.add("keyboard-button-clicked");
        fillOutput(key.getAttribute("data-code"));
        key.addEventListener('transitionend', () =>
        {
            key.classList.remove("keyboard-button-clicked");
        });
    });
});

document.addEventListener("keydown", e => 
{
    fillOutput(e.key);
});


function fillOutput(key)
{
    switch(key)
    {
        case 'Backspace' : ;break;
        case '1':;case '2':;case '3':; case '4':; case '5':; case '6':; case '7':; case '8':; case '9':; case '0':;
        case ',':; case '.' : numberOutput.textContent += key; break;
        case 'c' :; case 'C': { numberOutput.textContent = null; resultOutput.textContent = '0'}; break;
        case '+' :; case '-':; case '*':; case '^': operationOutput.textContent = key; break;
        case '/' : operationOutput.textContent = '÷'; break;
        case '=' : resolveCalculation() ;break;
    }

}

function resolveCalculation()
{
    let number = +numberOutput.textContent;
    let result = +resultOutput.textContent;
    let operation = operationOutput.textContent;
    numberOutput.textContent = null;
    
    switch(operation)
    {
        case '+' : resultOutput.textContent = result + number; break;
        case '-' : resultOutput.textContent = result - number; break;
        case '*' : resultOutput.textContent = result * number; break;
        case '÷' : resultOutput.textContent = result / number; break;
        case '^' : resultOutput.textContent = Math.pow(result,number); break;
    }

}