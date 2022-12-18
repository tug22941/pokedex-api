async function PokeFetch(){
    const pokePromise = await fetch('https://pokeapi.co/api/v2/pokemon/');
    if(!pokePromise.ok){throw new Error(`HTTP error: ${pokePromise.status}`)}
    else{
        const data = await pokePromise.json();
        console.log(data)
        return data;
    }
}

async function MonFetch(pokeEP){
    const pokePromise  = await fetch(pokeEP);
    if(!pokePromise.ok){throw new Error(`HTTP error: ${pokePromise.status}`)}
    else{
        const data = await pokePromise.json();
        console.log(data)
        return data
    }
}

const dataPromise = PokeFetch();

const ddlPokemon = document.querySelector('#ddlPokemons')
dataPromise.then((data) =>{
   data.results.forEach((info) =>{
    const html = `<option value="${info.url}">${info.name}</option>`
    ddlPokemon.insertAdjacentHTML("beforeend",html);
   })
})

const pokeImg = document.querySelector('#pokeImg')
const ability = document.querySelector('#ability')
const form = document.querySelector('#form')
ddlPokemon.addEventListener('click',()=>{
    value = ddlPokemon.options[ddlPokemon.selectedIndex].value
    let pokeEP = value;

    const pokeData = MonFetch(pokeEP);
    pokeData.then((p) =>{
        pokeImg.src = p.sprites.front_default;
        ability.innerText = p.abilities[0].ability.name
        form.innerText =  p.forms[0].name
    })
})


