// CALCULATOR

// Variables
let firstAppend = "";
let secondAppend = "";
let currentOperator = "";
let calcHistory = [];

// Update display: shows the current input and operator in the inputBox
function updateDisplay() {
    const inputBox = document.getElementById("inputBox");

    // Format first and second numbers if they exist
    const firstNumber = firstAppend; 
    const secondNumber = secondAppend;

    if (secondAppend !== "") {
        inputBox.value = firstNumber + " " + currentOperator + " " + secondNumber;
    } else if (currentOperator !== "") {
        inputBox.value = firstNumber + " " + currentOperator;
    } else {
        inputBox.value = firstNumber;
    }
    updatePreview();
}

// Update preview: shows the result of the current calculation in the previewBox
function updatePreview() {
    const previewBox = document.getElementById("previewBox");
    if (firstAppend && currentOperator && secondAppend) {
        const num1 = parseFloat(firstAppend);
        const num2 = parseFloat(secondAppend);
        let result;
        switch (currentOperator) {
            case "+":
                result = num1 + num2;
                break;
            case "-":
                result = num1 - num2;
                break;
            case "*":
                result = num1 * num2;
                break;
            case "/":
                result = num2 === 0 ? "Error" : num1 / num2;
                break;
            case "%":
                result = num1 % num2;
                break;
            default:
                result = "Error";
        }

        // Round result to 10 decimals if it's a number
        if (typeof result === "number") {
            result = parseFloat(result.toFixed(10));
        }    

        previewBox.textContent = result;
        previewBox.style.display = "block";
    } else {
        previewBox.textContent = "";
        previewBox.style.display = "none";
    }
}

// Append number: adds digit or decimal to the current number
function appendNumber(number) {
    // If number is a dot, ensure current input doesn't already have one
    if (number === ".") {
        if (currentOperator === "") {
            if (firstAppend.includes(".")) return; // Prevent duplicate dot
        } else {
            if (secondAppend.includes(".")) return; // Prevent duplicate dot
        }
    }
    if (currentOperator === "") {
        firstAppend += number;
    } else {
        secondAppend += number;
    }
    updateDisplay();
}

// Set operator: sets the operator for the current calculation
function setOperator(operator) {
    if (firstAppend === "") return; // There's no first number
    if (currentOperator !== "" && secondAppend !== "") {
        calculate(); // Calculate if operator and second number already exist
    }
    currentOperator = operator;
    updateDisplay();
}

// Calculate: Performs the calculation based on the current operator and append result to history
function calculate() {
    if (firstAppend === "" || secondAppend === "" || currentOperator === "") return;
    let result = 0;
    const num1 = parseFloat(firstAppend);
    const num2 = parseFloat(secondAppend);
    switch (currentOperator) {
        case "+":
            result = num1 + num2;
            break;
        case "-":
            result = num1 - num2;
            break;
        case "*":
            result = num1 * num2;
            break;
        case "/":
            result = num2 === 0 ? "Error" : num1 / num2;
            break;
        case "%":
            result = num1 % num2;
            break;
        default:
            result = "Error";
    }

    // Round result and remove unnecessary decimals
    if (typeof result === "number") {
        result = parseFloat(result.toFixed(10));
    }

    // Build and save the operation string in history
    const operation = `${firstAppend} ${currentOperator} ${secondAppend} = ${result}`;
    calcHistory.push(operation);
    updateHistory();

    // Reset for next calculation, displaying the result as the new first number
    firstAppend = result.toString();
    currentOperator = "";
    secondAppend = "";
    updateDisplay();
}

// Clear screen: resets all current inputs
function clearScreen() {
    firstAppend = "";
    secondAppend = "";
    currentOperator = "";
    updateDisplay();
}

// Delete: removes the last character from the current input
function del() {
    if (secondAppend !== "") {
        secondAppend = secondAppend.slice(0, -1);
    } else if (currentOperator !== "") {
        currentOperator = "";
    } else {
        firstAppend = firstAppend.slice(0, -1);
    }
    updateDisplay();
}

// Keyboard event listeners for numbers and operators
document.addEventListener("keypress", (event) => {
    const key = event.key;
    if ((key >= "0" && key <= "9") || key === ".") {
        appendNumber(key);
    } else if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "%"
    ) {
        setOperator(key);
    }
});

// Listen for Enter (calculate) and Backspace (delete)
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        calculate();
    } else if (event.key === "Backspace") {
        event.preventDefault();
        del();
    }
});

// Dark mode: toggles dark mode and saves the state in localStorage
function toggleDarkMode() {
    document.body.classList.toggle("dark");
    const btn = document.getElementById("toggleDarkMode");

    // Update button text
    if (document.body.classList.contains("dark")) {
        btn.textContent = "Light Mode";
        localStorage.setItem("darkMode", "enabled");
    } else {
        btn.textContent = "Dark Mode";
        localStorage.setItem("darkMode", "disabled");
    }

    // Update history panel color
    const historyPanel = document.getElementById("historyPanel");
    if (document.body.classList.contains("dark")) {
        historyPanel.classList.add("dark");
    } else {
        historyPanel.classList.remove("dark");
    }
}

// Check saved dark mode setting when page loads
document.addEventListener("DOMContentLoaded", () => {
    const darkMode = localStorage.getItem("darkMode");
    // Check if dark mode is enabled
    if (darkMode === "enabled") {
        toggleDarkMode();
    }
});

// Update History: shows the list of past operations
function updateHistory() {
    const historyList = document.getElementById("historyList");
    // Check if history is empty and display message if it is
    if (calcHistory.length === 0) {
        const noHistory = document.createElement("p");
        noHistory.classList.add("no-history");
        noHistory.textContent = "No history available.";
        historyList.appendChild(noHistory);
        return;
    }
    historyList.innerHTML = "";
    // Show first calc on reverse
    calcHistory
        .slice()
        .reverse()
        .forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            li.style.padding = "5px 0";
            li.style.borderBottom = "1px solid #ccc";
            historyList.appendChild(li);
        });
}

// Toggle history: shows/hides the history panel
function toggleHistory() {
    const historyPanel = document.getElementById("historyPanel");
    // Check if history panel is hidden
    if (historyPanel.style.display === "none" || historyPanel.style.display === "") {
        historyPanel.style.display = "block";
    } else {
        historyPanel.style.display = "none";
    }
}

// Clear history: empties the calculation history
function clearHistory() {
    calcHistory = [];
    updateHistory();
    historyList.innerHTML = "";
    // Check if history is empty
    if (calcHistory.length === 0) {
        const noHistory = document.createElement("p");
        noHistory.classList.add("no-history");
        noHistory.textContent = "No history available.";
        historyList.appendChild(noHistory);
        return;
    }
}
