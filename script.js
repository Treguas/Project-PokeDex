const pokeDex = {
      init() {
        this.getPokemon();
      },
     async getPokemon () {
      try {
        const url = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=100&offset=0");
        if(!url.ok) {
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
    }
}
