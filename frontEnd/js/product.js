const API_URL = 'http://localhost:3000';
const productContainer = document.getElementById('product-container');

// recup l'id de la carte dans l'url
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

let currentImageIndex = 0;
let productData = null;

async function fetchProductDetails() {
    if (!productId) {
        productContainer.innerHTML = '<p>Erreur : Aucune carte spécifiée.</p>';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/products/${productId}`);
        if (!response.ok) throw new Error('Produit introuvable');

        productData = await response.json();
        displayProduct(productData);
    } catch (error) {
        console.error(error);
        productContainer.innerHTML = '<p>Impossible de charger les détails de cette carte.</p>';
    }
}

function displayProduct(product) {
    productContainer.innerHTML = '';

    // caroussel
    const carouselDiv = document.createElement('div');
    carouselDiv.classList.add('carousel');

    const imgElement = document.createElement('img');
    // CORRECTION ICI : Ajout de "/images/" car le JSON ne le contient plus
    imgElement.src = `${API_URL}/images/${product.images[0]}`;
    imgElement.id = 'carousel-img';

    const carouselControls = document.createElement('div');
    carouselControls.classList.add('carousel-controls');

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '◀ Précédent';
    prevBtn.onclick = () => changeImage(-1);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Suivant ▶';
    nextBtn.onclick = () => changeImage(1);

    carouselControls.append(prevBtn, nextBtn);
    carouselDiv.append(imgElement, carouselControls);

    // infos de la carte
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('product-info');

    const title = document.createElement('h2');
    title.textContent = `${product.name} (${product.rarity})`;

    const price = document.createElement('p');
    price.classList.add('price', 'large-price');
    price.textContent = `${product.price} ${product.currency}`;

    // description
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

    // stock
    const actionDiv = document.createElement('div');
    actionDiv.classList.add('action-box');

    const stockInfo = document.createElement('p');
    stockInfo.textContent = `Stock disponible : ${product.stock}`;

    const buyBtn = document.createElement('button');
    buyBtn.classList.add('btn', 'btn-buy');
    buyBtn.textContent = 'Ajouter au panier';

    if (product.stock === 0) {
        buyBtn.disabled = true;
        buyBtn.textContent = 'Rupture de stock';
        buyBtn.classList.add('btn-disabled');
        stockInfo.style.color = 'red';
    } else {
        buyBtn.onclick = () => buyProduct(product.id);
    }

    actionDiv.append(stockInfo, buyBtn);

    // ajout des elements dans la colonne de droite (sans la div variants)
    infoDiv.append(title, price, descDiv, actionDiv);

    productContainer.append(carouselDiv, infoDiv);
}

// logique du carrousel
function changeImage(direction) {
    if (!productData || !productData.images) return;

    currentImageIndex += direction;

    if (currentImageIndex >= productData.images.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = productData.images.length - 1;
    }

    // changement d'image
    document.getElementById('carousel-img').src = `${API_URL}/images/${productData.images[currentImageIndex]}`;
}

// appel post au backend
async function buyProduct(id) {
    try {
        const response = await fetch(`${API_URL}/api/buy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id, quantity: 1 })
        });

        if (response.ok) {
            alert('Carte ajoutée avec succès !');
            fetchProductDetails();
        } else {
            alert("Erreur lors de l'ajout au panier.");
        }
    } catch (error) {
        console.error('Erreur réseau:', error);
    }
}

// lancement au chargement de la page
fetchProductDetails();