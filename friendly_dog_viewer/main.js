const API_URL = 'https://dog.ceo/api/breeds/image/random/3';
const randomDogsElement = document.querySelector('.random-dogs');
const loadButton = document.querySelector('.load-button');
const dingoButton = document.querySelector('.dingo-button');
const vizslaButton = document.querySelector('.vizsla-button');
const labradorButton = document.querySelector('.labrador-button');
const beagleButton = document.querySelector('.beagle-button');
const boxerButton = document.querySelector('.boxer-button');


function switchBreed(input) {
  let breed = input;
  let API_URL_BY_BREED = `https://dog.ceo/api/breed/${breed}/images/random/3`
  getDogByBreed(API_URL_BY_BREED)
}

async function getDogByBreed(API_URL_BY_BREED) {
  randomDogsElement.innerHTML = '';
  const response = await fetch(API_URL_BY_BREED);
  const json = await response.json();
  json.message.forEach(dogImage => {
    let dogBreed = dogImage.split('/')[4]
    dogBreed = dogBreed[0].toUpperCase() + dogBreed.slice(1)

    randomDogsElement.innerHTML += `
    <div class="row">
      <div class="col-sm-6">
        <div class="dog-container">
          <img src="${dogImage}" alt="Picture of a dog">
        </div>
      </div>    
      <div class="col-sm-6">
        <div class="dog-container">
          <div class="dog-name">
          <p> Hello! I am a ${dogBreed}</p>
          </div>
        </div>
      </div>
    </div>
    `;
  });
}

async function getRandomDogs() {
  randomDogsElement.innerHTML = '';
  const response = await fetch(API_URL);
  const json = await response.json();
  json.message.forEach(dogImage => {
    let dogBreed = dogImage.split('/')[4] 
    dogBreed = dogBreed[0].toUpperCase() + dogBreed.slice(1)
    for (let i of dogBreed) {
      if (i == "-") {
        let array = dogBreed.split('-')   
        dogBreed =  array[1][0].toUpperCase() + array[1].slice(1) + ' ' + array[0][0].toUpperCase() + array[0].slice(1) 
      }
    }

    randomDogsElement.innerHTML += `
    <div class="row">
      <div class="col-sm-6">
        <div class="dog-container">
          <img src="${dogImage}" alt="Picture of a dog">
        </div>
      </div>    
      <div class="col-sm-6">
        <div class="dog-container">
          <div class="dog-name">
            <p> Hello! I am a ${dogBreed}</p>
          </div>
        </div>
      </div>
    </div>
    `;
  });
}


loadButton.addEventListener('click', getRandomDogs);

dingoButton.addEventListener('click', function() {
  let dog = 'dingo'
  switchBreed(dog)
});

vizslaButton.addEventListener('click', function() {
  let dog = 'vizsla'
  switchBreed(dog)
});

labradorButton.addEventListener('click', function() {
  let dog = 'labrador'
  switchBreed(dog)
});

beagleButton.addEventListener('click', function() {
  let dog = 'beagle'
  switchBreed(dog)
});

boxerButton.addEventListener('click', function() {
  let dog = 'boxer'
  switchBreed(dog)
});

window.addEventListener('load', getRandomDogs);

// Navbar
function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}