const API_URL = 'http://localhost:3000';
const productContainer = document.getElementById('product-container');
const cartBtn = document.getElementById('cart-btn');
const favBtn = document.getElementById('fav-btn');

// Récupération de l'ID dans l'URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

let currentImageIndex = 0;
let productData = null;

// Chargement initial du cache du navigateur (Cahier des charges : "Retenir les données en cache")
let cart = JSON.parse(localStorage.getItem('YShop_Cart')) || [];
let favorites = JSON.parse(localStorage.getItem('YShop_Favorites')) || [];

// Met à jour les compteurs du header imméditament
function updateHeader() {
    if (cartBtn) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBtn.textContent = `Panier (${totalItems})`;
    }
    if (favBtn) {
        favBtn.textContent = `Mes Favoris (${favorites.length})`;
    }
}

async function fetchProductDetails() {
    if (!productId) {
        productContainer.innerHTML = '<div class="error-msg">Erreur : Aucune carte spécifiée dans l\'URL.</div>';
        updateHeader();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/products/${productId}`);
        if (!response.ok) throw new Error('Produit introuvable sur le serveur');

        productData = await response.json();
        displayProduct(productData);
    } catch (error) {
        console.error('Erreur API:', error);
        productContainer.innerHTML = `
            <div class="error-box">
                <p>Impossible de joindre le serveur de Vito (Backend).</p>
                <p class="help">Vérifie que tu as tapé 'npm start' dans le dossier backend.</p>
            </div>
        `;
        updateHeader();
    }
}

function displayProduct(product) {
    productContainer.innerHTML = ''; // On enlève le loader

    // --- SECTION CARROUSEL ---
    const carouselDiv = document.createElement('div');
    carouselDiv.classList.add('carousel');

    const imgElement = document.createElement('img');
    // Sécurité si pas d'image
    if (!product.images || product.images.length === 0) {
        imgElement.src = 'https://via.placeholder.com/300x400?text=Pas+dImage';
    } else {
        imgElement.src = `${API_URL}/images/${product.images[0]}`;
    }
    imgElement.id = 'carousel-img';
    imgElement.alt = `Carte ${product.name}`;
    carouselDiv.appendChild(imgElement);

    // NOUVEAU : Condition robuste pour n'afficher les contrôles que si > 1 image
    // Si tu testes "Vito Lunettes de Soleil", cette partie sera ignorée car ton JSON n'a qu'1 image.
    if (product.images && product.images.length > 1) {
        const carouselControls = document.createElement('div');
        carouselControls.classList.add('carousel-controls');

        const prevBtn = document.createElement('button');
        prevBtn.textContent = '◀ Précédent';
        prevBtn.classList.add('carousel-btn');
        prevBtn.onclick = () => changeImage(-1);

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Suivant ▶';
        nextBtn.classList.add('carousel-btn');
        nextBtn.onclick = () => changeImage(1);

        carouselControls.append(prevBtn, nextBtn);
        carouselDiv.appendChild(carouselControls);
    }

    // --- SECTION INFOS ---
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('product-info');

    // Header de l'info (Titre + Favoris)
    const titleHeader = document.createElement('div');
    titleHeader.classList.add('product-title-header');

    const title = document.createElement('h2');
    title.textContent = `${product.name} (${product.rarity})`;

    // Le bouton Favoris dynamique
    const favActionBtn = document.createElement('button');
    favActionBtn.textContent = favorites.includes(product.id) ? 'Favori' : ' Ajouter aux favori';
    favActionBtn.classList.add('btn', 'btn-fav-action');
    favActionBtn.onclick = () => toggleFavorite(product.id, favActionBtn);

    titleHeader.append(title, favActionBtn);

    const price = document.createElement('p');
    price.classList.add('price', 'large-price');
    price.textContent = `${product.price} ${product.currency}`;

    // Description tronquée (Cahier des charges)
    const descDiv = document.createElement('div');
    descDiv.classList.add('description-box');

    const isLong = product.description.length > 150;
    const shortDesc = isLong ? product.description.substring(0, 150) + '...' : product.description;

    const descText = document.createElement('p');
    descText.textContent = shortDesc;
    descDiv.appendChild(descText);

    if (isLong) {
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Voir plus';
        toggleBtn.classList.add('btn-toggle');
        let isExpanded = false;

        toggleBtn.onclick = () => {
            isExpanded = !isExpanded;
            descText.textContent = isExpanded ? product.description : shortDesc;
            toggleBtn.textContent = isExpanded ? 'Voir moins' : 'Voir plus';
        };
        descDiv.appendChild(toggleBtn);
    }

    // --- SECTION ACHAT ---
    const actionDiv = document.createElement('div');
    actionDiv.classList.add('action-box');

    const stockInfo = document.createElement('p');
    stockInfo.classList.add('stock-info');
    stockInfo.textContent = `Stock disponible : ${product.stock}`;

    const buyBtn = document.createElement('button');
    buyBtn.classList.add('btn', 'btn-buy');
    buyBtn.textContent = 'Ajouter au panier';

    // Règle métier (Cahier des charges)
    if (product.stock === 0) {
        buyBtn.disabled = true;
        buyBtn.textContent = 'Rupture de stock';
        buyBtn.classList.add('btn-disabled');
        stockInfo.classList.add('out-of-stock');
    } else {
        buyBtn.onclick = () => addToCart(product.id, product.stock);
    }

    actionDiv.append(stockInfo, buyBtn);

    // Assemblage final
    infoDiv.append(titleHeader, price, descDiv, actionDiv);
    productContainer.append(carouselDiv, infoDiv);

    updateHeader();
    if (cartBtn) cartBtn.onclick = () => window.location.href = 'cart.html';
    if (favBtn) favBtn.onclick = () => window.location.href = 'favorites.html';
}

function changeImage(direction) {
    if (!productData || !productData.images || productData.images.length <= 1) return;

    currentImageIndex += direction;

    if (currentImageIndex >= productData.images.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = productData.images.length - 1;
    }

    document.getElementById('carousel-img').src = `${API_URL}/images/${productData.images[currentImageIndex]}`;
}

function toggleFavorite(id, btnElement) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        btnElement.textContent = '☆ Ajouter aux favoris';
    } else {
        favorites.push(id);
        btnElement.textContent = '★ Favori';
    }
    localStorage.setItem('YShop_Favorites', JSON.stringify(favorites));
    updateHeader();
}

function addToCart(id, maxStock) {
    const itemIndex = cart.findIndex(c => c.id === id);

    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity < maxStock) {
            cart[itemIndex].quantity += 1;
            alert('Quantitée augmentée dans le panier (dans le cache) !');
        } else {
            alert('Stock maximum attein pour ce produit (basé sur la donnée cache).');
            return;
        }
    } else {
        cart.push({ id: id, quantity: 1 });
        alert('Carte ajoutée au panier (dans le cache) !');
    }

    localStorage.setItem('YShop_Cart', JSON.stringify(cart));
    updateHeader();
}

// Lancement direct
fetchProductDetails();