import type {Product} from "./types";

import {useEffect, useMemo, useState} from "react";

import api from "./api";

const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat("es-UY", {style: "currency", currency: "UYU"});

  return formatter.format(price);
};

enum SORT {
  ALPHABETICALLY = "alpha",
  PRICE = "price",
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>(() => localStorage.getItem("query") || "");
  const [sort, setSort] = useState<string>(
    () => localStorage.getItem("sort") || SORT.ALPHABETICALLY,
  );

  console.log(sort);

  useEffect(() => {
    api.search(query).then(setProducts);
  }, [query]);

  useEffect(() => {
    localStorage.setItem("query", query);
    localStorage.setItem("sort", sort);
  }, [query, sort]);

  const sortedItems = useMemo(() => {
    let productsToSort: Product[] = Array.from(products);
    let sortedProducts: Product[] = [];

    if (sort == SORT.ALPHABETICALLY) {
      sortedProducts = productsToSort.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();

        if (aTitle > bTitle) {
          return 1;
        }

        if (bTitle > aTitle) {
          return -1;
        }

        return 0;
      });
    }

    if (sort == SORT.PRICE) {
      sortedProducts = productsToSort.sort((a, b) => {
        if (a.price > b.price) {
          return -1;
        }

        if (b.price > a.price) {
          return 1;
        }

        return 0;
      });
    }

    return sortedProducts;
  }, [sort, products]);

  return (
    <main>
      <h1>Tienda digitaloncy</h1>
      <input
        name="text"
        placeholder="tv"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select defaultValue={sort} id="" name="sort" onChange={(ev) => setSort(ev.target.value)}>
        <option value={SORT.ALPHABETICALLY}>Alpha</option>
        <option value={SORT.PRICE}>Price</option>
      </select>
      <ul>
        {sortedItems.map((product) => (
          <li key={product.id}>
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <span>{formatPrice(product.price)}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
