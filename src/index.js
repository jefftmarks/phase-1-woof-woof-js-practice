document.addEventListener('DOMContentLoaded', () => {

//Fetch functions

    //GET function
    function fetchResource(url) {
        return fetch(url)
        .then(res => res.json())
    }


//Fetch dog data and for each dog, populate dog menu
    fetchResource('http://localhost:3000/pups')
        .then(dogData => dogData.forEach(renderDogMenu))
        .catch(e => console.error(e))


//Dog info container

    // grab and create dog info container elements
     const dogInfo = document.getElementById('dog-info');
     const dogImage = document.createElement('img');
     const dogName = document.createElement('h2');
 
     //populate elements with empty strings on page load, append to page, set display to none
     dogName.innerText = '';
     const dogButton = document.createElement('button');
     dogButton.textContent = '';
     dogInfo.append(dogImage, dogName, dogButton);
     dogInfo.style.display = 'none';


//Render functions

    //Function to populate dog bar and render dog cards
    function renderDogMenu(dog) {

        //grab and create dog bar elements
        const dogBar = document.getElementById('dog-bar');
        const dogSpan = document.createElement('span');
        dogSpan.className = dog.isGoodDog;
        dogSpan.id = dog.id;
        dogSpan.textContent = dog.name;
        dogBar.appendChild(dogSpan);

        //add event listener to dog bar names
        dogSpan.addEventListener('click', () => {
            //display dog info container (no long display: 'none')
            dogInfo.style.display = 'flex';
            renderDogInfo(dog);
        })
    }
    

    //Function to render dog info
    function renderDogInfo(dog) {

        //insert dog data into dog info container
        dogImage.src = dog.image;
        dogName.textContent = dog.name;
        switchGoodBad(dog); //creates button depending on if dog is good or bad

        //add event listener to button to change dog's good/bad status
        dogButton.addEventListener('click', () => {

            dog.isGoodDog = !dog.isGoodDog; //reverse boolean value of dog
            const dogSpan = document.getElementById(dog.id); //target id of associated dog bar span
            dogSpan.classList.replace(!dog.isGoodDog, dog.isGoodDog); //change span's class to reflect its good/bad status

            //patch requet to update database
            fetch(`http://localhost:3000/pups/${dog.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({isGoodDog: dog.isGoodDog})
            })
            .then(res => res.json())
            .then(switchGoodBad)
            .catch(e => console.error(e))
        })
    }


    //function with conditional to switch good/bad
    function switchGoodBad(dog) {
        if (dog.isGoodDog) {
            dogButton.textContent = 'Good Dog!'
        } else {
            dogButton.textContent = 'Bad Dog!'
        }
    }


//Filter dogs

    //filter event listener
    const dogFilter = document.querySelector('#good-dog-filter');
    dogFilter.addEventListener('click', (event) => {
        //switch button's text content
        if(event.target.textContent === 'Filter good dogs: OFF') {
            event.target.textContent = 'Filter good dogs: ON';
            filterDogs();
        } else {
            event.target.textContent = 'Filter good dogs: OFF';
            unfilterDogs();
        };
    })
    
    //Filter dogs function
    function filterDogs() {
        const nodeList = document.querySelectorAll('.false');
        const badDogsArray = Array.from(nodeList);
        badDogsArray.forEach((dog) => {
            dog.style.display = 'none';
        })
    }

    function unfilterDogs() {
        const nodeList = document.querySelectorAll('.false');
        const badDogsArray = Array.from(nodeList);
        badDogsArray.forEach((dog) => {
            dog.style.display = 'flex';
        })
    }


})