import {useCallback, useEffect, useState} from "react";

import api from "./api";

function App() {
  const [answer, setAnwser] = useState<string>("");
  const [turn, setTurn] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<"playing" | "finished">("playing");
  const [words, setWords] = useState<string[][]>(() =>
    Array.from({length: 6}, () => new Array(5).fill("")),
  );

  useEffect(() => {
    (async () => {
      const word = await api.word.random();

      setLoading(false);
      setAnwser(word);
    })();
  }, []);

  const resetGame = useCallback(() => {
    if (status === "finished") {
      setTurn(0);
      setStatus("playing");
      setLoading(true);
      (async () => {
        const word = await api.word.random();

        setLoading(false);

        setAnwser(word);
      })();
      setWords(Array.from({length: 6}, () => new Array(5).fill("")));
    }
  }, [status]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (status === "finished" && event.key == "Enter") {
        resetGame();
      }
      if (status === "playing") {
        switch (event.key) {
          case "Enter": {
            if (words[turn].some((letter) => letter === "")) {
              return;
            }

            if (words[turn].join("") === answer) {
              setStatus("finished");
            }

            setTurn((turn) => turn + 1);

            return;
          }
          case "Backspace": {
            let firstEmptyIndex = words[turn].findIndex((letter) => letter === "");

            if (firstEmptyIndex === -1) {
              firstEmptyIndex = words[turn].length;
            }

            words[turn][firstEmptyIndex - 1] = "";

            setWords(words.slice());

            return;
          }
          default: {
            if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
              const firstEmptyIndex = words[turn].findIndex((letter) => letter === "");

              if (firstEmptyIndex === -1) return;

              words[turn][firstEmptyIndex] = event.key.toUpperCase();

              setWords(words.slice());

              return;
            }
          }
        }
      }
    },
    [turn, words, status, answer, resetGame],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) return <>Loading...</>;

  return (
    <main className="board">
      {words.map((word, wordIndex) => (
        <section className="word">
          {word.map((letter, letterIndex) => {
            const isCorrect = letter && wordIndex < turn && letter === answer[letterIndex];
            const isPresent =
              letter &&
              wordIndex < turn &&
              letter !== answer[letterIndex] &&
              answer.includes(letter);

            return (
              <article className={`letter ${isPresent && "present"} ${isCorrect && "correct"}`}>
                {letter}
              </article>
            );
          })}
        </section>
      ))}
    </main>
  );
}

export default App;
