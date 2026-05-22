const API_URL = 'http://localhost:3000';
const catalogContainer = document.getElementById('catalog-container');
const rarityFilter = document.getElementById('rarity-filter');
const cartBtn = document.getElementById('cart-btn');
const favBtn = document.getElementById('fav-btn');

let allProducts = [];

let cart = JSON.parse(localStorage.getItem('YShop_Cart')) || [];
let favorites = JSON.parse(localStorage.getItem('YShop_Favorites')) || [];

function updateHeader() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBtn) cartBtn.textContent = `Panier (${totalItems})`;
    if (favBtn) favBtn.textContent = `Mes Favoris (${favorites.length})`;
}

if (cartBtn) cartBtn.onclick = () => window.location.href = 'cart.html';
if (favBtn) favBtn.onclick = () => window.location.href = 'favorites.html';

async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) {
            throw new Error('Erreur de réseau');
        }
        allProducts = await response.json();
        displayCatalog(allProducts);
        updateHeader();
    } catch (error) {
        console.error(error);
        catalogContainer.innerHTML = '<p>Impossible de charger le catalogue pour le moment.</p>';
    }
}

if (rarityFilter) {
    rarityFilter.addEventListener('change', (e) => {
        const selectedRarity = e.target.value;
        if (selectedRarity === 'all') {
            displayCatalog(allProducts);
        } else {
            const filtered = allProducts.filter(p => p.rarity === selectedRarity);
            displayCatalog(filtered);
        }
    });
}

function displayCatalog(products) {
    catalogContainer.innerHTML = '';

    if (products.length === 0) {
        catalogContainer.innerHTML = '<p>Aucune carte ne correspond à cette rareté.</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        const img = document.createElement('img');
        const defaultImage = `${API_URL}/images/${product.images[0]}`;
        const hoverImage = product.images[1] ? `${API_URL}/images/${product.images[1]}` : defaultImage;

        img.src = defaultImage;
        img.alt = product.name;

        img.addEventListener('mouseenter', () => {
            img.src = hoverImage;
        });

        img.addEventListener('mouseleave', () => {
            img.src = defaultImage;
        });

        const title = document.createElement('h2');
        title.textContent = product.name;

        const price = document.createElement('p');
        price.classList.add('price');
        price.textContent = `${product.price} ${product.currency}`;

        const detailsLink = document.createElement('a');
        detailsLink.href = `product.html?id=${product.id}`;
        detailsLink.textContent = 'Voir la carte';
        detailsLink.classList.add('btn');

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(detailsLink);

        catalogContainer.appendChild(card);
    });
}

fetchProducts();