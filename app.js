let products = [];
let selectedProduct = null;

const productSelect = document.querySelector("#productSelect");
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const discountRange = document.querySelector("#discountRange");
const discountInput = document.querySelector("#discountInput");
const discountOutput = document.querySelector("#discountOutput");
const dbBadge = document.querySelector("#dbBadge");

const money = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatPercent(value) {
  if (!Number.isFinite(value)) return "0.0%";
  return `${value.toFixed(1)}%`;
}

function formatPoints(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} points`;
}

function clampDiscount(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(60, Math.max(0, number));
}

function setText(id, value) {
  document.querySelector(`#${id}`).textContent = value;
}

function decisionForMargin(marginPercent) {
  if (marginPercent >= 22) return ["Healthy", "good"];
  if (marginPercent >= 16) return ["Review", "review"];
  return ["Below Target", "bad"];
}

function setBar(id, value, base, className) {
  const bar = document.querySelector(`#${id}`);
  bar.style.width = `${Math.max(2, Math.min(100, Math.abs(value) / base * 100))}%`;
  bar.className = `bar ${className}`;
}

function calculate() {
  if (!selectedProduct) return;

  const discount = clampDiscount(discountInput.value);
  discountRange.value = discount;
  discountInput.value = discount.toFixed(1);
  discountOutput.textContent = formatPercent(discount);

  const discountValue = selectedProduct.listPrice * (discount / 100);
  const newSellingPrice = selectedProduct.listPrice - discountValue;
  const newGrossProfit = newSellingPrice - selectedProduct.standardCost;
  const newMargin = newSellingPrice === 0 ? 0 : (newGrossProfit / newSellingPrice) * 100;
  const originalMargin = selectedProduct.margin * 100;
  const originalMarkup = selectedProduct.markup * 100;
  const breakEvenDiscount = selectedProduct.listPrice === 0
    ? 0
    : ((selectedProduct.listPrice - selectedProduct.standardCost) / selectedProduct.listPrice) * 100;
  const [decisionText, decisionClass] = decisionForMargin(newMargin);
  const base = Math.max(selectedProduct.listPrice, selectedProduct.standardCost, Math.abs(newGrossProfit), 1);

  setText("newPrice", money.format(newSellingPrice));
  setText("grossProfit", money.format(newGrossProfit));
  setText("margin", formatPercent(newMargin));

  const decision = document.querySelector("#decision");
  decision.textContent = decisionText;
  decision.className = decisionClass;

  setText("productName", selectedProduct.name);
  setText("productMeta", `Product ID ${selectedProduct.productId} | ${selectedProduct.productNumber}`);
  setText("listPrice", money.format(selectedProduct.listPrice));
  setText("standardCost", money.format(selectedProduct.standardCost));
  setText("originalMargin", formatPercent(originalMargin));
  setText("originalMarkup", formatPercent(originalMarkup));
  setText("discountValue", money.format(discountValue));
  setText("marginMovement", formatPoints(newMargin - originalMargin));
  setText("breakEvenDiscount", formatPercent(breakEvenDiscount));

  setBar("priceBar", selectedProduct.listPrice, base, "price");
  setBar("discountBar", discountValue, base, "discount");
  setBar("costBar", selectedProduct.standardCost, base, "cost");
  setBar("profitBar", newGrossProfit, base, newGrossProfit >= 0 ? "profit" : "loss");

  setText("priceBarText", money.format(selectedProduct.listPrice));
  setText("discountBarText", `-${money.format(discountValue)}`);
  setText("costBarText", money.format(selectedProduct.standardCost));
  setText("profitBarText", money.format(newGrossProfit));
}

function renderProducts() {
  productSelect.innerHTML = "";

  if (!products.length) {
    const option = document.createElement("option");
    option.textContent = "No products found";
    productSelect.appendChild(option);
    selectedProduct = null;
    return;
  }

  for (const product of products) {
    const option = document.createElement("option");
    option.value = product.productId;
    option.textContent = `${product.name} | ID ${product.productId} | ${money.format(product.listPrice)}`;
    productSelect.appendChild(option);
  }

  selectedProduct = products[0];
  calculate();
}

async function loadProducts() {
  dbBadge.textContent = "Loading demo data";
  const search = encodeURIComponent(searchInput.value.trim());
  const response = await fetch("data.json");
  const data = await response.json();

  if (!response.ok) {
    dbBadge.textContent = "Demo data needs attention";
    throw new Error(`${data.error || "Data error"} ${data.detail || ""}`);
  }

  const searchText = decodeURIComponent(search).toLowerCase();
  products = data.products.filter((product) => {
    if (!searchText) return true;
    return [product.name, product.productNumber, String(product.productId)]
      .some((value) => value.toLowerCase().includes(searchText));
  });
  dbBadge.textContent = "GitHub Pages demo data";
  renderProducts();
}

productSelect.addEventListener("change", () => {
  selectedProduct = products.find((product) => String(product.productId) === productSelect.value) || products[0];
  calculate();
});

discountRange.addEventListener("input", () => {
  discountInput.value = clampDiscount(discountRange.value).toFixed(1);
  calculate();
});

discountInput.addEventListener("input", calculate);

searchButton.addEventListener("click", () => {
  loadProducts().catch((error) => alert(error.message));
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loadProducts().catch((error) => alert(error.message));
  }
});

loadProducts().catch((error) => {
  productSelect.innerHTML = "<option>Could not load demo products</option>";
  dbBadge.textContent = "Demo data needs attention";
  alert(error.message);
});
