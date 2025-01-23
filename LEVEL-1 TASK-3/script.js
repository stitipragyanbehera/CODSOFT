const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = "0.";
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);

        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
    updateSecondaryDisplay();
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === 'add') {
        return firstOperand + secondOperand;
    } else if (operator === 'subtract') {
        return firstOperand - secondOperand;
    } else if (operator === 'multiply') {
        return firstOperand * secondOperand;
    } else if (operator === 'divide') {
        return firstOperand / secondOperand;
    }

    return secondOperand;
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    updateSecondaryDisplay();
}

function updateDisplay() {
    const display = document.querySelector('.primary-display');
    display.textContent = calculator.displayValue;
}

function updateSecondaryDisplay() {
    const secondaryDisplay = document.querySelector('.secondary-display');
    if (calculator.firstOperand !== null && calculator.operator) {
        secondaryDisplay.textContent = `${calculator.firstOperand} ${getOperatorSymbol(calculator.operator)}`;
    } else {
        secondaryDisplay.textContent = '';
    }
}

function getOperatorSymbol(operator) {
    switch (operator) {
        case 'add': return '+';
        case 'subtract': return '-';
        case 'multiply': return '×';
        case 'divide': return '÷';
        default: return '';
    }
}

function handleSpecialOperation(action) {
    const currentValue = parseFloat(calculator.displayValue);

    switch (action) {
        case 'sqrt':
            calculator.displayValue = Math.sqrt(currentValue).toString();
            break;
        case 'square':
            calculator.displayValue = (currentValue * currentValue).toString();
            break;
        case 'sin':
            calculator.displayValue = Math.sin(currentValue).toString();
            break;
        case 'cos':
            calculator.displayValue = Math.cos(currentValue).toString();
            break;
        case 'percentage':
            calculator.displayValue = (currentValue / 100).toString();
            break;
    }

    calculator.firstOperand = parseFloat(calculator.displayValue);
    calculator.waitingForSecondOperand = true;
    updateSecondaryDisplay();
}

function handleButtonClick(event) {
    const { target } = event;
    const { action } = target.dataset;

    if (!action) {
        if (target.textContent === '.') {
            inputDecimal(target.textContent);
        } else {
            inputDigit(target.textContent);
        }
    } else if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
        handleOperator(action);
    } else if (action === 'clear') {
        resetCalculator();
    } else if (action === 'calculate') {
        handleOperator(action);
    } else {
        handleSpecialOperation(action);
    }

    updateDisplay();
}

document.querySelector('.buttons').addEventListener('click', handleButtonClick);

const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});