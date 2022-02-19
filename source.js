let keys = document.querySelectorAll('.keyboard-button');

let firstNumber = document.getElementById('first-number');
let secondNumber = document.getElementById('second-number');
let resultContent = document.querySelector('.result-Content');
let operationContent = document.querySelector('.operation-output');
let numberInput = firstNumber;

const calculationMaxFontSize =  65;
document.getElementById('calculation-Container').style.setProperty('font-size',  `${calculationMaxFontSize}px`);

const resultMaxFontSize = 40;
document.querySelector('.result').style.setProperty('font-size', `${resultMaxFontSize}px`);


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
    if(firstNumber.textContent == "")
        numberInput = firstNumber; 

    if(+key >= 0 && +key <= 9)
        numberInput.textContent += key;
    else
        switch(key)
        {
            case 'C' :; case 'c' :  clearAll(); break;
            
            case 'Backspace' : backspace(); break;
            
            case '!' : numberInput.textContent = -(+numberInput.textContent); break;

            case '.' :; case ',' : numberInput.textContent += '.'; break;

            case '+' :; case '-':; case '*':; case '^':
            {
                operationContent.textContent = key;
                numberInput = secondNumber; 
            } break;

            case '/': 
            {
                operationContent.textContent = '÷';
                numberInput = secondNumber; 
            } break;

            case '√' : 
            {
                numberInput.textContent = round(Math.sqrt(+numberInput.textContent));
                if(secondNumber.textContent == '')
                    resultContent.textContent = numberInput.textContent;
            } break

            case 'Enter' : 
            {
                if(firstNumber.textContent != '' && secondNumber.textContent != '' && operationContent.textContent != '')
                    resolveCalculation();
            } break;
        }   
        setFontOverflow([firstNumber, secondNumber, operationContent], document.getElementById('calculation-Container'), calculationMaxFontSize);
}


function resolveCalculation()
{
    let result;
    let fNumber = +firstNumber.textContent;
    let sNumber = +secondNumber.textContent;
    let resolve = true;

    switch(operationContent.textContent)
    {
        case '+' : result = fNumber + sNumber; break;
        case '-' : result = fNumber - sNumber; break;
        case '*' : result = fNumber * sNumber; break;
        case '^' : result = Math.pow(fNumber, sNumber); break;
        case '÷' :
        {
            if(sNumber != 0)
                result = fNumber / sNumber; 
            else 
            {
                resolve = false;
                generateDivisionAlert();
            }

        } break;
    }

    if(resolve)
    {
        resultContent.textContent = round(result);
        firstNumber.textContent = resultContent.textContent;
        numberInput = firstNumber;
        secondNumber.textContent = '';
        operationContent.textContent = '';
    }

    setFontOverflow([firstNumber, secondNumber, operationContent], document.getElementById('calculation-Container'), 65);
    setFontOverflow(resultContent, document.querySelector('.result'), resultMaxFontSize);
}


function round(number)
{
    return Math.round((number + Number.EPSILON) * 100) / 100;
}


function setFontOverflow(children, parent, maxFontSize)
{   
    fontSize = parent.style.getPropertyValue('font-size');
    fontSize = +fontSize.slice(0, fontSize.length-2);
    if(isOverflown(children, parent))
    {
        do
        {
            fontSize--;
            parent.style.setProperty('font-size', `${fontSize}px`)
        } while(isOverflown(children, parent));
    }

    else if(fontSize < maxFontSize)
    {
        while(!isOverflown(children, parent) && fontSize <= maxFontSize)
        {
            fontSize++;
            parent.style.setProperty('font-size', `${fontSize}px`);
        }

        if(isOverflown(children, parent))
        {
            fontSize--;
            parent.style.setProperty('font-size', `${fontSize}px`)               
        }
    }
}


function isOverflown(children, parent) {
    if(Array.isArray(children))
        childWidth = children.reduce( (total, child) => {return total + child.getBoundingClientRect().width; }, 0)
    else
        childWidth = children.getBoundingClientRect().width;

    return ( childWidth > parent.getBoundingClientRect().width);
}


function clearAll()
{
    firstNumber.textContent = "";
    secondNumber.textContent = "";
    operationContent.textContent = "";
    resultContent.textContent = '0';
    document.getElementById('calculation-Container').style.setProperty('font-size',  `${calculationMaxFontSize}px`);
    document.querySelector('.result').style.setProperty('font-size', `${resultMaxFontSize}px`)
}

function backspace() 
{
    if(numberInput.textContent.length > 0)
    {
        let number = numberInput.textContent;
        number = number.slice(0,number.length-1);
        numberInput.textContent = number;
    }
    else
    {
        if(numberInput == secondNumber)
        {
            operationContent.textContent = "";
            numberInput = firstNumber;
        }
    }
}

function generateDivisionAlert()
{
    if(document.querySelector('.division-alert') == null)
    {
        let container = document.querySelector('.main-content');
        let alert = document.createElement('div');
        let bottomAlert = document.createElement('div');

        alert.classList.add('division-alert');

        let cancelButton = document.createElement('div');
        cancelButton.classList.add('cancel-button');
        alert.textContent = 'Division by 0 is undefined';

        let calculatorContainer = document.querySelector('.calculator-container');

        container.insertBefore(alert, calculatorContainer);
        alert.appendChild(cancelButton);
        calculatorContainer.classList.add('margin-bottom-calculator');

        cancelButton.addEventListener('click', () => 
        {
            container.removeChild(alert);
            calculatorContainer.classList.remove('margin-bottom-calculator');
        });
    }
}

