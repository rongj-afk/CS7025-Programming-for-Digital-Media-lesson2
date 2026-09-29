const EURToCNY = 7.8; // Example conversion rate from EUR to CNY
function convertCurrency(amount, fromCurrency, toCurrency) {
    if(!Number.isFinite(amount) || amount < 0) {
        return null;
    }
    
    if ((fromCurrency !== 'EUR' && fromCurrency !== 'CNY') ||
        (toCurrency !== 'EUR' && toCurrency !== 'CNY')) {
        return null;
    }

    let convertedAmount;

    if (fromCurrency === "EUR" &&  toCurrency === "CNY") {
        convertedAmount = amount * EURToCNY;
    } else if (fromCurrency === 'CNY' && toCurrency === 'EUR') {
        convertedAmount = amount / EURToCNY;
    } else {
        convertedAmount = amount / EURToCNY;
        convertedAmount = amount;
    }

    if(!Number.isFinite(convertedAmount)){
        return null;
    }

    return convertedAmount;
}

console.log("100 EUR to CNY:", convertCurrency(100, 'EUR', 'CNY').toFixed(2)+" CNY");
console.log("800 CNY to EUR:", convertCurrency(800, 'CNY', 'EUR').toFixed(2)+" EUR");

//DOM elements html
const amountInput = document.getElementById("amount");
const fromCurrencySelect = document.getElementById("fromCurrency");
const toCurrencySelect = document.getElementById("toCurrency");
const convertButton = document.getElementById("convertButton");
const resultDisplay = document.getElementById("result");

convertButton.addEventListener("click", function() {

    const amount = Number(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    const result = convertCurrency(amount, fromCurrency, toCurrency);

    if (result === null) {
        resultDisplay.textContent = "Please enter a valid amount.";
    } else {
        resultDisplay.textContent =
            amount + " " +
            fromCurrency + " = " +
            result.toFixed(2) + " " +
            toCurrency;
    }
});