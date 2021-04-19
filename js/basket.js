////Variables de récupération des données dans le localStorage-------------------
let getItemInCart = JSON.parse(localStorage.getItem('ItemInCart'));
let getPrices = JSON.parse(localStorage.getItem('itemPrice'));
let totalPrice = JSON.parse(localStorage.getItem('totalPrice'));

////Affichage panier
let tbody = document.querySelector('.tbody');
let trow = document.createElement("tr");

////Affichage texte panier vide
let panierVide = document.querySelector('.empty_basket');
if(getItemInCart.length > 0) {
    panierVide.style.display = "none";
} else if (getItemInCart.length === 0) {
    panierVide.style.display = "block";
}

////Affichage du tableau comprenant les produits
getItemInCart.forEach(item => {
    let trow = document.createElement("tr");
    tbody.appendChild(trow);
    trow.classList.add("trow");
    trow.innerHTML = `
        <td>
            <div class="img_conteneur mx-auto">
                <img src="${item.imageUrl}" alt="Ours en peluche" class="img_basket">
            </div>
        </td>
        <td>${item.name} - ${item.colorSelected}</td>
        <td><span class="fas fa-minus less"></span><span class="qty mx-2 px-2 border">${item.quantity}</span><span class="fas fa-plus plus"></span></td>
        <td><span class="price totprice">${item.price/100}</span>€</td>
        <td class="delete">Supprimer</td>
    `
});

//-----------------------------------------Manipulation prix------------------------------------
let addItem = document.querySelectorAll(".plus");
let decreaseItem = document.querySelectorAll(".less");
let price = document.querySelectorAll(".price");
let prixTotal;
totalPrice = [];
let sumTotal;
(function manipulatePrice() {
    for(let i = 0; i < price.length; i++) {
        const prixItemOrigin = parseInt(getPrices[i]);
        let prixItem = parseInt(price[i].textContent);
        let prixTotItem;
        prixTotal = getItemInCart[i].quantity * prixItemOrigin;
        totalPrice.splice([i], 1, prixItem);
        localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
        //Actualise à la hausse le prix total par produit
        addItem[i].addEventListener("click", () => {
            prixTotItem = prixItemOrigin + parseInt(price[i].textContent);
            price[i].innerHTML = prixTotItem;
            getItemInCart[i].price = prixTotItem * 100;  
            totalPrice.splice([i], 1, prixTotItem);
            localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
        });
        //Actualise à la baisse le prix total par produit
        decreaseItem[i].addEventListener("click", () => {
            prixTotItem = parseInt(price[i].textContent) - prixItemOrigin;
            price[i].innerHTML = prixTotItem;
            getItemInCart[i].price = prixTotItem * 100;
            totalPrice.splice([i], 1, prixTotItem);
            localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
        })
    }
})();

//-------------------------------------------Manipulation quantité---------------------------------------
let quantite = document.querySelectorAll(".qty");
(function manipulateQty() {
    for(let i = 0; i < quantite.length; i++) {
        let quantiteTot = (parseInt(quantite[i].textContent));
        addItem[i].addEventListener("click", () => {
            quantiteTot = quantiteTot + 1;
            quantite[i].innerHTML = quantiteTot;
            getItemInCart[i].quantity = quantiteTot; 
            localStorage.setItem('ItemInCart', JSON.stringify(getItemInCart));
        })
        decreaseItem[i].addEventListener("click", () => {
            quantiteTot = quantiteTot - 1;
            quantite[i].innerHTML = quantiteTot;
            getItemInCart[i].quantity = quantiteTot; 
            localStorage.setItem('ItemInCart', JSON.stringify(getItemInCart));
        })
    }
})();

//----------------------------------Fonction de calcul des differentes sommes---------------------------------
(function sum() {
    for(let j = 0; j < price.length; j++) {
        sumTotal = totalPrice.reduce((a, b)=> a + b,0);
        localStorage.setItem('TotalPrice', JSON.stringify(sumTotal));
        let somme = document.querySelector(".totalPrice");
        somme.innerHTML = `Prix total: ${sumTotal}€`;
        addItem[j].addEventListener("click", () => {
            sumTotal = totalPrice.reduce((a, b)=> a + b,0);
            localStorage.setItem('TotalPrice', JSON.stringify(sumTotal));
            somme.innerHTML = `Prix total: ${sumTotal}€`;
        })
        decreaseItem[j].addEventListener('click', () => {
            sumTotal = totalPrice.reduce((a, b)=> a + b,0);
            localStorage.setItem('TotalPrice', JSON.stringify(sumTotal));
            somme.innerHTML = `Prix total: ${sumTotal}€`;
        })  
    }
})();

