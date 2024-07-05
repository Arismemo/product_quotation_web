const form = document.getElementById('quotation-form');
const resultDiv = document.getElementById('result');
const weightRatioSlider = document.getElementById('weightRatio');
const weightRatioValue = document.getElementById('weightRatioValue');

weightRatioSlider.addEventListener('input', () => {
    weightRatioValue.textContent = `${weightRatioSlider.value}%`;
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const length = formData.get('length');
    const width = formData.get('width');
    const height = formData.get('height');
    const difficultyLevel = formData.get('difficultyLevel');
    const weightRatio = formData.get('weightRatio');
    const quantity = formData.get('quantity');

    if (isNaN(length) || isNaN(width) || isNaN(height) || isNaN(quantity)) {
        resultDiv.textContent = 'Please enter valid numbers for all fields.';
        return;
    }

    const volume = (length * width * height) / 1000000; // Convert to cubic meters
    const totalVolume = volume * quantity;

    // Perform additional calculations based on difficulty level and weight ratio

    resultDiv.textContent = `Total volume: ${totalVolume.toFixed(3)} cubic meters`;
});
