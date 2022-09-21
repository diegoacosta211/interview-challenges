import {useEffect, useState} from "react";

import api from "./api";
import {Pokemon} from "./types";

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [cart, setCart] = useState<Pokemon[]>([]);

  useEffect(() => {
    api.list().then(setPokemons);
  }, []);

  const handleAddCart = (pokemon: Pokemon) => {
    if (cart.length >= 3) return;
    setCart((prev) => [pokemon, ...prev]);
  };

  if (!pokemons.length) return <p>Loading...</p>;

  return (
    <>
      <section>
        {pokemons.map((pokemon) => (
          <article key={pokemon.id}>
            <img className="nes-container" src={pokemon.image} />
            <div>
              <p>
                {pokemon.name} - {`$${pokemon.price}`}
              </p>
              <p>{pokemon.description}</p>
            </div>
            <button className="nes-btn" onClick={() => handleAddCart(pokemon)}>
              Agregar
            </button>
          </article>
        ))}
      </section>
      <aside>
        <button className="nes-btn is-primary">{cart.length} items</button>
      </aside>
    </>
  );
}

export default App;
