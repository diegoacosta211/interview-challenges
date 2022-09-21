import type {Product} from "./types";

import {memo, useEffect, useState} from "react";

import api from "./api";

function Recommended() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.search().then(setProducts);
  }, []);

  return (
    <main>
      <h1>Productos recomendados</h1>
      <ul>
        {[...products]
          .sort(() => (Math.random() > 0.5 ? 1 : -1))
          .slice(0, 2)
          .map((product) => (
            <li key={product.id}>
              <h4>{product.title}</h4>
              <p>{product.description}</p>
              <span>$ {product.price}</span>
            </li>
          ))}
      </ul>
    </main>
  );
}

const MemoizedRecommended = memo(Recommended);

const debounce = (func: () => void, timeout = 300) => {
  let timer: number;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout)
  }
}

type Fav = {
  [k: string]: boolean
}

function App() {
  const [query, setQuery] = useState<string>("");
  const [favs, setFavs] = useState(() => JSON.parse(localStorage.getItem("favs") || "{}") || []);
  // const [favs, setFavs] = useState({});
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    console.log(favs);
    const debouncedSearch = debounce(() => api.search(query).then(products => {
      setProducts(products.map(product => ({ ...product, fav: favs.find((f: number) => f == product.id) })));
    }), 800);
    debouncedSearch();
  }, [query]);

  useEffect(() => {
    localStorage.setItem("favs", JSON.stringify(favs));
    console.log(favs);
    setProducts(products.map(product => ({ ...product, fav: favs.find((f: number) => f == product.id) })));
  }, [favs]);

  const handleFav = (pId: number) => {
    const favsCopy = [...favs];
    const favIndex = favsCopy.findIndex(f => f == pId);
    if (favIndex != -1) {
      console.log(favIndex, 'existe')
      favsCopy.splice(favIndex, 1);
    } else {
      console.log(favIndex, 'no existe')
      favsCopy.push(pId);
    }
    setFavs(favsCopy);
  }

  return (
    <main>
      <h1>Tienda digitaloncy</h1>
      <input name="text" placeholder="tv" type="text" onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {products.map((product) => (
          <li key={product.id} onClick={() => handleFav(product.id)} className={product.fav ? 'fav' : ''}>
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <span>$ {product.price}</span>
          </li>
        ))}
      </ul>
      <hr />
      <MemoizedRecommended />
    </main>
  );
}

export default App;
