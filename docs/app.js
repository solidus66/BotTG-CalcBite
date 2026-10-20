
const fields = {
    kcal: document.getElementById("kcal"),
    protein: document.getElementById("protein"),
    fat: document.getElementById("fat"),
    carbs: document.getElementById("carbs"),
    weight: document.getElementById("weight"),
};

const output = {
    kcal: document.getElementById("result-kcal"),
    protein: document.getElementById("result-protein"),
    fat: document.getElementById("result-fat"),
    carbs: document.getElementById("result-carbs"),
};

function parseNumber(input) {
    const value = input.trim().replace(",", ".");

    if (value === "") {
        return 0;
    }

    if (!/^\d*\.?\d*$/.test(value) || value === ".") {
        return null;
    }

    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

function formatNumber(value) {
    const rounded = Math.round((value + Number.EPSILON) * 100) / 100;

    return rounded.toLocaleString("ru-RU", {
        maximumFractionDigits: 2,
        useGrouping: false,
    });
}

function calculate() {
    const values = Object.fromEntries(
        Object.entries(fields).map(([key, input]) => [
            key,
            parseNumber(input.value),
        ])
    );

    const invalid = Object.values(values).some(
        value => value === null || value < 0
    );

    const weight = values.weight;

    if (invalid || weight === 0) {
        Object.values(output).forEach(element => {
            element.textContent = "—";
        });
        return;
    }

    const factor = weight / 100;

    output.kcal.textContent = formatNumber(values.kcal * factor);
    output.protein.textContent =
        `${formatNumber(values.protein * factor)} г`;
    output.fat.textContent = `${formatNumber(values.fat * factor)} г`;
    output.carbs.textContent =
        `${formatNumber(values.carbs * factor)} г`;
}

function clearFields() {
    Object.values(fields).forEach(input => {
        input.value = "";
    });

    calculate();
    fields.kcal.focus();
}

Object.values(fields).forEach(input => {
    input.addEventListener("input", calculate);
});

document.getElementById("reset").addEventListener("click", clearFields);
document.getElementById("clear").addEventListener("click", clearFields);

if (window.Telegram?.WebApp) {
    const telegram = window.Telegram.WebApp;
    telegram.ready();
    telegram.expand();
}

calculate();
