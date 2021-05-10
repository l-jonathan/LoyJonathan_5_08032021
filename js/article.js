let articleId = new URL(window.location.href).searchParams.get('id');

class ArticlePicked {
    constructor(colorSelected, imageUrl, name, price, articleId, quantity) {
        this.colorSelected = colorSelected;
        this.imageUrl = imageUrl;
        this.name = name;
        this.price = price;
        this.articleId = articleId;
        this.quantity = quantity;
    }
}

//--------------------------fonction async anonyme pour recupérer les données-----------------------
(async function() {
    try {
        let response = await fetch(`http://localhost:3000/api/teddies/${articleId}`);
        let data = await response.json();
        articleInfo(data);
        onClick(data);
        alreadyAdded(data);
    } catch (error) {
        console.log(error);
    }
    
})()

//----------------------------fonction qui permet l'affichage des données----------------------------
function articleInfo(data) {
    let articleImage = document.querySelector('.imgArticle');
    let articleName = document.querySelector('.name');
    let articlePrice = document.querySelector('.price');
    let articleDescription = document.querySelector('.description');
    let articleColor = document.querySelector('#color');
    articleImage.src = data.imageUrl;
    articleName.innerHTML = data.name;
    articlePrice.innerHTML = `${data.price / 100}€`;
    articleDescription.innerHTML = data.description;
    data.colors.forEach(color => {
        let options = document.createElement("option");
        articleColor.appendChild(options);
        options.setAttribute("value", `${color}`);
        options.innerHTML = `${color}`;
    });
}

 //----------------------------fonction qui permet d'ajouter un produit au panier au clic sur le bouton--
 function onClick(data) {
    let itemInCart = JSON.parse(localStorage.getItem('ItemInCart'));
    let addCartButton = document.querySelector(".add_basket");
    let imageUrl = data.imageUrl;
    let name = data.name;
    let price = data.price;
    let btnPanier = document.querySelector('.see_basket');
    addCartButton.addEventListener("click", () => {
        let colorSelected = document.querySelector('#color').value;
        let itemPrice = JSON.parse(localStorage.getItem('itemPrice'));
        if (itemInCart === null) {
            itemInCart = [];
            itemPrice = [];
            btnPanier.style.display = "block";
        } 
        let nouveau = new ArticlePicked(colorSelected, imageUrl, name, price, articleId, 1);
        itemInCart.push(nouveau);
        localStorage.setItem('ItemInCart', JSON.stringify(itemInCart));
        let getPrice = data.price / 100;
        itemPrice.push(getPrice);
        localStorage.setItem('itemPrice', JSON.stringify(itemPrice));
        addCartButton.disabled = true;
        if (itemInCart !== null) {
            checkColor(itemInCart, name);
            colorChange(itemInCart, name);
            countQty(itemInCart);
        } 
    })
}

//---------------------fonction qui verifie si le produit existe deja et agit sur le bouton----------
function checkColor(itemInCart, theName) {
    let btnPanier = document.querySelector('.see_basket');
    let addCartButton = document.querySelector(".add_basket");
    btnPanier.style.display = "block";
    let choixCouleur = document.querySelector('#color');
    let productExist = (itemInCart.find(nom => nom.name === theName && nom.colorSelected === choixCouleur.value));
    console.log("produit: "+productExist);
    if (productExist) {
        addCartButton.disabled = true;
    } else {
        addCartButton.disabled = false;
    }
}

//----------------------fonction qui ecoute le changement de couleur et agit sur le bouton---------
function colorChange(itemInCart, theName) {
    let choixCouleur = document.querySelector('#color');
    let addCartButton = document.querySelector(".add_basket");
    choixCouleur.addEventListener('change', (e) => {
        if ((itemInCart.find(nom => nom.name === theName && nom.colorSelected === e.target.value))) {
            addCartButton.disabled = true;
        } else {
            addCartButton.disabled = false; 
        }
    });
}

//-------------fonction pour verifier et agir sur l'etat des boutons de la page hors du clic------------------------
function alreadyAdded (data) {
    let alreadyAdded = JSON.parse(localStorage.getItem('ItemInCart'));
    let btnPanier = document.querySelector('.add_basket');
    if (alreadyAdded.length > 0) {
        checkColor(alreadyAdded, data.name);
        colorChange(alreadyAdded, data.name);
        countQty(alreadyAdded);
    }
}

//----------------------------fonction qui compte et affiche la quantité de produit sélectionné----------
function countQty(itemInCart) {
    let quantite = 0;
    for(let i = 0; i < itemInCart.length; i++) {
        quantite += itemInCart[i].quantity;
    }
    const counter = document.querySelector('.count');
    counter.innerHTML = quantite;
    localStorage.setItem('counter', JSON.stringify(quantite));
}