////Fonction de suppression d'un article
(function deleteItem() {
    let effacer = document.querySelectorAll(".delete");
    //Suppression lorsque article egale 0
    for(let i = 0; i < quantite.length; i++) {
        decreaseItem[i].addEventListener('click', () => {
            if (getItemInCart[i].quantity === 0) {
                let elementSuppr = getItemInCart.splice([i], 1);
                let priceSuppr = getPrices.splice([i], 1);
                localStorage.setItem('ItemInCart', JSON.stringify(getItemInCart));
                localStorage.setItem('itemPrice', JSON.stringify(getPrices));
                location.reload();
            }
        })   
    }
    //Suppression au clic sur le mot supprimer
    for(let j = 0; j < effacer.length; j++) {
        effacer[j].addEventListener("click", () => {
                console.log(getItemInCart[j]);
                let elementSuppr = getItemInCart.splice([j], 1);
                let priceSuppr = getPrices.splice([j], 1);
                deleteItemQty(elementSuppr[0].quantity);
                localStorage.setItem('ItemInCart', JSON.stringify(getItemInCart));
                localStorage.setItem('itemPrice', JSON.stringify(getPrices));
                location.reload();
        })
    }
})();

////Fonction qui compte le nombre d'items dans le panier
let counter = document.querySelector('.count');
(function countQty(itemInCart) {
    let getCounter = JSON.parse(localStorage.getItem('counter'));
    let quantite = getCounter;
    counter.innerHTML = quantite;
    for(let i = 0; i < itemInCart.length; i++) {
        addItem[i].addEventListener("click", () => {
            quantite++;
            counter.innerHTML = quantite;
            localStorage.setItem('counter', JSON.stringify(quantite)); 
        })
        decreaseItem[i].addEventListener("click", () => {
            quantite--;
            counter.innerHTML = quantite;
            localStorage.setItem('counter', JSON.stringify(quantite));
        })
    }
})(getItemInCart);


//-----------------------------Fonction qui soustrait au compteur la quantité du produit supprimé--------
/*function deleteItemQty(elementSuppr) {
    let getCounter = JSON.parse(localStorage.getItem('counter'));
    let quantite = getCounter;
    quantite = quantite - elementSuppr;
    counter.innerHTML = quantite;
    localStorage.setItem('counter', JSON.stringify(quantite));
};*/


//-------------------------------------Creation tableau produits  et objet contact à envoyer-----------------------------------------
/*let products = [];
for(let i = 0; i < quantite.length; i++) {
    products.push(getItemInCart[i].productId);
}
class Contact {
    constructor(lastName, firstName, address, city, email) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.address = address;
        this.city = city;
        this.email = email;
    }
}

let submitBtn = document.querySelector("#btn");
let myForm = document.querySelector("#form");
let lastName = document.querySelector("#lastname");
let firstName = document.querySelector("#firstname");
let emailAddress = document.querySelector("#email");
let address = document.querySelector("#address");
let city = document.querySelector("#city");
let errorMessage = document.querySelector(".error");
//----------------------------------------Soumission du formulaire----------------------------------
myForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (checkForm() == true) {
        let contact = new Contact(this.lastname.value,this.firstname.value,this.address.value,this.city.value,this.email.value);
        let order = {
                products,
                contact
                };
        sendForm(order);
    } else {
        e.preventDefault();
    }
})*/

//-----------------------------------------Validation formulaire--------------------------------------
/*function checkForm() {
    let regexName = /^[A-Za-z\'\s\.\-\,]+$/;
    let regexEmail = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/; 
    let regexAddress = /^[A-Za-z\0-9\'\s\.\-\,]+$/;
    let alerte = "";
    if(regexName.test(lastName.value) === false) {
        alerte = "verifier nom";
        errorMessage.innerHTML = 'Nom incorrect';
        
    } else if (regexName.test(firstName.value) === false) {
        alerte = "verifier prenom";
        errorMessage.innerHTML = 'Prénom incorrect';
    }
    if(regexEmail.test(emailAddress.value) === false) {
        alerte = "verifier adresse";
        errorMessage.innerHTML = 'Email incorrect';  
    }
    if(regexAddress.test(address.value) === false || regexName.test(city.value) === false) {
        alerte = "verifier ville"; 
        errorMessage.innerHTML = "L'adresse ou la ville est incorrecte"; 
    }
    if (alerte === "") {
        console.log("all good");
        return true;
    }
}*/

//----------------------------------------------Envoi données au serveur-------------------------------------
/*async function sendForm(order) {
    try {
        //let response = await fetch("http://localhost:3000/api/teddies/order", {
        let response = await fetch("https://oc-orinoco-p5.herokuapp.com/api/teddies/order", {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(order),
        });
        if (response.ok) {
            let resp = await response.json();
            confirmationId(resp);
            window.location = "confirmation.html";
        } else {
            console.error('Retour du serveur : ', response.status);
        }
    } catch (e) {
        console.log(e);
    }
}*/

//------------------------------localStorage des infos de la confirmation de commande du backend----------
/*function confirmationId(resp) {
    let orderId = resp.orderId;
    localStorage.setItem("orderConfirmationId", orderId);
    localStorage.setItem("orderConfirmation", JSON.stringify(resp));
}*/