function add(arg1, arg2) {
  return arg1 + arg2;
}

function subtract(arg1, arg2) {
  return arg1 - arg2;
}

function multiply(arg1, arg2) {
  return arg1 * arg2;
}

function divide(arg1, arg2) {
  return arg1 / arg2;
}

function binaryOperate(operator, arg1, arg2) {
  let result = 0;
  switch(operator) {
    case "+":
      result = add(arg1, arg2);
      break;
    case "-":
      result = subtract(arg1, arg2);
      break;
    case "*":
    case "×":
      result = multiply(arg1, arg2);
      break; 
    case "/":
    case "÷":
      result = divide(arg1, arg2);
      break;
    default:
      console.log("Invalid binary operator: " + operator);
      break;
  }
  return roundResult(result);
}

function roundResult(result) {
  return String(parseFloat(result.toFixed(12)));
}

function appendDigitToNumber(currentNum, nextDigit) {
  if (currentNum === "Infinity" || currentNum === "NaN") {
    return `${nextDigit}`;
  }
  if (currentNum.length > 15) {
    return currentNum;
  }
  if (currentNum === "0") {
    if (nextDigit === "0") {
      return currentNum;
    } else if (nextDigit === ".") {
      return `${currentNum}${nextDigit}`;
    } else {
      return nextDigit;
    }
  } else if (currentNum.includes(".") && nextDigit === ".") {
    return currentNum;
  }
  return `${currentNum}${nextDigit}`;
}

function removeDigitsFromNumber(number, numberOfDigitsToRemove) {
  if (number === "Infinity" || number === "NaN") {
    return `${number}`;
  }
  if (number.charAt(0) !== "-" && number.length === 1) {
    return "0";
  } else if (number === "0") {
    return number;
  }
  return number.slice(0, Number(`-${numberOfDigitsToRemove}`));
}

function unaryOperate(operator, arg1) {
  let result = 0;
  switch (operator) {
    case "⅟":
      result = 1 / arg1;
      break;
    case "x²":
      result = arg1 * arg1;
      break;
    case "√":
      result = Math.sqrt(arg1);
      break;
    case "%":
      result = arg1 / 100;
      break; 
    case "⁺∕₋":
      result = arg1 * -1;
      break; 
    default:
      console.log("Invalid unary operator: " + operator);
      break;
  }
  return roundResult(result);
}

