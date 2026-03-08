export function calculate(params) {
  const {
    propertyPrice, monthlyRent, downPaymentPct, loanRate,
    loanTenure, appreciation, rentIncrease, maintenance,
    investReturn, horizon, taxBracket, stampDutyPct,
    forcedSavingsPct, hraExemptionAnnual,
  } = params;

  const downPayment    = propertyPrice * (downPaymentPct / 100);
  const loanAmount     = propertyPrice - downPayment;
  const monthlyRate    = loanRate / 100 / 12;
  const totalMonths    = loanTenure * 12;
  const emi = totalMonths > 0
    ? loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;

  const stampDutyCost    = propertyPrice * (stampDutyPct / 100);
  const registrationCost = propertyPrice * 0.01;
  const buyingCosts      = stampDutyCost + registrationCost;

  let downPaymentCorpus = downPayment + buyingCosts;
  let savingsCorpus     = 0;
  let totalRentPaid = 0, totalEmiPaid = 0, totalTaxSaved = 0, totalHraTaxSaved = 0;

  const buyWealthArr = [], rentWealthArr = [];
  const yearlyBuy = [], yearlyRent = [], yearlyCumBuy = [], yearlyCumRent = [];

  let loanBalance = loanAmount;
  let cumBuy = buyingCosts, cumRent = 0;
  let currentRent = monthlyRent;

  for (let yr = 1; yr <= horizon; yr++) {
    let principalPaid = 0, interestPaid = 0;
    if (yr <= loanTenure) {
      let bal = loanBalance;
      for (let m = 0; m < 12; m++) {
        const ip = bal * monthlyRate;
        const pp = emi - ip;
        interestPaid += ip; principalPaid += pp; bal -= pp;
      }
      loanBalance -= principalPaid;
    }

    const yearEmi       = yr <= loanTenure ? emi * 12 : 0;
    const maintNow      = maintenance * Math.pow(1.05, yr - 1);
    const yearMaint     = maintNow * 12;
    const sec80C        = Math.min(principalPaid, 150000);
    const sec24b        = Math.min(interestPaid, 200000);
    const taxSaved      = (sec80C + sec24b) * (taxBracket / 100);
    const hraTaxSaved   = hraExemptionAnnual * (taxBracket / 100);

    totalTaxSaved    += taxSaved;
    totalRentPaid    += currentRent * 12;
    totalEmiPaid     += yearEmi;
    totalHraTaxSaved += hraTaxSaved;

    cumBuy  += yearEmi + yearMaint - taxSaved;
    cumRent += currentRent * 12;
    yearlyCumBuy.push(cumBuy);
    yearlyCumRent.push(cumRent);
    yearlyBuy.push(yearEmi + yearMaint - taxSaved);
    yearlyRent.push(currentRent * 12);

    for (let m = 0; m < 12; m++) {
      downPaymentCorpus = downPaymentCorpus * (1 + investReturn / 100 / 12);
    }

    const savingsRaw   = (yr <= loanTenure ? emi : 0) + maintNow - currentRent;
    const monthlySavings = savingsRaw * (forcedSavingsPct / 100);
    for (let m = 0; m < 12; m++) {
      savingsCorpus = savingsCorpus * (1 + investReturn / 100 / 12) + Math.max(0, monthlySavings);
    }
    savingsCorpus += hraTaxSaved;

    const propValue = propertyPrice * Math.pow(1 + appreciation / 100, yr);
    buyWealthArr.push(propValue - Math.max(0, loanBalance));
    rentWealthArr.push(downPaymentCorpus + savingsCorpus);

    currentRent *= (1 + rentIncrease / 100);
  }

  let breakevenYear = null;
  for (let i = 0; i < horizon; i++) {
    if (buyWealthArr[i] >= rentWealthArr[i]) { breakevenYear = i + 1; break; }
  }

  let costCrossoverYear = null;
  for (let i = 0; i < horizon; i++) {
    if (yearlyCumRent[i] >= yearlyCumBuy[i]) { costCrossoverYear = i + 1; break; }
  }

  let finalLoan = loanAmount;
  for (let m = 0; m < Math.min(horizon, loanTenure) * 12; m++) {
    const ip = finalLoan * monthlyRate;
    finalLoan -= (emi - ip);
  }
  finalLoan = Math.max(0, finalLoan);

  const propValueAtHorizon = propertyPrice * Math.pow(1 + appreciation / 100, horizon);
  const buyNetWealth  = buyWealthArr[horizon - 1];
  const rentNetWealth = rentWealthArr[horizon - 1];

  return {
    emi, downPayment, loanAmount, buyingCosts, stampDutyCost, registrationCost,
    totalRentPaid, totalEmiPaid, totalTaxSaved, totalHraTaxSaved,
    propValueAtHorizon, outstandingLoan: finalLoan,
    downPaymentCorpus, savingsCorpus,
    buyNetWealth, rentNetWealth,
    winner: buyNetWealth >= rentNetWealth ? "buy" : "rent",
    diff: Math.abs(buyNetWealth - rentNetWealth),
    buyWealthArr, rentWealthArr, breakevenYear, costCrossoverYear,
    yearlyBuy, yearlyRent, yearlyCumBuy, yearlyCumRent,
  };
}

