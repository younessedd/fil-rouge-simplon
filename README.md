Mini E-Commerce (Laravel + React) 

all doc url google drive:
https://drive.google.com/drive/folders/16PB1cieaNC85UrChHOKz4kdHBJKB5nmy?usp=sharing



Contexte du projet 
Mini E-Commerce est une plateforme de vente en ligne développée avec Laravel 
(backend API) et React (frontend). 
L’objectif est d’offrir une expérience fluide et moderne aux utilisateurs pour découvrir des 
produits, les ajouter au panier et passer commande. 
L’administrateur peut gérer les produits, les catégories, les utilisateurs et les commandes 
grâce à une interface sécurisée. 

User Stories 
• En tant qu’utilisateur, je veux parcourir la liste des produits et voir leurs détails.  
• En tant qu’utilisateur, je veux ajouter des produits à mon panier et voir le total mis à 
jour en temps réel.  
• En tant qu’utilisateur, je veux pouvoir finaliser ma commande via un processus de 
checkout simple.  
• En tant qu’utilisateur, je veux m’authentifier (inscription / connexion) pour accéder 
à mon compte et mes commandes.  
• En tant qu’administrateur, je veux gérer les produits, les catégories, les utilisateurs 
et les commandes.  
• En tant qu’utilisateur, je veux être notifié en cas d’erreur (connexion, données 
manquantes, problème serveur). 

Design 
• Interface moderne, claire et responsive.  
• Présentation sous forme de cartes pour les produits et les catégories.  
• Tableau de bord administrateur séparé.  
• Messages clairs en cas d’erreur ou d’absence de données. 


 ️ Structure du projet 
Frontend (React) 
• Page d’accueil : liste des produits.  
• Page produit : détail d’un produit.  
• Page panier : produits ajoutés, total et bouton de commande.  
• Page commande : confirmation et suivi de commande.  
• Page admin : gestion des produits, catégories, utilisateurs et commandes.  
• Authentification : inscription, connexion et profil utilisateur. 
Backend (Laravel) 
• API RESTful avec Sanctum pour la sécurité.  
• Contrôleurs : Auth, Product, Category, Order, User, Cart.  
• Routes protégées et publiques dans routes/api.php.  
• Stockage des images produits dans storage/app/public/products/. 
⚙
 ️ Fonctionnalités 
• API Laravel avec Sanctum pour l’authentification et la sécurité.  
• Backend Laravel : gestion des modèles, contrôleurs, routes RESTful, validation, 
images et rôles (Laratrust).  
• Frontend React : interface dynamique, gestion d’état global (Redux ou Zustand), 
routage avec React Router.  
• Gestion du panier : ajout, suppression, mise à jour et checkout avec 
synchronisation backend.  
• CRUD complet sur les produits, catégories, utilisateurs et commandes.  
• Gestion d’erreurs et de chargement avec affichage d’indicateurs visuels.  
• Optimisation des performances : React.memo, lazy loading, séparation des 
composants.  
• Débogage : React DevTools, Redux DevTools et Laravel Debugbar. 

Technologies utilisées 
Catégorie 
Frontend 
Technologies 
React, Vite, Redux/Zustand, Axios 
Backend 
Laravel 11, Sanctum, Laratrust 
Base de données 
MySQL 
Outils 
Composer, NPM, Git, Postman 
Serveur 
XAMPP / Laravel Artisan 

Diagrammes UML 
• Diagramme de classes : structure des entités (User, Product, Order, etc.)  
• Diagramme de séquence : scénario "Ajouter un produit au panier"  
• Diagramme de cas d’utilisation : interactions utilisateur / administrateur 
(Voir le dossier /docs pour les fichiers .puml ou .png.) 

Installation et exécution 
Backend (Laravel) 
cd backend 
composer install 
cp .env.example .env 
php artisan key:generate 
php artisan migrate --seed 
php artisan serve 
Frontend (React) 
cd frontend 
npm install 
npm run dev 


All endpoint post man  
Admin Endpoints Full Postman Tests 
(English) 
Auth – Admin Login 
POST http://localhost:8000/api/login 
Body (JSON) 
{ 
} 
"email": "admin@example.com", 
"password": "password" 
Responses: 
• 200 OK 
{ 
} 
"token": "eyJ0eXAiOiJKV1QiLCJhbGciOi..." 
• 401 Unauthorized 
{ 
  "message": "Invalid credentials" 
} 
 
