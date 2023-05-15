const pokeDex = {
  init() {
    this.getPokemon();
  },
  async getPokemon() {
    try {
      const url = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=100&offset=0");
      if (!url.ok) {
        throw Error("Erro aos buscar dados da api");
      }
      const apiResults = await url.json();
      const promises = apiResults.results.map((result => fetch(result.url)))
      const responses = await Promise.allSettled(promises);
      const fulfilled = responses.filter(res => res.status === "fulfilled")
      const pokePromises = fulfilled.map(url => url.value.json())
      const pokemons = await Promise.all(pokePromises)
      return pokemons
    } catch (error) {
      console.log(error);
    }
  },
  async getSearchPokemon(pokeName) {
    try {
      const url = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
      if (!url.ok) {
        throw Error("Erro aos buscar dados da api");
      }
      const apiResults = await url.json();
      console.log("1pokemon", apiResults)
      this.template(apiResults)
      
 
    } catch (error) {
      console.log(error);
    }
  },
  template(dados) {
    let template = `
    <div class="pokemon">          
      <div class="img-container">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${dados.id}.gif">
      </div>
      <div class="info">
        <span class="number">#${dados.id}</span>
          <h2 class="name">${dados.name.toUpperCase()}</h2>      
  
        </div>
    </div>`

    document.querySelector(".list").innerHTML = template;
  }
}