export function calculateRentThenBuy(params) {
  const {
    propertyPrice, monthlyRent, downPaymentPct, loanRate,
    loanTenure, appreciation, rentIncrease, maintenance,
    investReturn, horizon, taxBracket, stampDutyPct,
    forcedSavingsPct, hraExemptionAnnual, switchYear,
  } = params;

  if (switchYear >= horizon || switchYear < 1) return null;

  const origDownPayment  = propertyPrice * (downPaymentPct / 100);
  const origLoanAmount   = propertyPrice - origDownPayment;
  const origBuyCosts     = propertyPrice * (stampDutyPct / 100 + 0.01);
  const monthlyRate      = loanRate / 100 / 12;
  const totalMonths      = loanTenure * 12;

  const origEmi = origLoanAmount > 0
    ? origLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;

  let corpus = origDownPayment + origBuyCosts;
  let currentRent = monthlyRent;
  const wealthArr = [];
  const yearlyCum = [];
  let cumCost = 0;
  let totalRentPaidRTB = 0;

  for (let yr = 1; yr <= switchYear; yr++) {
    const maintNow = maintenance * Math.pow(1.05, yr - 1);
    const savingsRaw = origEmi + maintNow - currentRent;
    const monthlySavings = savingsRaw * (forcedSavingsPct / 100);
    for (let m = 0; m < 12; m++) {
      corpus = corpus * (1 + investReturn / 100 / 12) + Math.max(0, monthlySavings);
    }
    corpus += hraExemptionAnnual * (taxBracket / 100);

    totalRentPaidRTB += currentRent * 12;
    cumCost += currentRent * 12;
    yearlyCum.push(cumCost);
    wealthArr.push(corpus);
    currentRent *= (1 + rentIncrease / 100);
  }

  const newPrice     = propertyPrice * Math.pow(1 + appreciation / 100, switchYear);
  const newBuyCosts  = newPrice * (stampDutyPct / 100 + 0.01);
  const neededDP     = newPrice * (downPaymentPct / 100) + newBuyCosts;
  const usedFromCorpus  = Math.min(corpus, neededDP);
  let corpusRemainder   = corpus - usedFromCorpus;
  const newLoanAmount   = Math.max(0, newPrice - (usedFromCorpus - newBuyCosts));
  const newEmi = newLoanAmount > 0
    ? newLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;

  let loanBalance = newLoanAmount;
  cumCost += newBuyCosts;
  let totalEmiPaidRTB = 0, totalTaxSavedRTB = 0;

  for (let yr = switchYear + 1; yr <= horizon; yr++) {
    let principalPaid = 0, interestPaid = 0;
    const phaseYr = yr - switchYear;
    if (phaseYr <= loanTenure) {
      let bal = loanBalance;
      for (let m = 0; m < 12; m++) {
        const ip = bal * monthlyRate;
        const pp = newEmi - ip;
        interestPaid += ip; principalPaid += pp; bal -= pp;
      }
      loanBalance -= principalPaid;
    }

    const yearEmi  = phaseYr <= loanTenure ? newEmi * 12 : 0;
    const maintNow = maintenance * Math.pow(1.05, yr - 1);
    const sec80C   = Math.min(principalPaid, 150000);
    const sec24b   = Math.min(interestPaid, 200000);
    const taxSaved = (sec80C + sec24b) * (taxBracket / 100);

    totalEmiPaidRTB  += yearEmi;
    totalTaxSavedRTB += taxSaved;
    cumCost += yearEmi + maintNow * 12 - taxSaved;
    yearlyCum.push(cumCost);

    for (let m = 0; m < 12; m++) {
      corpusRemainder = corpusRemainder * (1 + investReturn / 100 / 12);
    }

    const propValue = newPrice * Math.pow(1 + appreciation / 100, phaseYr);
    wealthArr.push(propValue - Math.max(0, loanBalance) + corpusRemainder);
  }

  return {
    wealthArr, yearlyCum,
    finalWealth: wealthArr[horizon - 1],
    newPrice, newEmi, newLoanAmount, newBuyCosts,
    totalRentPaidRTB, totalEmiPaidRTB, totalTaxSavedRTB,
  };
}