• 422 Validation Error 
{ 
  "errors": { 
    "email": ["The email field is required."], 
    "password": ["The password field is required."] 
  } 
} 
 
After successful login, use Bearer Token in Authorization header for all Admin requests. 
 
   Users Management (Admin) 
GET http://localhost:8000/api/users?page=1 
200 OK 
{ 
  "current_page": 1, 
  "data": [ 
    { 
      "id": 1, 
      "name": "Admin User", 
      "email": "admin@example.com", 
      "role": "admin", 
      "phone": "+1-555-0101", 
      "address": "123 Admin Street", 
      "city": "New York", 
      "created_at": "2025-11-14T13:00:00", 
      "updated_at": "2025-11-14T13:00:00" 
    } 
  ], 
"total": 6, 
"per_page": 15 
} 
POST http://localhost:8000/api/users 
Body (JSON) 
{ 
"name": "Test User", 
"email": "test@example.com", 
"password": "123456", 
"role": "user", 
"phone": "+212600000000", 
"address": "Street 1", 
"city": "Casablanca" 
} 
201 Created 
{ 
"id": 7, 
"name": "Test User", 
"email": "test@example.com", 
"role": "user", 
"phone": "+212600000000", 
"address": "Street 1", 
"city": "Casablanca", 
"created_at": "2025-11-14T13:10:00", 
"updated_at": "2025-11-14T13:10:00" 
} 
PUT http://localhost:8000/api/users/{id} 
Body (JSON) 
{ 
"name": "Updated Name", 
"email": "updated@example.com" 
} 
200 OK 
{ 
"id": 7, 
"name": "Updated Name", 
"email": "updated@example.com", 
"role": "user", 
"phone": "+212600000000", 
"address": "Street 1", 
"city": "Casablanca", 
"created_at": "2025-11-14T13:10:00", 
"updated_at": "2025-11-14T13:20:00" 
} 
DELETE http://localhost:8000/api/users/{id} 
Response 200 OK 
{ 
} 
"message": "User deleted successfully" 
Categories Management (Admin) 
GET http://localhost:8000/api/categories?page=1 
200 OK 
{ 
"current_page": 1, 
  "data": [ 
    { 
      "id": 1, 
      "name": "Category 1", 
      "slug": "category-1", 
      "created_at": "2025-11-14T13:05:00", 
      "updated_at": "2025-11-14T13:05:00" 
    } 
  ], 
  "total": 5, 
  "per_page": 15 
} 
 
 
POST http://localhost:8000/api/categories 
Body (JSON) 
{ 
  "name": "New Category", 
  "slug": "new-category" 
} 
 
201 Created 
{ 
  "id": 6, 
  "name": "New Category", 
  "slug": "new-category", 
  "created_at": "2025-11-14T13:15:00", 
  "updated_at": "2025-11-14T13:15:00" 
} 
 
 
PUT http://localhost:8000/api/categories/{id} 
Body (JSON) 
{ 
  "name": "Updated Category" 
} 
 
200 OK 
{ 
  "id": 6, 
  "name": "Updated Category", 
  "slug": "new-category", 
  "created_at": "2025-11-14T13:15:00", 
  "updated_at": "2025-11-14T13:25:00" 
} 
 
 
DELETE http://localhost:8000/api/categories/{id} 
204 No Content 
{} 
 
 
   Products Management (Admin, Image + Pagination) 
