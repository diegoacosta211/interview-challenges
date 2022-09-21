import type {Pokemon} from "./types";

import {useCallback, useState} from "react";

import {POKEMONS} from "./constants";
import PokemonCard from "./PokemonCard";

type CartItem = {
  pokemon: Pokemon;
  qty: number;
};

function App() {
  const [cart, setCart] = useState<Record<Pokemon["id"], CartItem>>(
    () => JSON.parse(localStorage.getItem("pokemon-cart") || "{}") || {},
  );

  const getCartTotalItems = useCallback(() => {
    return Object.values(cart).reduce((totalItems, cartItem) => totalItems + cartItem.qty, 0);
  }, [cart]);

  const handleAddCart = (pokemon: Pokemon) => {
    setCart((cart) => {
      const newCart = Object.assign({}, cart);

      newCart[pokemon.id] = {
        pokemon,
        qty: 1,
      };

      localStorage.setItem("pokemon-cart", JSON.stringify(newCart));

      return newCart;
    });
  };

  const handleIncrement = (pokemon: Pokemon) => {
    setCart((cart) => {
      const newCart = Object.assign({}, cart);

      newCart[pokemon.id] = {
        pokemon,
        qty: newCart[pokemon.id].qty + 1,
      };

      localStorage.setItem("pokemon-cart", JSON.stringify(newCart));

      return newCart;
    });
  };

  const handleDecrement = (pokemon: Pokemon) => {
    setCart((cart) => {
      const newCart = Object.assign({}, cart);

      newCart[pokemon.id] = {
        pokemon,
        qty: newCart[pokemon.id].qty - 1,
      };

      localStorage.setItem("pokemon-cart", JSON.stringify(newCart));

      return newCart;
    });
  };

  return (
    <>
      <nav>
        <input className="nes-input" id="name_field" placeholder="Charmander" type="text" />
      </nav>
      <section>
        {POKEMONS.map((pokemon) => (
          // <PokemonCard key={pokemon.id} pokemon={pokemon} onAdd={setCart} />
          // traer el componente hacia aca, hubiera solucionado el punto 1
          <article key={pokemon.id}>
            <img className="nes-container" src={pokemon.image} />
            <div>
              <p>{pokemon.name}</p>
              <p>{pokemon.description}</p>
            </div>
            {!cart[pokemon.id] || cart[pokemon.id].qty == 0 ? (
              <button className="nes-btn" onClick={() => handleAddCart(pokemon)}>
                Agregar
              </button>
            ) : (
              <>
                <button className="nes-btn" onClick={() => handleDecrement(pokemon)}>
                  -
                </button>
                {cart[pokemon.id].qty}
                <button className="nes-btn" onClick={() => handleIncrement(pokemon)}>
                  +
                </button>
              </>
            )}
          </article>
        ))}
      </section>
      <aside>
        <button className="nes-btn is-primary">{getCartTotalItems()} items (total $0)</button>
      </aside>
    </>
  );
}

export default App;
