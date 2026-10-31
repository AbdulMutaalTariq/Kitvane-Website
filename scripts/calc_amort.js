const principal = 25000;
const annualRate = 7.5;
const totalMonths = 60;
const monthlyRate = annualRate / 12 / 100;

const factor = Math.pow(1 + monthlyRate, totalMonths);
const emi = (principal * monthlyRate * factor) / (factor - 1);
const totalPayment = emi * totalMonths;
const totalInterest = totalPayment - principal;

function formatMoney(amount) {
  return '$' + amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

console.log('EMI:', formatMoney(emi));
console.log('Principal:', formatMoney(principal));
console.log('Total Interest:', formatMoney(totalInterest));
console.log('Total Payment:', formatMoney(totalPayment));

let balance = principal;
const totalYears = 5;
const rows = [];

for (let y = 1; y <= totalYears; y++) {
  let yearPrincipal = 0;
  let yearInterest = 0;
  for (let m = 1; m <= 12; m++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = Math.min(emi - interestPayment, balance);
    yearInterest += interestPayment;
    yearPrincipal += principalPayment;
    balance = Math.max(0, balance - principalPayment);
  }
  rows.push({
    year: y,
    principal: formatMoney(yearPrincipal),
    interest: formatMoney(yearInterest),
    balance: formatMoney(balance)
  });
}

console.log('Yearly rows:', rows);
