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
        getPokemon(id){
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
        lblAbility: '#lblAbility',
        lblForm: '#lblForm'
    }

    return{
        //public acessor of HTML elements
        inputFields(){
            return{
                pokeList: document.querySelector(DOMElements.selectPokemon),
                pokeImage: document.querySelector(DOMElements.imgPokemon),
                pokeAbility: document.querySelector(DOMElements.lblAbility),
                pokeForm: document.querySelector(DOMElements.lblForm)
            }
        },
        addToPokeList(pokemon){
            const html = `<option value="${pokemon.url}">${pokemon.name}</option>`
            document.querySelector(DOMElements.selectPokemon).insertAdjacentHTML('beforeend',html);
        },
        loadPokePicture(pokemon){
            document.querySelector(DOMElements.imgPokemon).src = pokemon.sprites.front_default;
        },
        loadPokeInfo(pokemon){
            document.querySelector(DOMElements.lblAbility).textContent = pokemon.abilities[0].ability.name;
            document.querySelector(DOMElements.lblForm).textContent = pokemon.forms[0].name;
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
            const pokePromise = APICtrl.getPokemon(pokeEP);
            pokePromise.then((pokemon) =>{
                UICtrl.loadPokePicture(pokemon)
                UICtrl.loadPokeInfo(pokemon)
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



