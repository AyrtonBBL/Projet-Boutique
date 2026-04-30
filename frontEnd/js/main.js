const API_URL = 'http://localhost:3000';
const catalogContainer = document.getElementById('catalog-container');

async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }
        const products = await response.json();
        displayCatalog(products);
    } catch (error) {
        console.error(error);
        catalogContainer.innerHTML = '<p>Impossible de charger le catalogue pour le moment.</p>';
    }
}

function displayCatalog(products) {
    catalogContainer.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        const img = document.createElement('img');
        const defaultImage = `${API_URL}${product.images[0]}`;
        const hoverImage = product.images[1] ? `${API_URL}${product.images[1]}` : defaultImage;

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