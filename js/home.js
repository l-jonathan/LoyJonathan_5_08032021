let img = document.querySelectorAll('.img');
let name = document.querySelectorAll('.name');
let price = document.querySelectorAll('.price');
let description = document.querySelectorAll('.description');
let link = document.querySelectorAll('.link');

////Récuérer les données de l'API
async function getData() {
    try {
        let response = await fetch('http://localhost:3000/api/teddies');
        let data = await response.json();
        displayData(data);
    } catch (error) {
        console.log(error);
    }
}
getData();

////Afficher les données des peluches
function displayData(data) {
    for(let i = 0; i < data.length; i++) {
        img[i].src= data[i].imageUrl;
        name[i].innerHTML = data[i].name;
        price[i].innerHTML = `${data[i].price / 100}€`;
        description[i].innerHTML = data[i].description;
        link[i].href= `./pages/article.html?id=${data[i]._id}`;    
    }
}

////Afficher le nombre d'objets du panier
if(JSON.parse(localStorage.getItem('counter')) !== null) {
    document.querySelector('.count').innerHTML = JSON.parse(localStorage.getItem('counter'));
}