GET http://localhost:8000/api/products?page=1 
200 OK 
{ 
  "current_page": 1, 
  "data": [ 
    { 
      "id": 1, 
      "name": "Product 1", 
      "slug": "product-1", 
      "description": "Some description", 
      "price": 10.5, 
      "stock": 5, 
      "category_id": 1, 
      "category": { "id": 1, "name": "Category 1", "slug": "category
1" }, 
      "image": "products/product1.jpg", 
      "image_url": 
"http://localhost:8000/api/images/products/product1.jpg", 
      "created_at": "2025-11-14T13:05:00", 
      "updated_at": "2025-11-14T13:05:00" 
    } 
  ], 
  "total": 25, 
  "per_page": 12 
} 
 
 
POST http://localhost:8000/api/products (with image) 
Body (form-data) 
name: "Product Test" 
price: 12.5 
stock: 10 
category_id: 1 
image: <attach JPG/PNG file> 
 
201 Created 
{ 
  "id": 26, 
  "name": "Product Test", 
  "slug": "product-test-1700000000", 
  "description": null, 
  "price": 12.5, 
  "stock": 10, 
  "category_id": 1, 
  "category": { "id": 1, "name": "Category 1", "slug": "category-1" }, 
  "image": "products/product_test.jpg", 
"image_url": 
"http://localhost:8000/api/images/products/product_test.jpg", 
"created_at": "2025-11-14T13:30:00", 
"updated_at": "2025-11-14T13:30:00" 
} 
PUT http://localhost:8000/api/products/{id} (update image) 
Body (form-data) 
image: <new JPG/PNG file> 
200 OK 
{ 
"id": 26, 
"name": "Product Test", 
"slug": "product-test-1700000000", 
"description": null, 
"price": 12.5, 
"stock": 10, 
"category_id": 1, 
"category": { "id": 1, "name": "Category 1", "slug": "category-1" }, 
"image": "products/product_test_updated.jpg", 
"image_url": 
"http://localhost:8000/api/images/products/product_test_updated.jpg", 
"created_at": "2025-11-14T13:30:00", 
"updated_at": "2025-11-14T13:35:00" 
} 
DELETE http://localhost:8000/api/products/{id} 
204 No Content 
{} 
 
 
   Orders Management (Admin) 
GET http://localhost:8000/api/admin/orders?page=1 
200 OK 
{ 
  "current_page": 1, 
  "data": [ 
    { 
      "id": 1, 
      "user_id": 2, 
      "total": 50.5, 
      "created_at": "2025-11-14T13:40:00", 
      "updated_at": "2025-11-14T13:40:00", 
      "user": { 
        "id": 2, 
        "name": "User 1", 
        "email": "user1@example.com" 
      }, 
      "items": [ 
        { 
          "id": 1, 
          "product_id": 1, 
          "quantity": 2, 
          "price": 10.5, 
          "product": { 
            "id": 1, 
            "name": "Product 1" 
          } 
        } 
      ] 
    } 
  ], 
  "total": 5, 
  "per_page": 12 
} 
 
 
GET http://localhost:8000/api/orders/{id} (view specific order) 
200 OK 
{ 
  "id": 1, 
  "user_id": 2, 
  "total": 50.5, 
  "created_at": "2025-11-14T13:40:00", 
  "updated_at": "2025-11-14T13:40:00", 
  "items": [ 
    { 
      "id": 1, 
      "product_id": 1, 
      "quantity": 2, 
      "price": 10.5, 
      "product": { 
        "id": 1, 
        "name": "Product 1" 
      } 
    } 
  ] 
} 
 
 
DELETE http://localhost:8000/api/orders/{id} 
204 No Content 
{} 
 
 
This includes all Admin endpoints, full URLs, request bodies, responses, pagination, and 
image handling. 
. 
User Endpoints Full Postman Tests 
(English) 
All URLs are based on .env: APP_URL=http://localhost:8000. 
Auth – User Register & Login 
POST http://localhost:8000/api/register 
Body (JSON) 
{ 
"name": "User Test", 
"email": "user@example.com", 
"password": "123456", 
"phone": "+212600000001", 
"address": "Street 2", 
"city": "Casablanca" 
} 
201 Created 
{ 
} 
"id": 8, 
"name": "User Test", 
"email": "user@example.com", 
"role": "user", 
"phone": "+212600000001", 
"address": "Street 2", 
"city": "Casablanca", 
"created_at": "2025-11-14T14:00:00", 
"updated_at": "2025-11-14T14:00:00" 
POST http://localhost:8000/api/login 
Body (JSON) 
{ 
} 
"email": "user@example.com", 
"password": "123456" 
200 OK 
{ 
} 
"token": "eyJ0eXAiOiJKV1QiLCJhbGciOi..." 
Get Logged-in User Info 
GET http://localhost:8000/api/me 
Headers 
Authorization: Bearer <TOKEN> 
 
200 OK 
{ 
  "id": 8, 
  "name": "User Test", 
  "email": "user@example.com", 
  "role": "user", 
  "phone": "+212600000001", 
  "address": "Street 2", 
  "city": "Casablanca", 
  "created_at": "2025-11-14T14:00:00", 
  "updated_at": "2025-11-14T14:00:00" 
} 
 
 
   Products (View only, pagination & image) 
GET http://localhost:8000/api/products?page=1 
200 OK 
{ 
  "current_page": 1, 
  "data": [ 
    { 
      "id": 1, 
      "name": "Product 1", 
      "slug": "product-1", 
      "description": "Some description", 
      "price": 10.5, 
      "stock": 5, 
      "category_id": 1, 
      "category": { "id": 1, "name": "Category 1", "slug": "category
1" }, 
      "image": "products/product1.jpg", 
"image_url": 
"http://localhost:8000/api/images/products/product1.jpg", 
"created_at": "2025-11-14T13:05:00", 
"updated_at": "2025-11-14T13:05:00" 
} 
], 
"total": 25, 
"per_page": 12 
} 
GET http://localhost:8000/api/products/{id} (view single product) 
200 OK 
{ 
"id": 1, 
"name": "Product 1", 
"slug": "product-1", 
"description": "Some description", 
"price": 10.5, 
"stock": 5, 
"category_id": 1, 
"category": { "id": 1, "name": "Category 1", "slug": "category-1" }, 
"image": "products/product1.jpg", 
"image_url": 
"http://localhost:8000/api/images/products/product1.jpg", 
"created_at": "2025-11-14T13:05:00", 
"updated_at": "2025-11-14T13:05:00" 
} 
GET http://localhost:8000/api/products/search?q=product 
Query Parameter: q = search keyword 
200 OK 
{ 
  "current_page": 1, 
  "data": [ 
    { 
      "id": 1, 
      "name": "Product 1", 
      "slug": "product-1", 
      "description": "Some description", 
      "price": 10.5, 
      "stock": 5, 
      "category_id": 1, 
      "category": { "id": 1, "name": "Category 1", "slug": "category
1" }, 
      "image": "products/product1.jpg", 
      "image_url": 
"http://localhost:8000/api/images/products/product1.jpg", 
      "created_at": "2025-11-14T13:05:00", 
      "updated_at": "2025-11-14T13:05:00" 
    } 
  ], 
  "total": 2, 
  "per_page": 12 
} 
 
 
   Cart Endpoints (User) 
GET http://localhost:8000/api/cart 
Headers 
Authorization: Bearer <TOKEN> 
 
200 OK 
[ 
  { 
    "id": 1, 
    "user_id": 8, 
    "product_id": 1, 
    "quantity": 2, 
    "product": { 
      "id": 1, 
      "name": "Product 1", 
      "price": 10.5, 
      "image_url": 
"http://localhost:8000/api/images/products/product1.jpg" 
    } 
  } 
] 
 
 
POST http://localhost:8000/api/cart 
Body (JSON) 
{ 
  "product_id": 2, 
  "quantity": 1 
} 
 
201 Created 
{ 
  "id": 2, 
  "user_id": 8, 
  "product_id": 2, 
  "quantity": 1, 
  "created_at": "2025-11-14T14:10:00", 
  "updated_at": "2025-11-14T14:10:00" 
} 
 
 
DELETE http://localhost:8000/api/cart/{id} 
Response 200 OK 
{ 
} 
"message": "Cart item removed successfully" 
DELETE http://localhost:8000/api/cart (clear all) 
Response 200 OK 
{ 
} 
"message": "Cart cleared successfully" 
POST http://localhost:8000/api/cart/checkout 
Body (JSON) (optional: for additional checkout options) 
{ 
} 
"payment_method": "cash" 
200 OK 
{ 
"order_id": 10, 
"total": 31.5, 
"items": [ 
{ 
"product_id": 1, 
"quantity": 2, 
"price": 10.5 
}, 
{ 
"product_id": 2, 
"quantity": 1, 
"price": 10.5 
} 
], 
"message": "Checkout successful" 
} 
This covers all user endpoints: login, register, profile, products (list, single, search), cart, 
and checkout. 