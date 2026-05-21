# Projet-Boutique
# Vito TCG - Cité des Données

C'est un jeu de cartes à collectionner thématique sur Vito, le site propose une boutique immersive permettant de filtrer, trier et découvrir l'ensemble des cartes du serveur central.

## Fonctionnalités du Site
- **Catalogue Dynamique :** Affichage de l'intégralité du deck 
- **Système de Filtres Avancés :** Filtrage par rareté (Basique, Peu Commun, Rare, Épique, Légendaire).

## Structure des Données 
Le catalogue repose sur une architecture de données structurée en JSON. Chaque entité de carte respecte les contraintes de l'exercice :
- **Identifiant unique** pour la gestion du catalogue et du panier.
- **Chemin d'image exact** mappé sur les assets du projet.
- **Variantes et attributs** pour alimenter les filtres de recherche.
- **Descriptions narratives sur mesure** (entre 200 et 500 caractères par carte) afin de développer l'univers et l'humour de notre projet.

## Lancement 
npm run dev ou node server.js
Ouvrez ensuite votre navigateur 