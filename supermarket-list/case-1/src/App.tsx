import type {Item} from "./types";

import {useEffect, useRef, useState} from "react";

import styles from "./App.module.scss";
import api from "./api";

interface Form extends HTMLFormElement {
  text: HTMLInputElement;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleToggle(id: Item["id"]) {
    setItems((items) =>
      items.map((item) => (item.id === id ? {...item, completed: !item.completed} : item)),
    );
  }

  function handleAdd(event: React.ChangeEvent<Form>) {
    event.preventDefault();
    const target = event.target;

    if (target) {
      setItems((prev) => {
        const formData = new FormData(target);

        const id = prev[prev.length - 1].id + 1;

        const text = formData.get("text") as string;
        const completed = false;

        return [...prev, {id, text, completed}];
      });
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [items]);

  function handleRemove(id: Item["id"]) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  useEffect(() => {
    api.list().then(setItems);
  }, []);

  return (
    <main className={styles.main}>
      <h1>Supermarket list</h1>
      <form onSubmit={handleAdd}>
        <input ref={inputRef} required name="text" type="text" />
        <button>Add</button>
      </form>
      {items.length ? (
        <ul>
          {items?.map((item) => (
            <li
              key={item.id}
              className={item.completed ? styles.completed : ""}
              onClick={() => handleToggle(item.id)}
            >
              {item.text} <button onClick={() => handleRemove(item.id)}>[X]</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}

export default App;
