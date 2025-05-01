const manures = [
  {
    name: "Cow Dung Manure",
    type: "Organic",
    features: ["Rich in Nitrogen", "Improves Soil Fertility", "Slow-release nutrients"],
    quality: "High Quality",
    pricePerKg: 10,
    recommendedCrops: "Vegetables, Cereals, Pulses",
    usage: "Use 5-10 tons per acre before sowing.",
    nutrientContent: "N: 0.5% | P: 0.2% | K: 0.5%",
    image: "cow_dung.jpeg",
    description: "Traditional natural manure from cows for enriching soil structure."
  },
 
    {
      name: "Vermicompost",
      type: "Organic",
      features: ["Boosts plant immunity", "Enhances soil aeration", "Eco-friendly"],
      quality: "Certified Organic",
      pricePerKg: 15,
      recommendedCrops: "Fruits, Vegetables, Flowers",
      usage: "Apply 2-4 tons per acre.",
      nutrientContent: "N: 1.5% | P: 0.8% | K: 1.2%",
      image: "vermicompost.jpg",
      description: "Produced by earthworms, rich in essential nutrients."
    },
    {
      name: "Poultry Manure",
      type: "Organic",
      features: ["High Phosphorus", "Quick nutrient supply"],
      quality: "Fresh Farm",
      pricePerKg: 12,
      recommendedCrops: "Vegetables, Paddy, Maize",
      usage: "Apply 2 tons per acre post-harvest.",
      nutrientContent: "N: 3% | P: 2.5% | K: 1.5%",
      image: "poultry_manure.jpg",
      description: "Highly nutritious manure derived from poultry droppings."
    },
    {
      name: "Sheep Manure",
      type: "Organic",
      features: ["Retains moisture", "Improves soil structure"],
      quality: "Premium",
      pricePerKg: 11,
      recommendedCrops: "Dryland Crops, Millets",
      usage: "Broadcast 3 tons per acre during plowing.",
      nutrientContent: "N: 2% | P: 1% | K: 2%",
      image: "sheep_manure.jpeg",
      description: "Dry, lightweight and rich in nutrients for arid soils."
    },
    {
      name: "Green Manure",
      type: "Organic",
      features: ["Fixes nitrogen", "Reduces weeds"],
      quality: "Organic Certified",
      pricePerKg: 14,
      recommendedCrops: "Rice, Wheat, Sugarcane",
      usage: "Plow green plants into soil before flowering.",
      nutrientContent: "Varies",
      image: "green_manure.webp",
      description: "Crops grown specifically to be turned into the soil to improve fertility."
    },
    {
      name: "Chemical Urea",
      type: "Non-Organic",
      features: ["High Nitrogen", "Quick action fertilizer"],
      quality: "Industrial Grade",
      pricePerKg: 20,
      recommendedCrops: "All Crops",
      usage: "Apply based on soil test recommendations.",
      nutrientContent: "N: 46%",
      image: "chemical_urea.png",
      description: "Highly concentrated nitrogen fertilizer."
    },
    
    {
      name: "Potash Fertilizer",
      type: "Non-Organic",
      features: ["Strengthens plants", "Improves drought resistance"],
      quality: "Industrial Grade",
      pricePerKg: 22,
      recommendedCrops: "Cotton, Sugarcane, Banana",
      usage: "Split application along with irrigation.",
      nutrientContent: "K: 60%",
      image: "potash_manure.jpg",
      description: "Essential for fruit and seed development."
    },
    {
      name: "NPK Fertilizer",
      type: "Non-Organic",
      features: ["Balanced Nutrition", "Boosts Yield"],
      quality: "Premium Mix",
      pricePerKg: 25,
      recommendedCrops: "Fruits, Vegetables",
      usage: "Apply based on crop stage requirement.",
      nutrientContent: "N: 12% | P: 32% | K: 16%",
      image: "npk_manure.webp",
      description: "Complete fertilizer mix for balanced crop growth."
    },
   
  ];
  
  

const cart = [];

const manureList = document.getElementById('manureList');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartSection = document.getElementById('cartSection');
const cartCount = document.getElementById('cartCount');

// Load Manures
manures.forEach((manure, index) => {
  const card = document.createElement('div');
  card.className = 'manure-card';
  card.innerHTML = `
    <img src="${manure.image}" alt="${manure.name}">
    <h3>${manure.name}</h3>
    <p><strong>Type:</strong> ${manure.type}</p>
    <p><strong>Price:</strong> ₹${manure.pricePerKg}/Kg</p>
    <p><strong>Quality:</strong> ${manure.quality}</p>
    <p><strong>Recommended Crops:</strong> ${manure.recommendedCrops}</p>
    <p><strong>Usage:</strong> ${manure.usage}</p>
    <p><strong>Nutrient Content:</strong> ${manure.nutrientContent}</p>
    <p>${manure.description}</p>
    <ul>${manure.features.map(f => `<li>${f}</li>`).join('')}</ul>
    <button onclick="addToCart(${index})">Add to Cart</button>
  `;
  manureList.appendChild(card);
});

function addToCart(index) {
  const selected = manures[index];
  const found = cart.find(item => item.name === selected.name);

  if (found) {
    found.quantity += 1;
  } else {
    cart.push({ ...selected, quantity: 1 });
  }
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span>${item.name} (x${item.quantity})</span>
      <span>₹${item.pricePerKg * item.quantity}</span>
    `;
    cartItems.appendChild(div);
    total += item.pricePerKg * item.quantity;
  });
  cartTotal.innerText = total;
  cartCount.innerText = cart.length;
}

document.getElementById('viewCartBtn').addEventListener('click', () => {
  cartSection.style.display = 'block';
});

document.getElementById('closeCartBtn').addEventListener('click', () => {
  cartSection.style.display = 'none';
});

document.getElementById('placeOrderBtn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let orderSummary = "Thank you! Your order has been placed!\n\nOrder Details:\n";
  cart.forEach(item => {
    orderSummary += `${item.name} - ${item.quantity} kg - ₹${item.pricePerKg * item.quantity}\n`;
  });
  orderSummary += `\nTotal: ₹${cartTotal.innerText}`;

  alert(orderSummary);

  // Clear Cart
  cart.length = 0;
  updateCart();
  cartSection.style.display = 'none';
});