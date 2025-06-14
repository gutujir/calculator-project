// Select DOM elements
const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const historyList = document.getElementById("history-list");
const toggleBtn = document.getElementById("toggle-history");
const historyContainer = document.getElementById("history-container");
const clearHistoryBtn = document.getElementById("clear-history");

let expression = "";

/**
 * Update the calculator display.
 */
function updateDisplay() {
  display.textContent = expression || "0";
}

/**
 * Add a new entry to the calculation history.
 * @param {string} entry - The calculation string.
 */
function addToHistory(entry) {
  const li = document.createElement("li");
  li.textContent = entry;
  historyList.prepend(li);
}

/**
 * Evaluate the current expression safely.
 */
function evaluateExpression() {
  try {
    // Convert calculator symbols to JS operators
    const sanitized = expression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/\^/g, "**")
      .replace(/%/g, "/100");

    const result = eval(sanitized);

    // Handle cases like division by zero
    if (!isFinite(result)) {
      throw new Error("Math error");
    }

    addToHistory(`${expression} = ${result}`);
    expression = result.toString();
  } catch {
    expression = "Error";
  }
}

/**
 * Check if the last character in expression is an operator.
 * @returns {boolean} True if last char is operator.
 */
function endsWithOperator() {
  return /[+\-×÷%^*\/]$/.test(expression);
}

/**
 * Handle input based on button clicked or keyboard.
 * @param {string} input
 */
function handleInput(input) {
  // Reset expression if in error state
  if (expression === "Error") {
    expression = "";
  }

  const operators = ["+", "-", "×", "÷", "%", "^"];

  if (/\d/.test(input) || input === ".") {
    // Prevent multiple decimals in one number segment
    if (input === ".") {
      const parts = expression.split(/[+\-×÷%^]/);
      const current = parts[parts.length - 1];
      if (current.includes(".")) return; // Ignore second decimal
    }
    expression += input;
  } else if (operators.includes(input)) {
    // Prevent operator at start except minus for negative numbers
    if (expression === "") {
      if (input === "-") expression += input;
      return;
    }

    // Replace last operator to avoid duplicate
    if (endsWithOperator()) {
      expression = expression.slice(0, -1) + input;
    } else {
      expression += input;
    }
  } else if (input === "=") {
    evaluateExpression();
  } else if (input === "C") {
    expression = "";
  } else if (input === "⌫") {
    expression = expression.slice(0, -1);
  }
}

/**
 * Attach click event listeners to buttons.
 */
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const val = button.textContent;
    handleInput(val);
    updateDisplay();
  });
});

/**
 * Handle keyboard input for calculator keys.
 */
document.addEventListener("keydown", (e) => {
  const key = e.key;

  // Map keyboard keys to calculator symbols
  const keyMap = {
    "*": "×",
    "/": "÷",
    "^": "^",
    "%": "%",
    "+": "+",
    "-": "-",
    ".": ".",
    Enter: "=",
    "=": "=",
    Backspace: "⌫",
    Escape: "C",
  };

  if (/\d/.test(key)) {
    handleInput(key);
  } else if (keyMap[key] !== undefined) {
    handleInput(keyMap[key]);
  }

  updateDisplay();

  // Prevent default browser behavior for handled keys
  if (/\d/.test(key) || Object.keys(keyMap).includes(key)) {
    e.preventDefault();
  }
});

/**
 * Toggle visibility of history panel.
 */
toggleBtn.addEventListener("click", () => {
  const isHidden =
    historyContainer.style.display === "none" ||
    historyContainer.style.display === "";
  if (isHidden) {
    historyContainer.style.display = "block";
    toggleBtn.textContent = "Hide History";
  } else {
    historyContainer.style.display = "none";
    toggleBtn.textContent = "Show History";
  }
});

clearHistoryBtn.addEventListener("click", () => {
  historyList.innerHTML = "";
});
