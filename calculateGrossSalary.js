function calculateINSS(grossSalary) {
    const inssRates = [
        { limit: 1320.00, rate: 0.075 },
        { limit: 2571.29, rate: 0.09 },
        { limit: 3856.94, rate: 0.12 },
        { limit: 7507.49, rate: 0.14 }
    ];
    let inss = 0;

    inssRates.forEach((rateInfo, index) => {
        const previousLimit = index === 0 ? 0 : inssRates[index - 1].limit;
        const taxableIncome = Math.min(grossSalary, rateInfo.limit) - previousLimit;
        if (taxableIncome > 0) {
            inss += taxableIncome * rateInfo.rate;
        }
    });

    return Math.min(inss, 828.38); // INSS ceiling value as of 2023
}

function calculateIRPF(grossSalary, inss) {
    const irpfRates = [
        { limit: 2112, rate: 0, deduction: 0 },
        { limit: 2826.66, rate: 0.075, deduction: 158.40 },
        { limit: 3751.06, rate: 0.15, deduction: 370.40 },
        { limit: 4664.68, rate: 0.225, deduction: 651.73 },
        { limit: Infinity, rate: 0.275, deduction: 884.96 }
    ];
    const baseSalary = grossSalary - inss;
    let irpf = 0;

    irpfRates.forEach((rateInfo) => {
        if (baseSalary > rateInfo.limit) {
            irpf = baseSalary * rateInfo.rate - rateInfo.deduction;
        }
    });

    return irpf;
}

function estimateGrossSalary(netSalary) {
    let estimatedGross = netSalary;
    let calculatedNet = 0;
    const tolerance = 0.01;
    const maxIterations = 1000;
    let iterations = 0;

    while (iterations < maxIterations) {
        const inss = calculateINSS(estimatedGross);
        const irpf = calculateIRPF(estimatedGross, inss);
        calculatedNet = estimatedGross - inss - irpf;

        if (Math.abs(calculatedNet - netSalary) <= tolerance) {
            return estimatedGross;
        }

        estimatedGross += (netSalary - calculatedNet);
        iterations++;
    }

    return estimatedGross;
}