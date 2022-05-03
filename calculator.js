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

let arg1 = 0;
let arg2 = 0;
let operatorSign = "";
const digitButtons = document.querySelectorAll('.calc-key');
digitButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    const display = document.getElementById('calc-curr-display');
    display.textContent = `${display.textContent}${e.target.value}`;
  });
})

const operators = document.querySelectorAll('.operator');
operators.forEach((operator) => {
  operator.addEventListener('click', (e) => {
    const display = document.getElementById('calc-curr-display');
    const above = document.getElementById('calc-above-display');
    arg2 = arg1;
    arg1 = Number(display.textContent);
    above.textContent = `${arg1} ${e.target.value}`;
    display.textContent = "";
    operatorSign = e.target.value;
  });
});

const equals = document.querySelector('.equals');
equals.addEventListener('click', () => {
  const display = document.getElementById('calc-curr-display');
  arg2 = Number(display.textContent);
  let result = operate(operatorSign, arg1, arg2);
  console.log(arg1);
  console.log(arg2);
  console.log(result);
  display.textContent = result;

  const above = document.getElementById('calc-above-display');
  above.textContent = "";
});