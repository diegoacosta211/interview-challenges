import type {Pokemon} from "./types";

import {memo} from "react";

type PokemonCardProps = {
  pokemon: Pokemon;
  onAdd: React.Dispatch<React.SetStateAction<Pokemon[]>>;
};

function PokemonCard({pokemon, onAdd}: PokemonCardProps) {
  return (
    <article key={pokemon.id}>
      <img className="nes-container" src={pokemon.image} />
      <div>
        <p>{pokemon.name}</p>
        <p>{pokemon.description}</p>
      </div>
      <button className="nes-btn" onClick={() => onAdd((cart) => cart.concat(pokemon))}>
        Agregar
      </button>
    </article>
  );
}

/*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
*/
export default memo(PokemonCard, (prevProps, nextProps) => prevProps.onAdd === nextProps.onAdd);
