let totalPrice = JSON.parse(localStorage.getItem('TotalPrice'));
let orderConfirmation = JSON.parse(localStorage.getItem('orderConfirmation'));
let orderId = localStorage.getItem('orderConfirmationId');

//---------------------------affichage des données de confirmation de commande--------------------------
(function displayOrder() {
    let mainBody = document.querySelector('.mainBody');
    let customerName = document.querySelector('.name');
    customerName.innerHTML = `${orderConfirmation.contact.firstName} ${orderConfirmation.contact.lastName}`;
    mainBody.innerHTML = `
    <p class="text-center fs-3 fw-light">Montant de la commande : ${totalPrice}€</p>
    <p class="text-center fs-3 fw-light">Référence de la commande : ${orderId}</p>
    `;
})();

//----------------------bouton de renvoi à la page d'accueil et suppression du localstorage-------------
document.querySelector('button').addEventListener('click', (e) => {
    localStorage.clear();
    window.location = "../index.html";
})
