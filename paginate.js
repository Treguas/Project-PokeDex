function Paginate() {
  this.data = Array.from({
    length: 100
  }).map((item, index) => `item - ${(index + 1)}`)

  const html = {
    get(element) {
      return document.querySelector(element);
    },
    getAll(element) {
      return document.querySelectorAll(element);
    },
  }

  let state = {
    page: 1,
    perPage: 5,
    totalPage: Math.ceil(this.data.length / 5),
    maxVisibleButtons: 5
  }

  this.init = () => {
      controls.createListeners();
      update();
  }

  const controls = {
    next() {
      state.page++;
      const lastPage = state.page > state.totalPage;
      if (lastPage) {
        state.page--
      }
    },
    prev() {
      state.page--
      if (state.page < 1) state.page++;
    },
    goTo(page) {
      if (page < 1) page = 1;
      state.page = Number(page);
      if (page > state.totalPage) state.page = state.totalPage;
    },
    createListeners() {
      html.get(".first").addEventListener("click", () => {
        controls.goTo(1);
        update();
      })
      html.get(".last").addEventListener("click", () => {
        controls.goTo(state.totalPage);
        update();
      })
      html.get(".next").addEventListener("click", () => {
        controls.next();
        update();
      })
      html.get(".prev").addEventListener("click", () => {
        controls.prev(1);
        update();
      })
    }
  }

  const buttons = {
    update() {
      html.get(".numbers").innerHTML = "";
      const {
        maxLeft,
        maxRight
      } = buttons.calculateMaxVisible();

      console.log(maxLeft, maxRight)

      for (let page = maxLeft; page <= maxRight; page++) {
        button = document.createElement("div");
        button.innerHTML = page;

        if (state.page == page) button.classList.add("active")

        button.addEventListener("click", (event) => {
          const page = event.target.innerText;
          controls.goTo(page)
          update();
        })
        html.get(".numbers").appendChild(button);
      }
    },
    calculateMaxVisible() {
      const {
        maxVisibleButtons
      } = state;

      let maxLeft = (state.page - Math.floor(maxVisibleButtons / 2))
      let maxRight = (state.page + Math.floor(maxVisibleButtons / 2))
      console.log(maxLeft, maxRight)

      if (maxLeft < 1) {
        maxLeft = 1;
        maxRight = maxVisibleButtons;
      }

      if (maxRight > state.totalPage) {
        maxLeft = state.totalPage - (maxVisibleButtons - 1)
        maxRight = state.totalPage
        if (maxLeft < 1) maxLeft = 1;
      }

      return {
        maxLeft,
        maxRight
      }
    }
  }

  const updateList = () => {
    html.get(".list").innerHTML = "";
    let page = state.page - 1;
    let start = page * state.perPage;
    let end = start + state.perPage;
    const paginatedItems = this.data.slice(start, end);
    paginatedItems.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("item");
      div.innerHTML = item
      html.get(".list").appendChild(div)
    })
  }

  const update = async () => {
    this.data = await pokeDex.getPokemon().then((response) => {
      this.data = cardPokemonHTML(response);
      updateList();
      buttons.update();
    })
  }

  const cardPokemonHTML = (dados)=> {
    const arrDados = [];
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
      let template = `
      <div class="pokemon ${colorPoke}">          
        <div class="img-container">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${dados[i].id}.gif">
        </div>
        <div class="info">
          <span class="number">#${dados[i].id}</span>
            <h2 class="name">${dados[i].name.toUpperCase()}</h2>      
             <small class="type">Type: ${typesHTML.toUpperCase()} </small>
          </div>
      </div>`

      arrDados.push(template.trim())
    }
    return arrDados;
  }
}

const paginate = new Paginate();
paginate.init();