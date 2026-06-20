const discountSlider = document.querySelector("#exampleDiscount");
const listPrice = 159;
const standardCost = 59.466;
const originalMargin = ((listPrice - standardCost) / listPrice) * 100;
const money = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  minimumFractionDigits: 2,
});

function updateExample() {
  const discount = Number(discountSlider.value);
  const newPrice = listPrice * (1 - discount / 100);
  const profit = newPrice - standardCost;
  const margin = (profit / newPrice) * 100;
  const movement = margin - originalMargin;
  const costWidth = Math.min(100, (standardCost / newPrice) * 100);

  document.querySelector("#exampleDiscountLabel").textContent = `${discount.toFixed(1)}%`;
  document.querySelector("#examplePrice").textContent = money.format(newPrice);
  document.querySelector("#exampleProfit").textContent = money.format(profit);
  document.querySelector("#exampleMargin").textContent = `${margin.toFixed(1)}%`;
  document.querySelector("#exampleMovement").textContent = `${movement.toFixed(1)} points`;
  document.querySelector("#profitStrip").textContent = money.format(profit);
  document.querySelector("#priceFormula").textContent = `${money.format(listPrice)} - ${discount.toFixed(1)}% = ${money.format(newPrice)}`;
  document.querySelector("#profitFormula").textContent = `${money.format(newPrice)} - ${money.format(standardCost)} = ${money.format(profit)}`;
  document.querySelector("#marginFormula").textContent = `${money.format(profit)} / ${money.format(newPrice)} = ${margin.toFixed(1)}%`;
  document.querySelector("#costShare").style.width = `${costWidth}%`;
  document.querySelector("#profitShare").style.width = `${100 - costWidth}%`;
}

discountSlider.addEventListener("input", updateExample);
updateExample();
