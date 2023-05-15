function Main() {
  document.querySelector("[data-search]").addEventListener("change", (e) => {
    document.querySelector(".list").innerHTML = "";
    document.querySelector(".pagination").innerHTML = "";
    pokeDex.getSearchPokemon(e.target.value.toLowerCase());
  })
}

const main = new Main();