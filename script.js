const pokeDex = {
      init() {
        console.log("iniciando")
        this.getPokemon();
      },

     async getPokemon () {
      try {
        const url = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=150&offset=0");
        console.log(url)
        if(!url.ok) {
          throw Error("Erro aos buscar dados da api");
        }
        const apiResults = await url.json();
        const promises = apiResults.results.map((result => fetch(result.url)))
        const responses = await Promise.allSettled(promises);
        const fulfilled = responses.filter(res => res.status === "fulfilled")
        const pokePromises = fulfilled.map(url => url.value.json())
        const pokemons = await Promise.all(pokePromises)
        console.log("RESPONSES_pokemons", pokemons)
        this.cardPokemonHTML(pokemons);
      } catch (error) {
        console.log(error);
      }
    },

    cardPokemonHTML(dados) {
      let carPoke = document.querySelector(".card")
      for(let i in dados) {
        let typesHTML = '';
        let colorPoke = '';
        for(let x in dados[i].types) {
          typesHTML += `
            <span;>
              <p>${dados[i].types[x].type.name}</p>
            </span;>
            `
           colorPoke = dados[i].types[0].type.name;
        }
        document.querySelector(".card").classList.add()
        carPoke.innerHTML += `
        <div class="pokemon ${colorPoke}">          
              <div class="img-container">
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${dados[i].id}.gif">
              </div>
              <div class="info">
                  <span class="number">#${dados[i].id}</span>
                  <h2 class="name">${dados[i].name.toUpperCase()}</h2>      
                  <small class="type">Type: ${typesHTML.toUpperCase()} </small>
              </div>
          </div>
        `
      }
    }
}
pokeDex.init();
