let keys = document.querySelectorAll('.keyboard-button');

let firstNumber = document.getElementById('first-number');
let secondNumber = document.getElementById('second-number');
let resultContent = document.querySelector('.result-Content');
let operationContent = document.querySelector('.operation-output');
let operationKeys = document.querySelectorAll('#operation-key');
let resolveButton = document.querySelector('.calculate-button');
let decimalNumbersInput = document.querySelector('.decimal-numbers-input');
let numberInput = firstNumber;
let decimalNumbers = 1000; 

const calculationMaxFontSize =  65;
document.getElementById('calculation-Container').style.setProperty('font-size',  `${calculationMaxFontSize}px`);

const resultMaxFontSize = 40;
document.querySelector('.result').style.setProperty('font-size', `${resultMaxFontSize}px`);

resolveButton.style.setProperty('opacity', '0.3');
changeOpacityOfButtons();

decimalNumbersInput.addEventListener('change', () =>
{
    const inputValue = decimalNumbersInput.value; 
    if(inputValue > decimalNumbers.toString().length-1)
        decimalNumbers *= 10;
    else    
        decimalNumbers /= 10;
});

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



function changeOpacityOfButtons()
{
    if(operationKeys[0].style.getPropertyValue('opacity') == '')
    {
        operationKeys.forEach( key => 
        {
                key.style.setProperty('opacity', '0.3');
        });      
    }
    else
    {
        operationKeys.forEach( key => 
            {
                    key.style.removeProperty('opacity');
            }); 
    }
}

function fillOutput(key)
{
    if(firstNumber.textContent == "")
        numberInput = firstNumber; 

    if(+key >= 0 && +key <= 9)
    {
        if(firstNumber.textContent == '' || isNaN(firstNumber.textContent))
                changeOpacityOfButtons();
    
        numberInput.textContent += key; 
    }

    else
        switch(key)
        {
            case 'C' :; case 'c' :
            {
                if(firstNumber.textContent != '')
                {
                    if(operationKeys[0].style.getPropertyValue('opacity') == '')
                        changeOpacityOfButtons();
                    clearAll(); 
                }
            } break;
            
            case 'Backspace' :
            {
                if(firstNumber.textContent != '')
                {
                    let removed = backspace(); 
                    if((numberInput.textContent == '' || isNaN(firstNumber.textContent)) && !isNaN(removed))
                        changeOpacityOfButtons();
                }

            } break;
            
            case '!' : 
            {
                if(numberInput.textContent != '' && !isNaN(numberInput.textContent))
                    numberInput.textContent = -(+numberInput.textContent); 
            } break;
            
            case '.' :; case ',' : 
            {
                if(numberInput.textContent.indexOf('.') == -1)
                {
                    numberInput.textContent += '.'; 
                }
                
            } break;

            case '+' :; case '-':; case '^':
            {
                if(firstNumber.textContent != '' && !isNaN(firstNumber.textContent))
                {
                    operationContent.textContent = key;
                    numberInput = secondNumber; 
                }
            } break;

            case '/': 
            {
                if(firstNumber.textContent != '' && !isNaN(firstNumber.textContent))
                {
                    operationContent.textContent = '??';
                    numberInput = secondNumber; 
                }
            } break;

            case '*' :
            {
                if(firstNumber.textContent != '' && !isNaN(firstNumber.textContent))
                {
                    operationContent.textContent = '??';
                    numberInput = secondNumber; 
                }
            } break;

            case '???' : 
            {
                if(numberInput.textContent != '' && !isNaN(numberInput.textContent))
                {   
                    let result =  Math.round((Math.sqrt(+numberInput.textContent) + Number.EPSILON) * decimalNumbers) / decimalNumbers;
                    if(secondNumber.textContent == '')
                        resultContent.textContent = '???' + numberInput.textContent + '=' + result;
                    numberInput.textContent = result;
                }
            } break

            case 'Enter' : 
            {
                if(resolveButton.style.getPropertyValue('opacity') == '')
                {
                    if(firstNumber.textContent != '' && secondNumber.textContent != '' && operationContent.textContent != '')
                    resolveCalculation();
                    resolveButton.style.setProperty('opacity', '0.3');
                }   
            } break;
        }  

        if(numberInput == secondNumber)
        {
            if(!isNaN(secondNumber.textContent) && secondNumber.textContent != '')
            {
                if(resolveButton.style.getPropertyValue('opacity') != '')
                    resolveButton.style.removeProperty('opacity');
            }
            else if(resolveButton.style.getPropertyValue('opacity') == '')
                resolveButton.style.setProperty('opacity', '0.3');    
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
        case '??' : result = fNumber * sNumber; break;
        case '^' : result = Math.pow(fNumber, sNumber); break;
        case '??' :
        {
            if(sNumber != 0)
                result = fNumber / sNumber; 
            else 
            {
                resolve = false;
                generateAlert('Division by 0 is undefined');
            }

        } break;
    }

    if(resolve)
    {
        result = Math.round((result + Number.EPSILON) * decimalNumbers) / decimalNumbers;
        resultContent.textContent = fNumber + operationContent.textContent + sNumber + '=' + result;
        firstNumber.textContent = (result == 'Infinity' ? '': result);
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
        let removed = number.slice(number.length-1, number.length);
        number = number.slice(0,number.length-1);
        numberInput.textContent = number;
        return removed;
    }
    else if(numberInput == secondNumber)
    {
        operationContent.textContent = "";
        numberInput = firstNumber;
    }
}

function generateAlert(alertTextContent)
{
    if(document.querySelector('.division-alert') == null)
    {
        let container = document.querySelector('.main-content');
        let alert = document.createElement('div');
        let bottomAlert = document.createElement('div');

        alert.classList.add('division-alert');

        let cancelButton = document.createElement('div');
        cancelButton.classList.add('cancel-button');
        alert.textContent = alertTextContent;

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

