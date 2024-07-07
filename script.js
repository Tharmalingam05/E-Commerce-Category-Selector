let activeTab = "Men";
let allCategories = [];

const API_ENDPOINT =
  "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json";

async function activateTab(e) {
  const btnTabs = document.querySelectorAll(".tab");
  const currentBtn = e.target;

  btnTabs.forEach((btn) => {
    activeTab = currentBtn.getAttribute("name");
    if (btn.getAttribute("name") === currentBtn.getAttribute("name")) {
      btn.setAttribute("data-active", true);
    } else {
      btn.setAttribute("data-active", false);
    }
  });
  renderCards(allCategories);
}

async function renderUI() {
  const tabContainer = document.querySelector("#tabContainer");
  const categories = await getCategories();
  activeTab = categories[0].category_name;
  allCategories = categories;

  for (const category of categories) {
    const tab = document.createElement("button");

    tab.setAttribute("data-active", category.category_name === "Men");
    tab.name = category.category_name;
    tab.onclick = activateTab;
    tab.className = "btn tab";

    tab.textContent = category.category_name;
    tabContainer.appendChild(tab);
  }

  document.querySelector("#loader").setAttribute("data-visible", false);
  document.querySelector(".container").setAttribute("data-visible", true);

  renderCards(categories);
}

function renderCards(categories) {
  const productsContainer = document.querySelector("#tabContent");
  const productsCards = document.querySelectorAll(".product-card");

  if (productsCards.length > 0) {
    productsCards.forEach((card) => productsContainer.removeChild(card));
  }

  const selectCategory = categories.find(
    (category) => category.category_name === activeTab
  );

  selectCategory.category_products.forEach((product) => {
    productsContainer.appendChild(createProductCard(product));
  });
}

function createProductCard(product) {
  let productTag = null;
  const productCard = document.createElement("div");

  const productImage = document.createElement("img");
  const productContent = document.createElement("div");
  const productHeader = document.createElement("header");
  const productTitle = document.createElement("h3");
  const productDot = document.createElement("span");
  const productCompany = document.createElement("span");
  const productPriceDetails = document.createElement("div");
  const productPrice = document.createElement("h4");
  const productOriginalPrice = document.createElement("span");
  const productOffer = document.createElement("span");
  const productFooter = document.createElement("footer");
  const productActionBtn = document.createElement("button");

  productCard.className = "product-card";
  productImage.className = "product-image";
  productContent.className = "product-content";
  productHeader.className = "product-header";
  productTitle.className = "product-title";
  productDot.className = "dot";
  productCompany.className = "product-company";
  productPriceDetails.className = "product-price_details";
  productPrice.className = "product-price";
  productOriginalPrice.className = "original-price";
  productOffer.className = "offer";
  productFooter.className = "product-footer";
  productActionBtn.className = "btn";

  if (product.badge_text) {
    productTag = document.createElement("span");
    productTag.className = "badge product-tag";
    productTag.textContent = product.badge_text;
    productCard.append(productTag);
  }

  productImage.src = product.image;
  productImage.alt = product.title;

  productTitle.textContent = product.title;
  productCompany.textContent = product.vendor;
  productHeader.appendChild(productTitle);
  productHeader.appendChild(productDot);
  productHeader.appendChild(productCompany);

  productPrice.textContent = `Rs ${product.price}`;
  productOriginalPrice.textContent = product.compare_at_price;
  productOffer.textContent = `${calculateOffer(
    product.compare_at_price,
    product.price
  )}% Off`; // TODO: calculate offer
  productPriceDetails.appendChild(productPrice);
  productPriceDetails.appendChild(productOriginalPrice);
  productPriceDetails.appendChild(productOffer);

  productActionBtn.textContent = "Add To Cart";
  productFooter.appendChild(productActionBtn);

  productContent.appendChild(productHeader);
  productContent.appendChild(productPriceDetails);
  productContent.appendChild(productFooter);

  productCard.append(productImage);
  productCard.append(productContent);

  return productCard;
}

async function getCategories() {
  const res = await fetch(API_ENDPOINT);
  const data = await res.json();
  return data.categories;
}

function calculateOffer(originalPrice, sellingPrice) {
  if (originalPrice <= 0) {
    throw new Error("Original price must be greater than 0");
  }
  const discount = originalPrice - sellingPrice;
  const offerPercentage = (discount / originalPrice) * 100;
  return offerPercentage.toFixed(2); // Keeping two decimal places
}

// initial render
renderUI();
