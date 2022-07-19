fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(data => renderPups(data));

function renderPups(data){
    document.getElementById("dog-bar").innerHTML = '';
    for (pup of data) {
        renderPup(pup);
    }
}

function renderFilteredPups(){
    document.getElementById("dog-bar").innerHTML = '';
    fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(data => {
            const dataFilter = data.filter(n =>{
                return n.isGoodDog == true;
            })
            renderPups(dataFilter);
        });
}

function renderPup(pup) {
    span = document.createElement('span');
    span.innerHTML = pup.name;
    span.setAttribute("data-id", pup.id);
    document.getElementById("dog-bar").appendChild(span);
}

function renderExtra(pup) {
    const dogInfo = document.getElementById('dog-info');
    dogInfo.innerHTML = `
    <img src=${pup.image}>
    <h2>${pup.name}</h2>
    <button name='good'>${ (pup.isGoodDog ? 'Good' : 'Bad') } Dog!</button>
    <button name='delete'>Delete Dog</button>`
    dogInfo.setAttribute("data-id", pup.id);
}

const dogBar = document.querySelector("#dog-bar");
dogBar.addEventListener('click', event =>{
    if (event.target != dogBar){
    doggoId = event.target.dataset["id"];
    fetch(`http://localhost:3000/pups/${doggoId}`)
    .then(response => response.json())
    .then(data => renderExtra(data));
    }
});

document.getElementById('dog-info').addEventListener('click', event => {
    switch(true){
        case(event.target == document.getElementById('dog-info')): break;
        case(event.target.name == 'good') :
            doggoId = event.target.parentElement.dataset["id"];
            fetch(`http://localhost:3000/pups/${doggoId}`)
            .then(response => response.json())
            .then(data => flipDog(data));
            break;
        
        case(event.target.name == 'delete') :
            doggoId = event.target.parentElement.dataset["id"];
            fetch(`http://localhost:3000/pups/${doggoId}`, {method: "DELETE"})
                .then(data => {
                    document.getElementById('dog-info').innerHTML = '';
                    const deleteDog = Array.from(document.querySelectorAll('#dog-bar span'));
                    deleteDog.find(function(d) {return d.dataset["id"] == doggoId}).remove();
                });
            break;
    }
});

function flipDog(pup) {
    const isGoodDog = !pup.isGoodDog;
    renderExtra(pup);

    const configObj = {
        method: 'PATCH',
        headers: {
            "Content-Type": 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({isGoodDog})
    }

    fetch(`http://localhost:3000/pups/${pup.id}`, configObj)
        .then(response => response.json())
        .then(data => {
            renderExtra(data);
            if (filterDogs.innerHTML == 'Filter good dogs: ON') {
                renderFilteredPups();
            }
        });
}

const filterDogs = document.getElementById("good-dog-filter");
filterDogs.addEventListener('click', event =>{
    if (filterDogs.innerHTML == 'Filter good dogs: OFF'){
        renderFilteredPups();
        filterDogs.innerHTML = 'Filter good dogs: ON'
    } else {
        fetch('http://localhost:3000/pups')
            .then(response => response.json())
            .then(data => renderPups(data));
        filterDogs.innerHTML = 'Filter good dogs: OFF'
    }
});