const stateMachine = {
  state: 'INPUT_FOR_ARG1',
  arg1: "0",
  arg2: "0",
  operator: "+",
  result: "0",
  displayTop: document.querySelector('.calculator-display-top'),
  displayBottom: document.querySelector('.calculator-display-bottom'),
  transitions: {
    INPUT_FOR_ARG1: {
      pressNumber(number) {
        this.arg1 = appendDigitToNumber(this.arg1, number);
        this.displayBottom.textContent = `${this.arg1}`;
        this.state = 'INPUT_FOR_ARG1';
      },
      pressBinaryOperator(operatorSign) {
        this.operator = operatorSign;
        this.displayTop.textContent = `${this.arg1} ${this.operator}`;
        this.displayBottom.textContent = `${this.arg2}`;
        this.state = 'INPUT_FOR_OPERATOR';
      },
      pressUnaryOperator(operatorSign) {
        this.arg1 = unaryOperate(operatorSign, Number(this.arg1));
        this.displayBottom.textContent = `${this.arg1}`;
        this.state = 'INPUT_FOR_ARG1';
      },
      pressEquals() {
        this.result = binaryOperate(this.operator, Number(this.arg1), Number(this.arg2));
        this.displayBottom.textContent = `${this.result}`;
        this.state = 'CALCULATE_RESULT';
      },
      backspace() {
        this.arg1 = removeDigitsFromNumber(this.arg1, 1);
        this.displayBottom.textContent = `${this.arg1}`;
        this.state = 'INPUT_FOR_ARG1';
      },
      clear() {
        this.arg1 = "0";
        this.displayBottom.textContent = `${this.arg1}`;
        this.state = 'INPUT_FOR_ARG1';
      },
      clearAll() {
        this.resetStateMachine();
      }
    },
    INPUT_FOR_OPERATOR: {
      pressNumber(number) {
        this.arg2 = appendDigitToNumber(this.arg2, number);
        this.displayBottom.textContent = `${this.arg2}`;
        this.state = 'INPUT_FOR_ARG2';
      },
      pressBinaryOperator(operatorSign) {
        this.operator = operatorSign;
        this.displayTop.textContent = `${this.arg1} ${this.operator}`;
        this.state = 'INPUT_FOR_OPERATOR';
      },
      pressEquals() {
        this.result = binaryOperate(this.operator, Number(this.arg1), Number(this.arg2));
        this.displayTop.textContent = "";
        this.displayBottom.textContent = `${this.result}`;
        this.arg1 = String(this.result);
        this.state = 'CALCULATE_RESULT';
      },
      clearAll() {
        this.resetStateMachine();
      }
    },
    INPUT_FOR_ARG2: {
      pressNumber(number) {
        this.arg2 = appendDigitToNumber(this.arg2, number);
        this.displayBottom.textContent = `${this.arg2}`;
        this.state = 'INPUT_FOR_ARG2';
      },
      pressBinaryOperator(operatorSign) {
        this.result = binaryOperate(this.operator, Number(this.arg1), Number(this.arg2));
        this.arg1 = String(this.result);
        this.arg2 = "0";
        this.operator = operatorSign;
        this.displayTop.textContent = `${this.result} ${this.operator}`;
        this.displayBottom.textContent = `${this.arg2}`;
        this.state = 'INPUT_FOR_OPERATOR';
      },
      pressUnaryOperator(operatorSign) {
        this.arg2 = unaryOperate(operatorSign, Number(this.arg2));
        this.displayBottom.textContent = `${this.arg2}`;
        this.state = 'INPUT_FOR_ARG2';
      },
      pressEquals() {
        this.result = binaryOperate(this.operator, Number(this.arg1), Number(this.arg2));
        this.arg1 = String(this.result);
        this.displayTop.textContent = "";
        this.displayBottom.textContent = `${this.result}`;
        this.state = 'CALCULATE_RESULT';
      },
      backspace() {
        this.arg2 = removeDigitsFromNumber(this.arg2, 1);
        this.displayBottom.textContent = `${this.arg2}`;
        this.state = 'INPUT_FOR_ARG2';
      },
      clear() {
        this.arg2 = "0";
        this.displayBottom.textContent = `${this.arg2}`;
        this.state = 'INPUT_FOR_ARG2';
      },
      clearAll() {
        this.resetStateMachine();
      }
    },
    CALCULATE_RESULT: {
      pressNumber(number) {
        this.arg1 = appendDigitToNumber("0", number);
        this.arg2 = "0";
        this.operator = "+";
        this.displayTop.textContent = "";
        this.displayBottom.textContent = `${this.arg1}`;
        this.state = 'INPUT_FOR_ARG1';
      },
      pressBinaryOperator(operatorSign) {
        this.operator = operatorSign;
        this.arg2 = "0";
        this.displayTop.textContent = `${this.result} ${this.operator}`;
        this.displayBottom.textContent = `${this.arg2}`;
        this.state = 'INPUT_FOR_OPERATOR';
      },
      pressUnaryOperator(operatorSign) {
        this.arg1 = unaryOperate(operatorSign, Number(this.arg1));
        this.arg2 = "0";
        this.operator = "+";
        this.displayBottom.textContent = `${this.arg1}`;
        this.state = 'INPUT_FOR_ARG1';
      },
      pressEquals() {
        this.result = binaryOperate(this.operator, Number(this.arg1), Number(this.arg2));
        this.arg1 = String(this.result);
        this.displayBottom.textContent = `${this.result}`;
        this.state = 'CALCULATE_RESULT';
      },
      backspace() {
        this.arg1 = removeDigitsFromNumber(this.arg1, 1);
        this.arg2 = "0";
        this.operator = "+";
        this.displayBottom.textContent = `${this.arg1}`;
        this.state = 'INPUT_FOR_ARG1';
      },
      clear() {
        this.arg1 = "0";
        this.arg2 = "0";
        this.operator = "+";
        this.displayBottom.textContent = `${this.arg1}`;
        this.state = 'INPUT_FOR_ARG1';
      },
      clearAll() {
        this.resetStateMachine();
      }
    },
  },
  dispatch(actionName, value) {
    const action = this.transitions[this.state][actionName];
    if (action) {
      action.call(this, value);
      console.log("state: " + this.state);
      console.log("arg1: " + this.arg1);
      console.log("arg2: " + this.arg2);
      console.log("op: " + this.operator);
    } else {
      console.log('Invalid action');
    }
  },
  resetStateMachine() {
    this.arg1 = "0";
    this.arg2 = "0";
    this.operator = "+";
    this.displayTop.textContent = "";
    this.displayBottom.textContent = "0";
    this.state = 'INPUT_FOR_ARG1';
  }
};

const numberKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const operatorKeys = ['+', '-', '*', '/'];
const equalsKey = ['=', 'Enter'];
const backspaceKeys = ['Backspace'];
const clearKeys = ['c', 'C'];
const clearAllKeys = [''];


const digitButtons = document.querySelectorAll('.calc-key');
digitButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    stateMachine.dispatch('pressNumber', e.currentTarget.getAttribute('data-value'));
  });
})

const binaryOperators = document.querySelectorAll('.binary-operator-key');
binaryOperators.forEach((operator) => {
  operator.addEventListener('click', (e) => {
    stateMachine.dispatch('pressBinaryOperator', e.currentTarget.getAttribute('data-value'));
  });
});

const unaryOperators = document.querySelectorAll('.unary-operator-key');
unaryOperators.forEach((operator) => {
  operator.addEventListener('click', (e) => {
    stateMachine.dispatch('pressUnaryOperator', e.currentTarget.getAttribute('data-value'));
  })
});

const equals = document.querySelector('.equals-key');
equals.addEventListener('click', () => {
  stateMachine.dispatch('pressEquals');
});

const backspace = document.querySelector('.backspace-key');
backspace.addEventListener('click', () => {
  stateMachine.dispatch('backspace');
});

const clear = document.querySelector('.clear-key');
clear.addEventListener('click', () => {
  stateMachine.dispatch('clear');
});

const clearAll = document.querySelector('.clear-all-key');
clearAll.addEventListener('click', () => {
  stateMachine.dispatch('clearAll');
});

document.addEventListener('keydown', (e) => {
  console.log(e.key);
  if (numberKeys.includes(e.key)) {
    stateMachine.dispatch('pressNumber', e.key);
  } else if (operatorKeys.includes(e.key)) {
    stateMachine.dispatch('pressBinaryOperator', e.key);
  } else if (equalsKey.includes(e.key)) {
    stateMachine.dispatch('pressEquals');
  } else if (backspaceKeys.includes(e.key)) {
    stateMachine.dispatch('backspace');
  } else if (clearKeys.includes(e.key)) {
    stateMachine.dispatch('clear');
  }
});
