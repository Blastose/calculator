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

function operate(operator, arg1, arg2) {
  let result = 0;
  switch(operator) {
    case "+":
      result = add(arg1, arg2);
      break;
    case "-":
      result = subtract(arg1, arg2);
      break;
    case "×":
      result = multiply(arg1, arg2);
      break; 
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
    } else {
      return nextDigit;
    }    
  } else if (currentNum.includes(".") && nextDigit === ".") {
    return currentNum;
  }
  return `${currentNum}${nextDigit}`;
}

function logValues() {
  console.log("arg1: " + arg1);
  console.log("arg2: " + arg2);
  console.log("operator: " + operatorSign);
}

const stateMachine = {
  state: 'INPUT_FOR_ARG1',
  arg1: "0",
  arg2: "0",
  operator: "+",
  transitions: {
    INPUT_FOR_ARG1: {
      pressNumber(number) {
        this.arg1 = appendDigitToNumber(this.arg1, number);
        this.state = 'INPUT_FOR_ARG1';

        console.log('pressed number from INPUT_FOR_ARG1 state');
      },
      pressOperator(operatorSign) {
        this.operator = operatorSign;
        this.state = 'INPUT_FOR_OPERATOR';

        console.log('pressed operator from INPUT_FOR_ARG1 state');
      },
      pressEquals() {
        console.log("equals: " + operate(this.operator, Number(this.arg1), Number(this.arg2)));
        this.state = 'CALCULATE_RESULT';

        console.log('pressed = from INPUT_FOR_ARG1 state');
      },
    },
    INPUT_FOR_OPERATOR: {
      pressNumber(number) {
        this.arg2 = appendDigitToNumber(this.arg2, number);
        this.state = 'INPUT_FOR_ARG2';
        
        console.log('pressed number from INPUT_FOR_OPERATOR state');
      },
      pressOperator(operatorSign) {
        this.operator = operatorSign;
        this.state = 'INPUT_FOR_OPERATOR';

        console.log('pressed operator from INPUT_FOR_OPERATOR state');
      },
      pressEquals() {
        this.state = 'CALCULATE_RESULT';
        let result = operate(this.operator, Number(this.arg1), Number(this.arg2));
        this.arg1 = String(result);

        console.log('pressed = from INPUT_FOR_OPERATOR state');
      },
    },
    INPUT_FOR_ARG2: {
      pressNumber(number) {
        this.arg2 = appendDigitToNumber(this.arg2, number);
        this.state = 'INPUT_FOR_ARG2';

        console.log('pressed number from INPUT_FOR_ARG2 state');
      },
      pressOperator(operatorSign) {
        let result = operate(this.operator, Number(this.arg1), Number(this.arg2));
        this.arg1 = String(result);
        this.arg2 = "0";
        this.operator = operatorSign;
        this.state = 'INPUT_FOR_OPERATOR';

        console.log('pressed operator from INPUT_FOR_ARG2 state');
      },
      pressEquals() {
        this.state = 'CALCULATE_RESULT';
        let result = operate(this.operator, Number(this.arg1), Number(this.arg2));
        console.log("equals: " + result);
        this.arg1 = String(result);

        console.log('pressed = from INPUT_FOR_ARG2 state');
      },
    },
    CALCULATE_RESULT: {
      pressNumber(number) {
        this.arg1 = appendDigitToNumber("0", number);
        this.state = 'INPUT_FOR_ARG1';

        console.log('pressed number from CALCULATE_RESULT state');
      },
      pressOperator(operatorSign) {
        this.operator = operatorSign;
        this.arg2 = "0";
        this.state = 'INPUT_FOR_OPERATOR';

        console.log('pressed operator from CALCULATE_RESULT state');
      },
      pressEquals() {
        this.state = 'CALCULATE_RESULT';
        let result = operate(this.operator, Number(this.arg1), Number(this.arg2));
        console.log("equals: " + result);
        this.arg1 = String(result);

        console.log('pressed = from CALCULATE_RESULT state');
      },
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

const digitButtons = document.querySelectorAll('.calc-key');
digitButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    stateMachine.dispatch('pressNumber', e.target.value);
  });
})

const operators = document.querySelectorAll('.operator');
operators.forEach((operator) => {
  operator.addEventListener('click', (e) => {
    stateMachine.dispatch('pressOperator', e.target.value);
  });
});

const equals = document.querySelector('.equals');
equals.addEventListener('click', () => {
  stateMachine.dispatch('pressEquals');
});