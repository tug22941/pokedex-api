//Controller for making API calls
const APIController = (() =>{

    //private function that returns a complete list of all pokemons as a JSON
    async function catchEmAllFetch(){
        const pokePromise = await fetch('https://pokeapi.co/api/v2/pokemon/');
        if(!pokePromise.ok){throw new Error(`HTTP error: ${pokePromise.status}`)}
        else{
            const data = await pokePromise.json();
            return data;
        }
    }

    //private function that returns an attribute list of a single pokemon as a JSON
    async function pokeFetch(endPoint){
        const pokePromise = await fetch(endPoint);
        if(!pokePromise.ok){throw new Error(`HTTP error: ${pokePromise.status}`)}
        else{
            const data = await pokePromise.json();
            console.log(data);
            return data;
        }
    }

    //exposing private methods in a public wrapper
    return {
        getAllPokemons(){
            return catchEmAllFetch();
        },
        pokeFetch(id){
            return pokeFetch(id);
        }
    }
})();


//Controller for updating the user interface
const UIController = (function(){

    //objec that hold refrence to html selectors (private attributes)
    const DOMElements = {
        selectPokemon: '#ddlPokemons',
        imgPokemon: '#imgPokePic',
        divPokeTypes: '#types-box',
        divDescription: '#description-box',
        lblPokeName: '#poke-name',
        lblPokeNumber: '#poke-number',
        lblPokeWeight: '#poke-weight',
        lblPokeHeight: '#poke-height',
        divPokeStats: '#poke-stats',
        lblPokeHP: '#live-hp',
        divPokeHPBar: '#health'
    }

    return{
        //public acessor of HTML elements
        inputFields(){
            return{
                pokeList: document.querySelector(DOMElements.selectPokemon),
                pokeImage: document.querySelector(DOMElements.imgPokemon),
                pokeTypes: document.querySelector(DOMElements.divPokeTypes),
                pokeDescription: document.querySelector(DOMElements.divDescription),
                pokeName: document.querySelector(DOMElements.lblPokeName),
                pokeNumber: document.querySelector(DOMElements.lblPokeNumber),
                pokeWeight: document.querySelector(DOMElements.lblPokeWeightr),
                pokeHeight: document.querySelector(DOMElements.lblPokeHeight),
                pokeStats: document.querySelector(DOMElements.divPokeStats),
                pokeHPText: document.querySelector(DOMElements.lblPokeHP),
                pokeHPBar: document.querySelector(DOMElements.lblPokeHPBar)
            }
        },
        addToPokeList(pokemon){
            const name = ((string) => {
                return string.charAt(0).toUpperCase() + string.slice(1);
            })(pokemon.name)

            const html = `<option value="${pokemon.url}">${name}</option>`
            document.querySelector(DOMElements.selectPokemon).insertAdjacentHTML('beforeend',html);
        },
        addToPokeTypes(pokeType){
            const html = `<a> ${pokeType} </a>`;
            document.querySelector(DOMElements.divPokeTypes).insertAdjacentHTML('beforeend',html)
        },
        loadPokePicture(pokemon){
            document.querySelector(DOMElements.imgPokemon).src = pokemon.sprites.front_default;
        },
        loadPokeID(pokemon){
            document.querySelector(DOMElements.lblPokeName).textContent = pokemon.name;
            document.querySelector(DOMElements.lblPokeNumber).textContent = `No. ${pokemon.id}`
        },
        addPokeDescription(info){
            const html = `<a> ${info} </a>`;
            document.querySelector(DOMElements.divDescription).innerHTML = html;
        },
        clearPokeTypes(){
            document.querySelector(DOMElements.divPokeTypes).innerHTML = "";
        },
        loadPokeSize(pokemon){
            const weight = ((hec) =>{
                return (hec * 0.220462).toFixed(2);
            })(pokemon.weight);
            const height = ((deci) =>{
                return (deci * 3.93701).toFixed(2);
            })(pokemon.height);
            document.querySelector(DOMElements.lblPokeWeight).textContent = weight + " (lb) ";
            document.querySelector(DOMElements.lblPokeHeight).textContent = height + " (in) ";
        },
        loadPokeHP(pokemon){
            const randHP = Math.floor(Math.random() * 100) + 1;
            document.querySelector(DOMElements.lblPokeHP).textContent = "HP " + randHP;
            document.querySelector(DOMElements.divPokeHPBar).style.width = randHP+"%";

        },
        clearPokeStats(){
            document.querySelector(DOMElements.divPokeStats).innerHTML = "";
        },
        loadPokeStats(pokemon){
            pokemon.stats.forEach((statObj) =>{
                const name = statObj.stat.name.toUpperCase();
                const value = statObj.base_stat;
                const html =    `<div>
                                    <p>${name}</p>
                                    <p>${value}</p>
                                </div>`;
                document.querySelector(DOMElements.divPokeStats).insertAdjacentHTML('beforeend',html)
            })
        }
    }


})()

//Controller for handling application events
const APPController = (function(APICtrl,UICtrl){

    function createPokeList (){
        const pokePromise = APICtrl.getAllPokemons();
        pokePromise.then((pokemons) => {
            pokemons.results.forEach(pokemon => UICtrl.addToPokeList(pokemon));
        })

        const DOMInputs = UICtrl.inputFields();

        DOMInputs.pokeList.addEventListener('change', () =>{
            pokeEP = DOMInputs.pokeList.options[DOMInputs.pokeList.selectedIndex].value
            const pokePromise = APICtrl.pokeFetch(pokeEP);
            pokePromise.then((pokemon) =>{
                UICtrl.clearPokeTypes();
                pokemon.types.forEach(typeObj => UICtrl.addToPokeTypes(typeObj.type.name));
                UICtrl.loadPokePicture(pokemon);
                UICtrl.loadPokeID(pokemon);

                const speciesEP = pokemon.species.url;
                const speciesPromise = APICtrl.pokeFetch(speciesEP);
                speciesPromise.then((species) => {
                    const info = species.flavor_text_entries[0].flavor_text;
                    UICtrl.addPokeDescription(info);
                })

                UICtrl.loadPokeSize(pokemon);
                UICtrl.loadPokeHP(pokemon)
                UICtrl.clearPokeStats();
                UICtrl.loadPokeStats(pokemon);
            })
        })

    }

    return{
        init(){
            console.log("Starting App...")
            createPokeList()
        }
    }
})(APIController,UIController);

APPController.init();



