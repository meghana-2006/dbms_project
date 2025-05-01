const products = [
    {
      id: 1,
      name: "Fresh Tomatoes",
      category: "Vegetables",
      price: 25,
      quantity: "1 Kg",
      image: "Tomato.jpg"
    },
    {
      id: 2,
      name: "Organic Mangoes",
      category: "Fruits",
      price: 80,
      quantity: "1 Kg",
      image: "mango.webp"
    },
    {
      id: 3,
      name: "Green Chillies",
      category: "Vegetables",
      price: 30,
      quantity: "500 g",
      image: "green-chilli.webp"
    },
    {
      id: 4,
      name: "Wheat (Gehu)",
      category: "Cereals",
      price: 40,
      quantity: "1 Kg",
      image: "Wheat.webp"
    },
    {
      id: 5,
      name: "Onions",
      category: "Vegetables",
      price: 20,
      quantity: "1 Kg",
      image: "Onion.jpg"
    },
    {
      id: 6,
      name: "Apples",
      category: "Fruits",
      price: 100,
      quantity: "1 Kg",
      image: "apple.jpg"
    },
    {
        id: 7,
        name: "Grapes",
        category: "Fruits",
        price: 50,
        quantity: "1 Kg",
        image: "grapes.jpg"
    },
    {
      id: 8,
      name: "Rice (Chawal)",
      category: "Cereals",
      price: 50,
      quantity: "1 Kg",
      image: "rice.webp"
    },
    {
        id: 9,
        name: "raggi",
        category: "Cereals",
        price: 80,
        quantity: "1 Kg",
        image: "raagi.webp"
      },
      {
        id: 10,
        name:"banana",
        category: "Fruits",
        price: 60,
        quantity: "1 Kg",
        image: "banana.jpg"
      },
      {
        id: 11,
        name: "potato",
        category: "Vegetables",
        price: 30,
        quantity: "1 Kg",
        image: "potato.webp"
      },
      {
        id: 12,
        name: "jowar",
        category: "Cereals",
        price: 200,
        quantity: "1 Kg",
        image: "jowar.webp"
      }
  ];
  
  let cart = [];
  
  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const confirmation = document.getElementById("confirmation");
  const categoryFilter = document.getElementById("categoryFilter");
  
  function renderProducts(category = "all") {
    productList.innerHTML = "";
  
    const filtered = category === "all"
      ? products
      : products.filter(p => p.category === category);
  
    filtered.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>Price: ₹${product.price} / ${product.quantity}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productList.appendChild(card);
    });
  }
  
  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCart();
  }
  
  function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      const li = document.createElement("li");
      li.innerText = `${item.name} - ₹${item.price}`;
      cartItems.appendChild(li);
      total += item.price;
    });
    cartTotal.innerText = total;
  }
  
  document.getElementById("checkout-btn").onclick = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    cart = [];
    updateCart();
    confirmation.classList.remove("hidden");
    setTimeout(() => confirmation.classList.add("hidden"), 3000);
  };
  
  categoryFilter.addEventListener("change", () => {
    renderProducts(categoryFilter.value);
  });
  
  // Initial render
  renderProducts();