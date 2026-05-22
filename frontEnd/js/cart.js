const API_URL = 'http://localhost:3000';
const cartContainer = document.getElementById('cart-container');
const cartSummary = document.getElementById('cart-summary');
const cartBtn = document.getElementById('cart-btn');
const favBtn = document.getElementById('fav-btn');

let cart = JSON.parse(localStorage.getItem('YShop_Cart')) || [];
let favorites = JSON.parse(localStorage.getItem('YShop_Favorites')) || [];

if (cartBtn) cartBtn.onclick = () => window.location.href = 'cart.html';
if (favBtn) favBtn.onclick = () => window.location.href = 'favorites.html';

function updateHeader() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBtn) cartBtn.textContent = `Panier (${totalItems})`;
    if (favBtn) favBtn.textContent = `Mes Favoris (${favorites.length})`;
}

async function loadCart() {
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Votre panier est vide.</p>';
        cartSummary.innerHTML = '';
        updateHeader();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) throw new Error('Erreur API');
        const allProducts = await response.json();
        displayCart(allProducts);
    } catch (error) {
        cartContainer.innerHTML = '<p>Erreur de chargement du panier.</p>';
    }
}

function displayCart(allProducts) {
    cartContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((cartItem, index) => {
        const product = allProducts.find(p => p.id === cartItem.id);
        if (!product) return;

        const itemTotal = product.price * cartItem.quantity;
        totalPrice += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.style.display = 'flex';
        itemDiv.style.justifyContent = 'space-between';
        itemDiv.style.padding = '15px';
        itemDiv.style.borderBottom = '1px solid #eee';
        itemDiv.style.alignItems = 'center';

        const nameEl = document.createElement('span');
        nameEl.textContent = `${product.name} (x${cartItem.quantity})`;
        nameEl.style.fontWeight = 'bold';

        const priceEl = document.createElement('span');
        priceEl.textContent = `${itemTotal} ${product.currency}`;
        priceEl.style.color = '#e74c3c';

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Retirer';
        removeBtn.classList.add('btn');
        removeBtn.style.backgroundColor = '#e74c3c';
        removeBtn.onclick = () => {
            cart.splice(index, 1);
            localStorage.setItem('YShop_Cart', JSON.stringify(cart));
            loadCart();
        };

        itemDiv.append(nameEl, priceEl, removeBtn);
        cartContainer.appendChild(itemDiv);
    });

    cartSummary.innerHTML = `
        <h3 style="font-size: 1.8rem; margin-bottom: 15px;">Total : ${totalPrice} Y-credit</h3>
        <button id="checkout-btn" class="btn btn-buy" style="width: 300px;">Valider la commande</button>
    `;

    document.getElementById('checkout-btn').onclick = () => processCheckout();
    updateHeader();
}

async function processCheckout() {
    try {
        const response = await fetch(`${API_URL}/api/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: cart })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            cart = [];
            localStorage.setItem('YShop_Cart', JSON.stringify(cart));
            loadCart();
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Erreur réseau lors de la validation.');
    }
}

updateHeader();
loadCart();