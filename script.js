document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quotation-form');
    const resultDiv = document.getElementById('result');
    const weightRatioSlider = document.getElementById('weightRatio');
    const weightRatioValue = document.getElementById('weightRatioValue');
    const container = document.querySelector('.difficulty-level-container');

    // 监听滑块输入事件，更新滑块值显示
    function handleWeightRatioInput() {
        weightRatioValue.textContent = `${weightRatioSlider.value}%`;
    }
    weightRatioSlider.addEventListener('input', handleWeightRatioInput);

    // 监听难度级别容器点击事件，选择对应的难度级别
    function handleDifficultyLevelClick(event) {
        const target = event.target;
        if (target.classList.contains('difficulty-level-image')) {
            const option = target.closest('.difficulty-level-option');
            if (option) {
                const radio = option.querySelector('input[type="radio"]');
                if (radio) {
                    radio.click();
                }
            }
        }
    }
    container.addEventListener('click', handleDifficultyLevelClick);

    // 设置默认值为3
    const defaultRadio = document.getElementById('difficultyLevel3');
    if (defaultRadio) {
        defaultRadio.checked = true;
    }

    // 监听表单提交事件
    function handleFormSubmit(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const inputs = {
            length: parseFloat(formData.get('length')),
            width: parseFloat(formData.get('width')),
            height: parseFloat(formData.get('height')),
            difficultyLevel: parseFloat(formData.get('difficultyLevel')),
            weightRatio: parseFloat(formData.get('weightRatio'))/100,
            quantity: parseFloat(formData.get('quantity'))
        };

        // 检查输入是否为有效数字
        if (Object.values(inputs).some(isNaN)) {
            resultDiv.textContent = 'Please enter valid numbers for all fields.';
            return;
        }

        const { length, width, height, difficultyLevel, weightRatio, quantity } = inputs;

        const constants = {
            materialDensity: 1.165714286, // 原料密度
            pricePerGramOfMaterial: 0.01, // 每克原料价格，单位/元
            materialWastageRate: 0.05, // 做货原料浪费比例
            moldLength: 26, // 模具宽
            moldWidth: 26, // 模具长
            moldHoleSpacing: 1, // 模具孔之间的距离
            colorMatchingCost: 30,
            machineSetupCost: 55, // 包括调机工资50元， 加调机浪费原料5元
            workerSalaryPerMachinePerShift: 125, // 一个班一台机器一个工人的工资
            electricityCostPerMachinePerShift: 20, // 一个班一台机器的电费
            rentPerMachinePerShift: 6, // 一个班一台机器的房租
            profitPerMachinePerShift: 200, // 一个班一台机器的利润

            annualRent: 60000, // 房租
            machineCount: 28, // 机器数量
            monthlyElectricityBill: 25000, // 一个月电费
            // 所有工人的工资
            // 调机：11000 * 3 = 33000
            // 调色打样： 13000 + 3500 = 16500
            // 仓管: 7500 + 5000 = 12500
            // 三台机: 8200 * 12 = 98400
            // 两台机: 7200 * 10 = 72000
            // 管理：6000 * 4 = 24000
            // 杂工：6000
            // 一共： 33000 + 16500 + 12500 + 98400 + 72000 + 24000 + 6000 = 262400
            totalWorkerSalaries: 262400
        };

        const {
            materialDensity,
            pricePerGramOfMaterial,
            materialWastageRate,
            moldLength,
            moldWidth,
            moldHoleSpacing,
            colorMatchingCost,
            machineSetupCost,
            workerSalaryPerMachinePerShift,
            electricityCostPerMachinePerShift,
            rentPerMachinePerShift,
            profitPerMachinePerShift
        } = constants;

        // 一模多少个产品
        const productsPerMold = Math.floor((moldLength / (length + moldHoleSpacing)) * (moldWidth / (width + moldHoleSpacing)));
        console.log(`productsPerMold: ${productsPerMold}`);

        // 一个班出多少模
        const moldsPerClass = 120 * (3 / difficultyLevel);
        console.log(`moldsPerClass: ${moldsPerClass}`);

        // 一个班做多少个产品
        const totalProductsPerClass = productsPerMold * moldsPerClass;
        console.log(`totalProductsPerClass: ${totalProductsPerClass}`);

        // 需要做多少个班
        const numberOfClassesNeeded = quantity / totalProductsPerClass;
        console.log(`numberOfClassesNeeded: ${numberOfClassesNeeded}`);

        // 单个产品的重量
        const productWeight = length * width * height * materialDensity * weightRatio;
        console.log(`productWeight: ${productWeight}`);

        // 一个产品浪费的原料的价格
        const wastedMaterialsCost = materialWastageRate * productWeight * pricePerGramOfMaterial;
        console.log(`wastedMaterialsCost: ${wastedMaterialsCost}`);

        // 总固定费用：调机和调色费用
        const totalFixedCost = colorMatchingCost * (difficultyLevel / 3) + machineSetupCost;
        console.log(`totalFixedCost: ${totalFixedCost}`);

        // 一个班的支出
        const expensesPerShift = workerSalaryPerMachinePerShift + electricityCostPerMachinePerShift + rentPerMachinePerShift;
        console.log(`expensesPerShift: ${expensesPerShift}`);

        // 单个产品价格 = 单个产品的固定费用 + 单个产品的班次支出 + 单个产品的原料支出 + 单个产品的废料支出 + 单个产品的利润

        // 单个产品的固定费用
        const unitFixedCost = totalFixedCost / quantity;
        console.log(`unitFixedCost: ${unitFixedCost}`);

        // 单个产品的班次支出
        const shiftExpensesPerProduct = expensesPerShift / totalProductsPerClass;
        console.log(`shiftExpensesPerProduct: ${shiftExpensesPerProduct}`);

        // 单个产品的原料支出
        const rawMaterialCostPerUnit = productWeight * pricePerGramOfMaterial;
        console.log(`rawMaterialCostPerUnit: ${rawMaterialCostPerUnit}`);

        // 单个产品的废料支出
        const wasteExpensesPerProduct = productWeight * materialWastageRate * pricePerGramOfMaterial;
        console.log(`wasteExpensesPerProduct: ${wasteExpensesPerProduct}`);

        // 单个产品的利润
        const profitPerProduct = profitPerMachinePerShift / totalProductsPerClass;
        console.log(`profitPerProduct: ${profitPerProduct}`);

        const productPrice = unitFixedCost + shiftExpensesPerProduct + rawMaterialCostPerUnit + wasteExpensesPerProduct + profitPerProduct;
        console.log(`productPrice: ${productPrice}`);

        resultDiv.textContent = `产品报价: ${productPrice.toFixed(2)} 元`;
    }
    form.addEventListener('submit', handleFormSubmit);
});
