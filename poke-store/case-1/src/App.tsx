import type {Pokemon} from "./types";

import {SyntheticEvent, useMemo, useState} from "react";

import {POKEMONS} from "./constants";

const getTotal = (cart: Pokemon[]) => {
  return cart.reduce((total, item) => total + item.price, 0);
};

const isFav = (id: Pokemon["id"], favs: string[]) => favs.find((f: string) => f == id);

function App() {
  const [cart, setCart] = useState<Pokemon[]>([]);
  const [query, setQuery] = useState<string>("");
  const [favs, setFavs] = useState<Pokemon["id"][]>(
    () => JSON.parse(localStorage.getItem("pokemon-favs") || "[]") || [],
  );

  const pokemonsQuery = useMemo(
    () => POKEMONS.filter((pokemon) => pokemon.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const total = useMemo(() => getTotal(cart), [cart]);

  const handleQuery = (ev: SyntheticEvent) => {
    setQuery((ev.target as HTMLInputElement).value);
  };

  const handleFav = (id: Pokemon["id"]) => {
    const newFavs = Array.from(favs);
    const favIdx = favs.findIndex((fav) => fav === id);

    if (favIdx != -1) {
      newFavs.splice(favIdx, 1);
    } else {
      newFavs.push(id);
    }
    localStorage.setItem("pokemon-favs", JSON.stringify(newFavs));
    setFavs(newFavs);
  };

  return (
    <>
      <nav>
        <input
          className="nes-input"
          id="name_field"
          placeholder="Charmander"
          type="text"
          value={query}
          onChange={(ev) => handleQuery(ev)}
        />
      </nav>
      <section>
        {pokemonsQuery.map((pokemon) => (
          <article key={pokemon.id}>
            <figure>
              <img className="nes-container" src={pokemon.image} />
              <i
                className={`nes-icon is-medium ${
                  isFav(pokemon.id, favs) ? "is-filled" : "is-transparent"
                } heart`}
                onClick={() => handleFav(pokemon.id)}
              />
            </figure>
            <div>
              <p>
                {pokemon.name} (${pokemon.price})
              </p>
              <p>{pokemon.description}</p>
            </div>
            <button
              className="nes-btn"
              onClick={() =>
                setCart(() => (total + pokemon.price <= 10 ? cart.concat(pokemon) : cart))
              }
            >
              Agregar
            </button>
          </article>
        ))}
      </section>
      <aside>
        <button className="nes-btn is-primary">
          {cart.length} items (total ${total})
        </button>
      </aside>
    </>
  );
}

export default App;
