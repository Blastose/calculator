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
      break;
  }
  return result;
}

function appendDigitToNumber(currentNum, nextDigit) {
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
    case "":
      break;
    default:
      break;
  }
  return result;
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
      pressOperator(operatorSign) {
        this.operator = operatorSign;
        this.displayTop.textContent = `${this.arg1} ${this.operator}`;
        this.displayBottom.textContent = `${this.arg2}`;
        this.state = 'INPUT_FOR_OPERATOR';
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
      }
    },
    INPUT_FOR_OPERATOR: {
      pressNumber(number) {
        this.arg2 = appendDigitToNumber(this.arg2, number);
        this.displayBottom.textContent = `${this.arg2}`;
        this.state = 'INPUT_FOR_ARG2';
      },
      pressOperator(operatorSign) {
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
    },
    INPUT_FOR_ARG2: {
      pressNumber(number) {
        this.arg2 = appendDigitToNumber(this.arg2, number);
        this.displayBottom.textContent = `${this.arg2}`;
        this.state = 'INPUT_FOR_ARG2';
      },
      pressOperator(operatorSign) {
        this.result = binaryOperate(this.operator, Number(this.arg1), Number(this.arg2));
        this.arg1 = String(this.result);
        this.arg2 = "0";
        this.operator = operatorSign;
        this.displayTop.textContent = `${this.result} ${this.operator}`;
        this.displayBottom.textContent = `${this.arg2}`;
        this.state = 'INPUT_FOR_OPERATOR';
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
      pressOperator(operatorSign) {
        this.operator = operatorSign;
        this.arg2 = "0";
        this.displayTop.textContent = `${this.result} ${this.operator}`;
        this.displayBottom.textContent = `${this.arg2}`;
        this.state = 'INPUT_FOR_OPERATOR';
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
};

const numberKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const operatorKeys = ['+', '-', '*', '/'];
const equalsKey = ['=', 'Enter'];
const backspaceKeys = ['Backspace'];

const digitButtons = document.querySelectorAll('.calc-key');
digitButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    stateMachine.dispatch('pressNumber', e.target.getAttribute('data-value'));
  });
})

const operators = document.querySelectorAll('.operator-key');
operators.forEach((operator) => {
  operator.addEventListener('click', (e) => {
    stateMachine.dispatch('pressOperator', e.target.getAttribute('data-value'));
  });
});

const equals = document.querySelector('.equals-key');
equals.addEventListener('click', () => {
  stateMachine.dispatch('pressEquals');
});

const backspace = document.querySelector('.backspace-key');
backspace.addEventListener('click', () => {
  stateMachine.dispatch('backspace');
});

document.addEventListener('keydown', (e) => {
  console.log(e.key);
  if (numberKeys.includes(e.key)) {
    stateMachine.dispatch('pressNumber', e.key);
  } else if (operatorKeys.includes(e.key)) {
    stateMachine.dispatch('pressOperator', e.key);
  } else if (equalsKey.includes(e.key)) {
    stateMachine.dispatch('pressEquals');
  } else if (backspaceKeys.includes(e.key)) {
    stateMachine.dispatch('backspace');
  }
});
