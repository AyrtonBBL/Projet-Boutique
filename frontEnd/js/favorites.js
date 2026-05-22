const API_URL = 'http://localhost:3000';
const favContainer = document.getElementById('favorites-container');
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

async function loadFavorites() {
    if (favorites.length === 0) {
        favContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 1.2rem;">Vous n\'avez aucune carte en favori pour le moment.</p>';
        updateHeader();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) throw new Error('Erreur API');
        const allProducts = await response.json();

        // On ne garde que les produits dont l'ID est dans le tableau "favorites"
        const favProducts = allProducts.filter(p => favorites.includes(p.id));
        displayFavorites(favProducts);
    } catch (error) {
        favContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">Erreur de chargement des favoris. Le backend est-il allumé ?</p>';
    }
}

function displayFavorites(products) {
    favContainer.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        const img = document.createElement('img');
        const defaultImage = `${API_URL}/images/${product.images[0]}`;
        const hoverImage = product.images[1] ? `${API_URL}/images/${product.images[1]}` : defaultImage;

        img.src = defaultImage;
        img.alt = product.name;

        img.addEventListener('mouseenter', () => img.src = hoverImage);
        img.addEventListener('mouseleave', () => img.src = defaultImage);

        const title = document.createElement('h2');
        title.textContent = product.name;

        const price = document.createElement('p');
        price.classList.add('price');
        price.textContent = `${product.price} ${product.currency}`;

        const detailsLink = document.createElement('a');
        detailsLink.href = `product.html?id=${product.id}`;
        detailsLink.textContent = 'Voir la carte';
        detailsLink.classList.add('btn');
        detailsLink.style.marginBottom = '10px';
        detailsLink.style.display = 'block';

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Retirer des favoris';
        removeBtn.classList.add('btn');
        removeBtn.style.backgroundColor = '#e74c3c';

        // Action pour retirer des favoris
        removeBtn.onclick = () => {
            favorites = favorites.filter(favId => favId !== product.id);
            localStorage.setItem('YShop_Favorites', JSON.stringify(favorites));
            loadFavorites(); // On recharge l'affichage instantanément
        };

        card.append(img, title, price, detailsLink, removeBtn);
        favContainer.appendChild(card);
    });

    updateHeader();
}

updateHeader();
loadFavorites();